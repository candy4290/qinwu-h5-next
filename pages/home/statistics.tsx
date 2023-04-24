import PoliceInfo from '@/components/police-info';
import { useEffect, useMemo } from 'react';
import { PullToRefresh } from 'antd-mobile';
import CircleChart from '@/components/circle-chart';
import WorkBar from '@/components/work-bar';
import moment from 'moment';
import axios from 'axios';
import apis from '@/utils/apis';
import { useSafeState } from 'ahooks';
import { getUserInfo, userInfoSelector } from '@/redux/userInfoSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Image from 'next/image';

/* 获取year-month第一天和最后一天 */
export function getDateRange(year: number, month: number) {
    const date1 = new Date(year, month, 1);
    const date2 = new Date(year, month + 1, 0);
    return {
      start: year + '-' + `${month}`.padStart(2, '0') + '-' + `${date1.getDate()}`.padStart(2, '0'),
      end: year + '-' + `${month}`.padStart(2, '0') + '-' + `${date2.getDate()}`.padStart(2, '0'),
    }
  }
  
  /* 获取当前月第一天，及当前天的前一天日期 */
  export function getCurrentMonth(year: number, month: number) {
    const date1 = new Date(year, month, 1);
    return {
      start: year + '-' + `${month}`.padStart(2, '0') + '-' + `${date1.getDate()}`.padStart(2, '0'),
      end: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    }
  }
  

