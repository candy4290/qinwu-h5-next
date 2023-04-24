import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getSubscribeInfo, subScribeInfoSelector, updateSubscribe } from '@/redux/subscribeSlice';
import { userInfoSelector } from '@/redux/userInfoSlice';
import { Switch } from 'antd-mobile';
import { useEffect } from 'react';
export default function Subscribe() {
    const userInfo = useAppSelector(userInfoSelector);
    const list = useAppSelector(subScribeInfoSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!userInfo)
            return
        dispatch(getSubscribeInfo());
    }, [userInfo, dispatch])
    
    function update(idx: number) {
        dispatch(updateSubscribe(idx))
    }

    return (
        <div>
            <div className="h-[175px] w-full bg-[url('/imgs/subscribe/top-bg.png')] bg-cover overflow-hidden"></div>
            <div className="mt-[-126px] ml-5 w-[calc(100%-40px)] rounded-[20px] bg-white bg-[url('/imgs/statistics/center-bg@2x.png')] shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] pt-[39px] pr-7 pb-[68px] pl-[19px]">
                {
                    list.map((i, idx) => {
                        return <div key={i.key} className='mb-3 bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] h-[58px] flex items-center justify-between px-[30px]'>
                            <div className='font-medium text-xs text-[#000]/[.9]'>{i.name}</div>
                            <Switch onChange={() => update(idx)} checked={i.checked} loading={i.loading} />
                        </div>
                    })
                }
            </div>
        </div>
    )
}