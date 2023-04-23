import { Swiper } from 'antd-mobile';
import { useEffect } from 'react';
import moment from 'moment';
import { PoliceInfoType } from '@/utils/types';
import { useSafeState } from 'ahooks';
import { getScheduleInfo, scheduleInfoSelector } from '@/redux/scheduleSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

/* 日历组件 */
const weekofday: any = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
}
export interface CalendarProps {
    info: PoliceInfoType | null;
    callBack?: (data: any) => void
}
export default function Calendar(props: CalendarProps) {
    const {
        info,
        callBack
    } = props;
    const dataList = [7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6].map(i => moment().subtract(i, 'days'));
    const [selectedDate, setSelectedDate] = useSafeState<moment.Moment>(moment());
    const dispatch = useAppDispatch();
    const detailObj = useAppSelector(scheduleInfoSelector);

    useEffect(() => {
        detailObj && Object.keys(detailObj).length > 0 && callBack && callBack(detailObj[selectedDate.format('YYYY-MM-DD')]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, detailObj]);


    useEffect(() => {
        if (!info) {
            return;
        }
        dispatch(getScheduleInfo());
    }, [info, dispatch])

    return (
        <div className='pt-[13px] pb-[14px]'>
            <div className='text-[18px] leading-[25px] text-white pl-[18px]'>{selectedDate.format('YYYY 年 MM 月')}</div>
            <Swiper indicator={() => null} defaultIndex={1}>
                {
                    [
                        dataList.slice(0, 7),
                        dataList.slice(7),
                    ].map((j, idx) => (
                        <Swiper.Item key={idx}>
                            <div className='flex items-center justify-between mx-[18px] pb-[14px]'>
                                {
                                    j.map(i => {
                                        return <div onClick={() => setSelectedDate(i)} className={` h-[72px] flex flex-col items-center pt-[10px] px-[10px] pb-[9px] ${selectedDate.format('yyyy-MM-DD') === i.format('yyyy-MM-DD') ? 'bg-gradient-to-r from-[#008fff] to-[#3E72FF] shadow-[0px_5px_19px_1px_rgba(62,114,255,0.5608)] rounded-xl' : ''}`} key={i.format('yyyy-MM-DD')}>
                                            <div className='text-[11px] text-white/[.5]'>{weekofday[i.format('E')]}</div>
                                            <div className='text-white text-base mb-[1px]'>{i.format('DD')}</div>
                                            {
                                                detailObj && detailObj[i.format('YYYY-MM-DD')]?.empty + '' === 'false' && <div className='w-1 h-1 rounded-[50%] bg-[#bebebe]'></div>
                                            }
                                        </div>
                                    })
                                }
                            </div>
                        </Swiper.Item>
                    ))
                }
            </Swiper>
        </div>
    )
}