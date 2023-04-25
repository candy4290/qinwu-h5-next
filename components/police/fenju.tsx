import DutyLevel, { DutyLevelProps } from './duty-level';
import apis from '@/utils/apis';
import { useSafeState } from 'ahooks';
import { Tabs } from 'antd-mobile';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { useContext, useEffect } from 'react';
import { CurrentOrgContext, CurrentOrgInterface } from '@/pages/home/police';
import { BarTitle } from './bar';
import DutyLeader from './duty-leader';
import PoliceStrengthItem from './police-strength-item';
import { StatisticData, StatisticsDataInterface } from './statistics-data';

/* 分局-动态tabs;常态勤务：派出所/业务部门&机关单位；非常态：增加了等级勤务tab */
function DynamicTabs(props: {currentOrg: CurrentOrgInterface, dutyLevel: DutyLevelProps['dutyLevelValue']}) {
    const {currentOrg, dutyLevel} = props;
    const [loading, setLoading] = useSafeState(true);
    const [data, setData] = useSafeState<any>({
        4: {},
        '2,3': {},
        '': {}
    });

    useEffect(() => {
        setLoading(true);
        Promise.all([
            axios.get(apis.getDataByPost, { /* 派出所 */
                params: {
                    orgCode: currentOrg.orgCode,
                    jgsxs: '4'
                }
            }),
            axios.get(apis.getDataByPost, { /* 业务部门&机关单位 */
                params: {
                    orgCode: currentOrg.orgCode,
                    jgsxs: '3,2'
                }
            }),
            axios.get(apis.getDataByPost, { /* 等级勤务 */
                params: {
                    orgCode: currentOrg.orgCode,
                }
            }),
        ]).then((rsp: any) => {
            const temp: any = {
                4: {},
                '2,3': {},
                '': {}
            };
            rsp.forEach((item: any, idx: number) => {
                item.forEach((i: any) => {
                    let t;
                    if (idx === 0) {
                        t = temp[4]
                    } else if (idx === 1) {
                        t = temp['2,3']
                    } else {
                        t = temp['']
                    }
                    t[i.postTypeId] = i;
                });
            })
            setData(temp);
            setLoading(false);
        }, () => setLoading(false))
    }, [currentOrg, setData, setLoading]);
    return (
        <Tabs defaultActiveKey='4' style={{marginTop: 26}} >
            <Tabs.Tab title={<BarTitle title='派出所' />} key='4' destroyOnClose={true}>
                {
                    !loading &&
                    <div className='mt-2 flex flex-wrap justify-between'>
                        <PoliceStrengthItem data={data['4']['2000']} />
                        <PoliceStrengthItem data={data['4']['2001']} />
                        <PoliceStrengthItem data={data['4']['2002']} />
                        <PoliceStrengthItem data={data['4']['2003']} />
                        <PoliceStrengthItem data={data['4']['2004']} />
                        <PoliceStrengthItem data={data['4']['2005']} />
                    </div>
                }
            </Tabs.Tab>
            <Tabs.Tab title={<BarTitle title='业务部门&机关单位' hasSplit={dutyLevel !== '0' ? true : false} />} key='2,3' destroyOnClose={true}>
            {
                !loading &&
                <div className='mt-2 flex flex-wrap justify-between'>
                    <PoliceStrengthItem data={data['2,3']['2000']} postTypeName='业务-街面警力' />
                    <PoliceStrengthItem data={data['2,3']['2003']} postTypeName='业务-窗口警力' />
                    <PoliceStrengthItem data={data['2,3']['2016']} />
                </div>
            }
            </Tabs.Tab>
            {
                dutyLevel !== '0' &&
                <Tabs.Tab title={<BarTitle title='等级勤务' hasSplit={false} />} key='' destroyOnClose={true}>
                {
                    !loading &&
                    <div className='mt-2 flex flex-wrap justify-between'>
                        <PoliceStrengthItem data={data['']['2013']} postTypeName='动中-备勤警力' />
                        <PoliceStrengthItem data={data['']['2015']} />
                    </div>
                }
                </Tabs.Tab>
            }
        </Tabs>
    )
}

export default function Fenju(props: { currentOrg: CurrentOrgInterface }) {
    const { currentOrg } = props;
    const [dutyLevel, setDutyLevel] = useSafeState<DutyLevelProps['dutyLevelValue']>('0');
    const [tjData, setTjData] = useSafeState<StatisticsDataInterface>({
        totayCardPeopleNum: 0,
        currentCardPeopleNum: 0,
        currentDutyPeopleNum: 0,
        totayDutyPeopleNum: 0
    });
    const setCurrentOrg = useContext(CurrentOrgContext);

    useEffect(() => {
        axios.get(apis.getDutyLevel, { /* 获取等级勤务 */
            params: {
                dutyDate: moment().format('yyyy-MM-DD'),
                orgCode: currentOrg.orgCode
            }
        }).then((rsp: any) => {
            setDutyLevel(rsp['duty_level'] || '0')
        });
        axios.get(apis.getTjData, { /* 获取当日、当前排班、当前打卡 */
            params: {
                orgCode: currentOrg.orgCode
            }
        }).then((rsp: any) => {
            setTjData(rsp);
        });
    }, [setDutyLevel, currentOrg, setTjData]);

    return (
        <div className='px-5 pb-6 fj'>
            <DutyLevel dutyLevelValue={dutyLevel} currentOrg={currentOrg} style={{ margin: '25px 0' }} />
            <DutyLeader currentOrg={currentOrg} />
            <StatisticData data={tjData} style={{marginTop: 18}} />
            <DynamicTabs currentOrg={currentOrg} dutyLevel={dutyLevel} />
            <div className='mt-[14px] bg-[#008fff] rounded-3xl h-[45px] text-center text-lg font-semibold text-white leading-[45px]' onClick={() => setCurrentOrg((org: any) => {
                const temp = _.cloneDeep(org);
                temp.isZongLan = true;
                return temp;
            })}>
                下属单位警力总览
            </div>
        </div>
    )
}