import { useEffect, useRef } from 'react';
import Calendar from '@/components/calendar';
import moment from 'moment';
import PostItem from '@/components/post-item';
import { Empty, PullToRefresh } from 'antd-mobile';
import _ from 'lodash';
import { useSafeState } from 'ahooks';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import PoliceInfo from '@/components/police-info';
import { getUserInfo, userInfoSelector } from '@/redux/userInfoSlice';
import Image from 'next/image';

/* 排班tab页 */
export default function Schedule() {
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(userInfoSelector);
    const [type, setType] = useSafeState(0);
    const [updateTime, setUpdateTime] = useSafeState<string>(moment().format('yyyy-MM-DD HH:mm:ss'));
    const preDate = useRef<string>();
    const [list, setList] = useSafeState<any>({
        0: [], /* 全部 */
        1: [], /* 日常 */
        2: [], /* 专项 */
        3: [] /* 值班 */
    });
    const listRef = useRef<any>(null);

    useEffect(() => {
        listRef.current?.scrollTo(0, 0);
    }, [type]);

    function dateChange(data: any) {
        listRef.current?.scrollTo(0, 0);
        if (preDate.current !== data.dutyDate) { /* 选中日期编号时才切换tab页 */
            setType(0);
        }
        preDate.current = data.dutyDate;
        const temp: any = { 0: [], 1: [], 2: [], 3: [] };
        (data.schedulingDetails || []).forEach((i: any) => {
            temp[0].push(i);
            temp[i.groupType].push(i)
        });
        setList(temp);
    }
    return (
        <PullToRefresh
            completeText={
                <span>{'更新时间：' + updateTime}</span>
            }
            onRefresh={async () => {
                await dispatch(getUserInfo());
                listRef.current?.scrollTo(0, 0);
                setUpdateTime(moment().format('yyyy-MM-DD HH:mm:ss'));
            }}
        >
            <div>
                <div className="h-[309px] w-screen bg-[url('/imgs/schedule/bg+圆@2x.png')] overflow-hidden bg-cover">
                    <PoliceInfo info={userInfo} />
                    <div className='h-[1px] mx-auto w-[calc(100%-26px)] bg-white/[.16]'></div>
                    <Calendar info={userInfo} callBack={dateChange} />
                </div>
                <div className={`pt-6 px-5 rounded-t-[40px] bg-[#f9f9f9] ${userInfo?.ifSecondment === '0' && userInfo.secondmentOrgName ? '-mt-20' : '-mt-[100px]'} `}>
                    <div className='pb-5 flex items-center justify-between'>
                        {
                            ['全部', '日常', '专项', '值班'].map((i, idx) => (
                                <div key={i} onClick={() => setType(idx)} className='flex items-center'>
                                    <div className='text-[#333]/[.6] text-[18px] leading-[25px] mr-[2px]' style={{ color: type === idx ? '#008FFF' : 'rgba(51,51,51,.6)', fontWeight: type === idx ? 600 : 400, textShadow: type === idx ? '0px 5px 11px rgba(0,143,255,0.3686)' : 'none', }}>{i}</div>
                                    <div className='px-[7px] text-sm bg-[#b5b5b5]/[.15] rounded-[9px] mt-[-2px]' style={{ background: type === idx ? '#008fff' : 'rgba(181,181,181,.15)', boxShadow: type === idx ? '0px 2px 5px 1px rgba(0,143,255,0.5020)' : 'none', color: type === idx ? '#fff' : '#000', fontSize: type === idx ? 16 : 14 }}>{list[idx].length}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='hide-scrollbar' style={{ height: userInfo?.ifSecondment === '0' && userInfo.secondmentOrgName ? 'calc(100vh - 354px)' : 'calc(100vh - 334px)' }} ref={listRef}>
                        {
                            list[type].map((i: any) => {
                                return <PostItem info={i} key={_.uniqueId()} postType={i.groupType + '' !== '3' ? 1 : 2} />
                            })
                        }
                        {
                            list[type].length === 0 &&
                            <Empty image={
                                <Image src='/imgs/statistics/empty.png' width={65} height={74} alt='' />
                            } description="暂无数据~" />
                        }
                    </div>
                </div>
            </div>
        </PullToRefresh>
    )
}