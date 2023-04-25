import apis from '@/utils/apis';
import { useSafeState } from 'ahooks';
import axios from 'axios';
import { uniqueId } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { Empty } from 'antd-mobile';
import { CurrentOrgInterface } from '@/pages/home/police';
import Image from 'next/image';

/* 值班领导；值班长 */
export default function DutyLeader(props: { currentOrg: CurrentOrgInterface }) {
    const { currentOrg } = props;
    const [dutyType, setDutyType] = useSafeState<'1' | '2'>('2'); /* 2-值班领导 1-值班长 */
    const [leader, setLeader] = useSafeState({ 1: [], 2: [] });
    useEffect(() => {
        axios.get(apis.getDutyLeaders, {
            params: {
                orgId: currentOrg.orgCode,
                dutyDate: moment().format('yyyy-MM-DD')
            }
        }).then((rsp: any) => {
            const temp: any = { 1: [], 2: [] };
            (rsp || []).forEach((i: any) => {
                temp[i.dutyType].push(i);
            });
            setLeader(temp);
        })
    }, [currentOrg, setLeader])
    return (
        <div>
            <div className='pl-[22px] mt-6 mb-5 flex items-center'>
                <div className='text-[#333]/[.6] text-[18px] leading-[25px] mr-[2px]' style={{ color: dutyType === '2' ? '#008FFF' : 'rgba(51,51,51,.6)', fontWeight: dutyType === '2' ? 600 : 400, textShadow: dutyType === '2' ? '0px 5px 11px rgba(0,143,255,0.3686)' : 'none', }} onClick={() => setDutyType('2')}>值班领导</div>
                <div className='w-[1px] h-4 bg-[#707070]/[.2] mx-8'></div>
                <div className='text-[#333]/[.6] text-[18px] leading-[25px] mr-[2px]' style={{ color: dutyType === '1' ? '#008FFF' : 'rgba(51,51,51,.6)', fontWeight: dutyType === '1' ? 600 : 400, textShadow: dutyType === '1' ? '0px 5px 11px rgba(0,143,255,0.3686)' : 'none', }} onClick={() => setDutyType('1')}>值班长</div>
            </div>
            <div className='flex justify-between'>
                {
                    leader[dutyType].length === 0 &&
                    <Empty description='暂无数据~'
                    image={<Image src='/imgs/statistics/empty.png' width={65} height={74} alt='' />}
                    style={{margin: '0 auto', padding: '18.5px 0'}} />
                }
                {
                    leader[dutyType].map((item: any) => {
                        return <div key={uniqueId()} className="w-[calc((100%-10px)/2)] bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] py-[5px] px-[19px]">
                            <div className='flex items-center break-keep'>
                                <span className='text-[#333] text-lg font-semibold'>{item.name}</span>
                                <span className='text-[#333] text-xs opacity-70'> ({item.perCode || item.personId || '暂无警号'})</span>
                                {
                                    item.equipType === '1' &&
                                    <div className='m-[2px] w-4 h-4 shadow-[0px_0px_2px_1px_rgba(0,143,255,0.35)] rounded-[50%] text-center text-white text-[10px]' style={{background: 'linear-gradient(314deg, #008FFF 0%, #00D7FF 100%)'}}>枪</div>
                                }
                            </div>
                            <div className='mt-[2px] text-[#333]/[.7] text-sm'>{item.personJob || '暂无职位'}</div>
                            <div className='mt-1 flex items-center'>
                                <Image className='mr-[2px]' alt='' width={20} height={20} src='/imgs/police/icon-手机@2x.png' />
                                <span className='text-[#333] text-sm'>{item.phone || '暂无手机号'}</span>
                            </div>
                            <div className='mt-1 flex items-center'>
                                <Image className='mr-[2px]' alt='' width={20} height={20} src='/imgs/police/icon-座机@2x.png' />
                                <span className='text-[#333] text-sm'>{item.fixedTelephone || '暂无座机号'}</span>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}