const prefix = 'ms-statistics';
/* 统计页 */
export default function Statistics() {
    const userInfo = useAppSelector(userInfoSelector);
    const dispatch = useAppDispatch();
    const [type, setType] = useSafeState<0 | 1>(0);
    const [updateTime, setUpdateTime] = useSafeState<string>();
    const [dataList, setDataList] = useSafeState<any[]>([]);
    const [dataList2, setDataList2] = useSafeState<any[]>([]);

    useEffect(() => {
        if (!userInfo)
            return;
        getData().then((rsp: any) => {
            rsp.forEach((i: any) => {
                Object.keys(i).forEach(k => {
                    if ((i[k] + '').includes('.') && k !== 'attendanceRate' && k !== 'orgCodeAttendanceRate') {
                        i[k] = (i[k] || 0).toFixed(0)
                    }
                })
            });
            setUpdateTime(moment().format('yyyy-MM-DD HH:mm:ss'));
            setDataList(rsp || []);
        });
        getData2()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    /* 月统计 */
    function getData() {
        const preDate = getDateRange( /* 上个月 */
            new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
            new Date().getMonth() === 0 ? 12 : new Date().getMonth());
        const date = getCurrentMonth(new Date().getFullYear(), new Date().getMonth() + 1); /* 本月 */
        return Promise.all([
            new Date(date.end).getTime() < new Date(date.start).getTime() ? /* 如果是本月第一天，本月全部数据为0，不调用接口 */
                new Promise(r => r({
                    attendanceDays: 0,
                    attendanceRate: 0,
                    avgDutyDays: 0,
                    dutyDays: 0,
                    orgCodeAttendanceRate: 0,
                    orgCodeAvgAttendanceDays: 0,
                    orgCodeAvgSchedulingDays: 0,
                    orgCodeAvgWorkTime: 0,
                    schedulingDays: 0,
                    sumWorkTime: 0
                }))
            :
            axios.get(apis.queryMonthData, { /* 本月 */
                params: {
                    personCode: userInfo?.perCode,
                    startDate: date.start,
                    endDate: date.end
                },
            }),
            axios.get(apis.queryMonthData, { /* 上月 */
                params: {
                    personCode: userInfo?.perCode,
                    startDate: preDate.start,
                    endDate: preDate.end
                },
            }),
        ])
    }

    /* 岗位统计 */
    function getData2() {
        const preDate = getDateRange( /* 上个月 */
            new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
            new Date().getMonth() === 0 ? 12 : new Date().getMonth());
        const date = getCurrentMonth(new Date().getFullYear(), new Date().getMonth() + 1); /* 本月 */
        Promise.all([
            new Date(date.end).getTime() < new Date(date.start).getTime() ? /* 如果是本月第一天，本月全部数据为0，不调用接口 */
                new Promise(r => r({
                    sumALLWorkTime: 0,
                    sumWorkTime: 0,
                    personPostSumWorkTimeVOS: []
                }))
            :
            axios.get(apis.queryPostDate, {
                params: {
                    personCode: userInfo?.perCode,
                    startDate: date.start,
                    endDate: date.end
                },
            }),
            axios.get(apis.queryPostDate, {
                params: {
                    personCode: userInfo?.perCode,
                    startDate: preDate.start,
                    endDate: preDate.end
                },
            }),
        ]).then(rsp => {
            (rsp || []).forEach((i: any) => { /* 如果是本月第一天，本月全部数据为0，不调用接口 */
                if ((i.sumALLWorkTime + '').includes('.')) {
                    i.sumALLWorkTime = (i.sumALLWorkTime || 0).toFixed(2)
                }
                if ((i.sumWorkTime + '').includes('.')) {
                    i.sumWorkTime = (i.sumWorkTime || 0).toFixed(2)
                }
                (i.personPostSumWorkTimeVOS || []).forEach((j: any) => {
                    if ((j.workTime + '').includes('.')) {
                        j.workTime = (j.workTime || 0).toFixed(2)
                    }
                })
            })
            setDataList2(rsp);
        })
    }
    return (
        <PullToRefresh
            completeText={
                <span>{'更新时间：' + updateTime}</span>
            }
            onRefresh={async () => {
                dispatch(getUserInfo());
                getData2();
                await getData().then(rsp => {
                    rsp.forEach((i: any) => {
                        Object.keys(i).forEach(k => {
                            if ((i[k] + '').includes('.') && k !== 'attendanceRate' && k !== 'orgCodeAttendanceRate') {
                                i[k] = (i[k] || 0).toFixed(0)
                            }
                        })
                    });
                    setUpdateTime(moment().format('yyyy-MM-DD HH:mm:ss'));
                    setDataList(rsp || []);
                });
            }}
        >

            <div className={prefix}>
                <div className="h-[309px] w-screen bg-[url('/imgs/statistics/top-bg@2x.png')] bg-cover overflow-hidden">
                    <PoliceInfo info={userInfo} />
                    <div className='h-[1px] w-[calc(100%-26px)] bg-[#fff]/[.16] mx-auto'></div>
                </div>
                <div className='mt-[-230px] px-5' style={{ marginTop: userInfo?.ifSecondment === '0' && userInfo?.secondmentOrgName ? -210 : -230 }}>
                    <div className='pt-[18px] px-[22px] pb-4 flex items-center'>
                        <div className={(type === 0 ? 'text-white font-semibold' : 'text-white/[.65] font-normal') + ' text-[18px]' } onClick={() => setType(0)}>月统计</div>
                        <div className='mx-[30px] w-[2px] h-4 bg-[#707070]/[.2]'></div>
                        <div className={(type === 1 ? 'text-white font-semibold' : 'text-white/[.65] font-normal') + ' text-[18px]' } onClick={() => setType(1)}>岗位统计</div>
                    </div>
                    {
                        type === 0 && <>
                            <div className="pt-[18px] pr-[18px] pb-[22px] pl-[9px] bg-white rounded-[20px] relative bg-[url('/imgs/statistics/center-bg@2x.png')] bg-[length:100%_auto] bg-no-repeat shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]" id="lefts">
                                <CircleChart percent={+((dataList[0]?.attendanceRate || 0) * 100).toFixed(1)} />
                                <div className='flex mb-1'>
                                    <Image width={56} height={56} alt='' src='/imgs/statistics/icon-本月排班天数@2x.png' />
                                    <div className='ml-[2px] pt-[5px]'>
                                        <div className='whitespace-nowrap text-[#333]/[.9] text-sm'>本月排班天数</div>
                                        <div className='flex items-center justify-between -mt-1'>
                                            <div className='flex'>
                                                <span className='text-[#008fff] text-2xl mr-1'>{dataList[0]?.schedulingDays || 0}</span>
                                                <span className='text-[#008fff]/[.3] text-xl leading-8'>(<span className='relative top-[1px]'>{dataList[0]?.orgCodeAvgSchedulingDays || 0}</span>)</span>
                                            </div>
                                            <div className='whitespace-nowrap text-[#333]/[.7] text-sm ml-[6px]'>天</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex mb-1' style={{ marginBottom: 4 }}>
                                    <Image width={56} height={56} alt='' src='/imgs/statistics/icon-本月打卡天数@2x.png' />
                                    <div className='ml-[2px] pt-[5px]'>
                                        <div className='whitespace-nowrap text-[#333]/[.9] text-sm'>本月打卡天数</div>
                                        <div className='flex items-center justify-between -mt-1'>
                                            <div className='flex'>
                                                <span className='text-[#008fff] text-2xl mr-1'>{dataList[0]?.attendanceDays || 0}</span>
                                                <span className='text-[#008fff]/[.3] text-xl leading-8'>(<span className='relative top-[1px]'>{dataList[0]?.orgCodeAvgAttendanceDays || 0}</span>)</span>
                                            </div>
                                            <div className='whitespace-nowrap text-[#333]/[.7] text-sm ml-[6px]'>天</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex'>
                                    <div className='flex'>
                                        <Image width={56} height={56} alt='' src='/imgs/statistics/icon-本月总工时@2x.png' />
                                        <div className='ml-[2px] pt-[5px]'>
                                            <div className='whitespace-nowrap text-[#333]/[.9] text-sm'>本月工作总工时</div>
                                            <div className='flex items-center justify-between -mt-1'>
                                                <div className='flex'>
                                                    <span className='text-[#008fff] text-2xl mr-1'>{dataList[0]?.sumWorkTime || 0}</span>
                                                    <span className='text-[#008fff]/[.3] text-xl leading-8'>(<span className='relative top-[1px]'>{dataList[0]?.orgCodeAvgWorkTime || 0}</span>)</span>
                                                </div>
                                                <div className='whitespace-nowrap text-[#333]/[.7] text-sm ml-[6px]'>小时</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <Image width={56} height={56} alt='' src='/imgs/statistics/icon-本月值班天数@2x.png' />
                                        <div className='ml-[2px] pt-[5px]'>
                                            <div className='whitespace-nowrap text-[#333]/[.9] text-sm'>本月值班天数</div>
                                            <div className='flex items-center justify-between -mt-1'>
                                                <div className='flex'>
                                                    <span className='text-[#008fff] text-2xl mr-1'>{dataList[0]?.dutyDays || 0}</span>
                                                    <span className='text-[#008fff]/[.3] text-xl leading-8'>(<span className='relative top-[1px]'>{dataList[0]?.avgDutyDays || 0}</span>)</span>
                                                </div>
                                                <div className='whitespace-nowrap text-[#333]/[.7] text-sm ml-[6px]'>天</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='my-[18px] mx-auto w-[calc(100%-23px)] h-[1px] bg-[#333]/[.07]'></div>
                                <div className='flex mb-1'>
                                    <div className='flex'>
                                        <Image width={56} height={56} alt='' src='/imgs/statistics/icon-上月排班天数@2x.png' />
                                        <div className='ml-[2px] pt-[5px]'>
                                            <div className='text-[#333]/[.9] text-sm'>上月排班天数</div>
                                            <div className='flex items-center justify-between -mt-1'>
                                                <div className='text-[#008fff] text-2xl mr-1'>{dataList[1]?.schedulingDays || 0}</div>
                                                <div className='text-[#333]/[.7] leading-5 ml-[6px]'>天</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex' style={{ marginLeft: 14 }}>
                                        <Image width={56} height={56} alt='' src='/imgs/statistics/icon-上月打卡率@2x.png' />
                                        <div className='ml-[2px] pt-[5px]'>
                                            <div className='text-[#333]/[.9] text-sm'>上月打卡率</div>
                                            <div className='flex items-center justify-between -mt-1'>
                                                <div className='text-[#008fff] text-2xl mr-1'>{((dataList[1]?.attendanceRate || 0) * 100).toFixed(1)}</div>
                                                <div className='text-[#333]/[.7] leading-5 ml-[6px]'>%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex' style={{ marginBottom: 4 }}>
                                    <Image width={56} height={56} alt='' src='/imgs/statistics/icon-上月打卡天数@2x.png' />
                                    <div className='ml-[2px] pt-[5px]'>
                                        <div className='text-[#333]/[.9] text-sm'>上月打卡天数</div>
                                        <div className='flex items-center justify-between -mt-1'>
                                            <div className='text-[#008fff] text-2xl mr-1'>{dataList[1]?.attendanceDays || 0}</div>
                                            <div className='text-[#333]/[.7] leading-5 ml-[6px]'>天</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div className='flex'>
                                        <Image width={56} height={56} alt='' src='/imgs/statistics/icon-上月总工时@2x.png' />
                                        <div className='ml-[2px] pt-[5px]'>
                                            <div className='text-[#333]/[.9] text-sm'>上月工作总工时</div>
                                            <div className='flex items-center justify-between -mt-1'>
                                                <div className='text-[#008fff] text-2xl mr-1'>{dataList[1]?.sumWorkTime || 0}</div>
                                                <div className='text-[#333]/[.7] leading-5 ml-[6px]'>小时</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <Image width={56} height={56} alt='' src='/imgs/statistics/icon-上月值班天数@2x.png' />
                                        <div className='ml-[2px] pt-[5px]'>
                                            <div className='text-[#333]/[.9] text-sm'>上月值班天数</div>
                                            <div className='flex items-center justify-between -mt-1'>
                                                <div className='text-[#008fff] text-2xl mr-1'>{dataList[1]?.dutyDays || 0}</div>
                                                <div className='text-[#333]/[.7] leading-5 ml-[6px]'>天</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='text-center my-3 text-xs text-[#707070] scale-[0.83]'>
                                备注：括号内数字是所有警员排班、打卡、总工时、值班的平均时间。
                            </div>
                        </>
                    }
                    {
                        type === 1 && <div className="pt-[18px] pr-[18px] pb-[22px] pl-[9px] bg-white rounded-[20px] relative bg-[url('/imgs/statistics/center-bg@2x.png')] bg-[length:100%_auto] bg-no-repeat" style={{ padding: '48px 20px 24px', height: document.getElementById('lefts')?.offsetHeight }}>
                            <WorkBar title='本月工作时长' total={dataList2[0]?.sumALLWorkTime || 0} rc={
                                (dataList2[0]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '1')[0]?.workTime || 0
                            } zx={
                                (dataList2[0]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '2')[0]?.workTime || 0
                            } zb={
                                (dataList2[0]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '3')[0]?.workTime || 0
                            } max={
                                Math.max(
                                    (dataList2[0]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '1')[0]?.workTime || 0,
                                    (dataList2[0]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '2')[0]?.workTime || 0,
                                    (dataList2[0]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '3')[0]?.workTime || 0,
                                    (dataList2[1]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '1')[0]?.workTime || 0,
                                    (dataList2[1]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '2')[0]?.workTime || 0,
                                    (dataList2[1]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '3')[0]?.workTime || 0,
                                )
                            } />
                            <div className='my-[18px] mx-auto w-[calc(100%-23px)] h-[1px] bg-[#333]/[.07]' style={{ margin: '48px auto', width: 'calc(100% - 10px)' }}></div>
                            <WorkBar title='上月工作时长' total={dataList2[1]?.sumALLWorkTime || 0} rc={
                                (dataList2[1]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '1')[0]?.workTime || 0
                            } zx={
                                (dataList2[1]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '2')[0]?.workTime || 0
                            } zb={
                                (dataList2[1]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '3')[0]?.workTime || 0
                            } max={
                                Math.max(
                                    (dataList2[0]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '1')[0]?.workTime || 0,
                                    (dataList2[0]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '2')[0]?.workTime || 0,
                                    (dataList2[0]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '3')[0]?.workTime || 0,
                                    (dataList2[1]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '1')[0]?.workTime || 0,
                                    (dataList2[1]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '2')[0]?.workTime || 0,
                                    (dataList2[1]?.personPostSumWorkTimeVOS || []).filter((i: any) => i.postTypeId === '3')[0]?.workTime || 0,
                                )
                            } />
                        </div>
                    }
                </div>
            </div>
        </PullToRefresh>
    )
}