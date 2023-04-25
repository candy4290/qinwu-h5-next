import DutyLevel, { DutyLevelProps } from './duty-level';
import { Tabs } from 'antd-mobile';
import { BarContent, BarTitle } from './bar';
import { StatisticData } from './statistics-data';
import OrgItem from './org-item';
import { useEffect } from 'react';
import axios from 'axios';
import apis from '@/utils/apis';
import { useSafeState } from 'ahooks';
import moment from 'moment';
import { CurrentOrgInterface } from '@/utils/types';

/* 警力总览/值班警力/街面/社会面防控/备勤 */
export function PoliceStrengthInfoType(props: {topData: any, jgsx: string, currentOrg: CurrentOrgInterface, postTypeId: string}) {
    const {jgsx, currentOrg, postTypeId, topData} = props;
    const [downOrglist, setDownOrglist] = useSafeState<any[] | any[][]>([]); /* 下级机构警力安排信息 */
    useEffect(() => {
        const tempIdx = postTypeId.indexOf(',')
        if (tempIdx > -1) {
            Promise.all([
                axios.get(apis.getDownOrgsInfo, { /* 集中 */
                    params: {
                        jgsx,orgCode: currentOrg.orgCode,postTypeId: postTypeId.slice(0, tempIdx)
                    }
                }),
                axios.get(apis.getDownOrgsInfo, { /* 动中 */
                    params: {
                        jgsx,orgCode: currentOrg.orgCode,postTypeId: postTypeId.slice(tempIdx + 1)
                    }
                }),
            ]).then((rsp: any) => {
                const temp: any = [];
                rsp[0].forEach((i: any, idx: any) => {
                    temp.push([i,rsp[1][idx]])
                })
                setDownOrglist(temp);
            })
        } else {
            axios.get(apis.getDownOrgsInfo, {
                params: {
                    jgsx,orgCode: currentOrg.orgCode,postTypeId
                }
            }).then((rsp: any) => {
                setDownOrglist(rsp || []);
            })
        }
    }, [jgsx, currentOrg, postTypeId, setDownOrglist]);

    return (
        <BarContent>
            <StatisticData data={postTypeId.includes(',') ? [topData[postTypeId.split(',')[0]], topData[postTypeId.split(',')[1]]] : topData[postTypeId]} />
            {
                downOrglist.map(item => {
                    return <OrgItem key={item.orgCode || item[0].orgCode} info={item} />
                })
            }
        </BarContent> 
    )
}

/* 市局用户的总览页 */
export default function Shiju(props: { currentOrg: CurrentOrgInterface }) {
    const { currentOrg } = props;
    const [dutyLevel, setDutyLevel] = useSafeState<DutyLevelProps['dutyLevelValue']>('0');
    const [topInfo, setTopInfo] = useSafeState<any>({});
    useEffect(() => {
        axios.get(apis.getDutyLevel, { /* 等级勤务 */
            params: {
                dutyDate: moment().format('yyyy-MM-DD'),
                orgCode: currentOrg.orgCode
            }
        }).then((rsp: any) => {
            setDutyLevel(rsp['duty_level'] || '0')
        });
        axios.get(apis.getSjTopData, { /* 当日排班、当前；当前打卡 */
            params: {
                orgCode: currentOrg.orgCode
            }
        }).then((rsp: any) => {
            const temp: any = {};
            rsp.postDutyCardVOs.forEach((i: any) => {
                temp[i.postTypeId] = i;
            })
            temp[''] = rsp.totalDutyCardVO;
            setTopInfo(temp);
        })
    }, [setDutyLevel, setTopInfo, currentOrg])

    return (
        <div>
            <div className="h-[309px] w-screen bg-[url('/imgs/statistics/top-bg@2x.png')] bg-cover overflow-hidden">
                <DutyLevel dutyLevelValue={dutyLevel} currentOrg={currentOrg} style={{ margin: '25px 20px' }} />
            </div>
            <div className='mt-[-196px] pt-6 bg-[#f9f9f9] rounded-t-[40px]'>
                <Tabs defaultActiveKey='1' style={{marginTop: -9}} >
                    <Tabs.Tab title={<BarTitle title='警力总览' />} key='1' destroyOnClose={true}>
                        <PoliceStrengthInfoType jgsx={'1'} currentOrg={currentOrg} postTypeId='' topData={topInfo} />
                    </Tabs.Tab>
                    <Tabs.Tab title={<BarTitle title='值班警力' />} key='2' destroyOnClose={true}>
                        <PoliceStrengthInfoType jgsx={'1'} currentOrg={currentOrg} postTypeId='0003' topData={topInfo} />
                    </Tabs.Tab>
                    <Tabs.Tab title={<BarTitle title='街面警力' />} key='3' destroyOnClose={true}>
                        <PoliceStrengthInfoType jgsx={'1'} currentOrg={currentOrg} postTypeId='2000' topData={topInfo} />
                    </Tabs.Tab>
                    <Tabs.Tab title={<BarTitle title='社会面防控警力' hasSplit={dutyLevel !== '0' ? true : false} />} key='4' destroyOnClose={true}>
                        <PoliceStrengthInfoType jgsx={'1'} currentOrg={currentOrg} postTypeId='12000' topData={topInfo} />
                    </Tabs.Tab>
                    {
                        dutyLevel !== '0' &&
                        <Tabs.Tab title={<BarTitle title='备勤警力' hasSplit={false} />} key='5' destroyOnClose={true}>
                            <PoliceStrengthInfoType jgsx={'1'} currentOrg={currentOrg} postTypeId='0002,2013' topData={topInfo} /> {/* 0002-集中 2013-动中 */}
                        </Tabs.Tab>
                    }
                </Tabs>
            </div>
        </div>
    )
}