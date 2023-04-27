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
    if (!userInfo) return;
    dispatch(getSubscribeInfo());
  }, [userInfo, dispatch]);

  function update(idx: number) {
    dispatch(updateSubscribe(idx));
  }

  return (
    <div>
      <div className="h-[175px] w-full overflow-hidden bg-[url('/imgs/subscribe/top-bg.png')] bg-cover"></div>
      <div className="ml-5 mt-[-126px] w-[calc(100%-40px)] rounded-[20px] bg-white bg-[url('/imgs/statistics/center-bg@2x.png')] pb-[68px] pl-[19px] pr-7 pt-[39px] shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]">
        {list.map((i, idx) => {
          return (
            <div key={i.key} className="mb-3 flex h-[58px] items-center justify-between rounded-[20px] bg-white px-[30px] shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]">
              <div className="text-xs font-medium text-black/[.9]">{i.name}</div>
              <Switch onChange={() => update(idx)} checked={i.checked} loading={i.loading} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
