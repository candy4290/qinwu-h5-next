import DutyLevel, { DutyLevelProps } from './duty-level';
import { useSafeState } from 'ahooks';
import { CurrentOrgInterface } from '@/pages/home/police';
import DutyLeader from './duty-leader';
import PoliceStrengthItem from './police-strength-item';
import { useEffect } from 'react';
import axios from 'axios';
import apis from '@/utils/apis';
import moment from 'moment';
import { StatisticsDataInterface } from './statistics-data';
import Image from 'next/image';

function StatisticData(props: {data: any}) {
    const {data = {}} = props;
    return (
        <div className='mt-18 bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] h-[161px] py-4 px-3 relative rounded-[20px] overflow-hidden'>
            <div className='absolute h-14 flex items-center top-4 left-3'>
                <Image className='mr-[2px]' alt='' width={56} height={56} src='/imgs/statistics/icon-单位总人数@2x.png' />
                <div className='flex flex-col justify-between'>
                    <span className='text-[#333] text-sm'>单位总人数</span>
                    <span className='text-[#008fff] text-2xl'>{+data.totalPeronNum || 0}</span>
                </div>
            </div>
            <div className='absolute h-14 flex items-center bottom-4 left-3'>
                <Image className='mr-[2px]' alt='' width={56} height={56} src='/imgs/statistics/icon-上月排班天数@2x.png' />
                <div className='flex flex-col justify-between'>
                    <span className='text-[#333] text-sm'>当日排班数</span>
                    <span className='text-[#008fff] text-2xl' style={{ color: '#00D7FF' }}>{data.totayCardPeopleNum || 0}</span>
                </div>
            </div>
            <div className='absolute h-14 flex items-center bottom-4 left-[168px]'>
                <Image className='mr-[2px]' alt='' width={56} height={56} src='/imgs/statistics/icon-本月排班天数@2x.png' />
                <div className='flex flex-col justify-between'>
                    <span className='text-[#333] text-sm'>当前排班数</span>
                    <span className='text-[#008fff] text-2xl' style={{ color: '#476FF2' }}>{data.currentDutyPeopleNum || 0}</span>
                </div>
            </div>
        </div>
    )
}

export default function PaiChuSuo(props: { currentOrg: CurrentOrgInterface }) {
    const { currentOrg } = props;

    const [dutyLevel, setDutyLevel] = useSafeState<DutyLevelProps['dutyLevelValue']>('0');
    const [data, setData] = useSafeState<any>({}); /* 一级岗位警力数 */
    const [statisticData, setStatisticData] = useSafeState<StatisticsDataInterface>();
    
    useEffect(() => {
        axios.get(apis.getDutyLevel, { /* 获取等级勤务 */
            params: {
                dutyDate: moment().format('yyyy-MM-DD'),
                orgCode: currentOrg.orgCode
            }
        }).then((rsp: any) => {
            setDutyLevel(rsp['duty_level'] || '0')
        });

        axios.get(apis.getDataByPost, { /* 一级岗位总览 */
            params: {
                orgCode: currentOrg.orgCode,
            }
        }).then((rsp: any) => {
            const temp: any = {};
            rsp.forEach((i: any) => {
                temp[i.postTypeId] = i;
            })
            setData(temp)
        });

        Promise.all([
            axios.get(apis.getTjData, { /* 当日排班数+当前排班数 */
                params: {
                    orgCode: currentOrg.orgCode,
                }
            }),
            axios.get(apis.getAllPersonNumsOfOrg, { /* 获取总人数 */
                params: {
                    orgCode: currentOrg.orgCode,
                }
            })
        ]).then((rsp: any) => {
            setStatisticData({...rsp[0], ...rsp[1]})
        })
    }, [setDutyLevel, setData, setStatisticData, currentOrg]);

    return (
        <div className='py-5 px-6'>
            <DutyLevel dutyLevelValue={dutyLevel} currentOrg={currentOrg} />
            <DutyLeader currentOrg={currentOrg} />
            <StatisticData data={statisticData} />
            {
                Object.keys(data).length > 0 &&
                <div className='mt-[18px] flex flex-wrap justify-between'> 
                    <PoliceStrengthItem data={data['2000']} />
                    <PoliceStrengthItem data={data['2003']} />
                    <PoliceStrengthItem data={data['2001']} />
                    <PoliceStrengthItem data={data['2004']} />
                    <PoliceStrengthItem data={data['2002']} />
                    <PoliceStrengthItem data={data['2005']} />
                </div>
            }
        </div>
    )
}