import { Empty } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { useSafeState } from 'ahooks';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearMessageTab, userInfoSelector } from '@/redux/userInfoSlice';
import { getMsgList, msgListSelector } from '@/redux/messageInfoSlice';

/**
 * 消息提醒页面
 *
 * @export
 * @return {*}
 */
/* 未打卡-1 */
function NotRank(props: { item: any }) {
  return (
    <div>
      <div className="w-fit mx-auto h-5 bg-white rounded-[5px] text-xs text-center mb-[6px] px-[8px]">{props.item?.pushTime}</div>
      <div className='mb-[30px] flex'>
        <Image className='h-[56px] mr-[9px]' width={56} height={56} src={'/imgs/messages/icon-消息提醒@2x.png'} alt='' />
        <div className="mt-[7px] flex-1">
          <div className='text-sm text-[#333] mb-[7px]'>打卡提醒</div>
          <div className=" bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] pt-[15px] pr-[6px] pb-[15px] pl-[21px] text-[#333] leading-5">
            暂未查询到您的打卡信息，请打开位置采集APP！
          </div>
        </div>
      </div>
    </div>
  );
}
/* 派勤-2 */
function Paiqin(props: { item: any }) {
  return (
    <div>
      <div className="w-fit mx-auto h-5 bg-white rounded-[5px] text-xs text-center mb-[6px] px-[8px]">{props.item?.pushTime}</div>
      <div className='mb-[30px] flex'>
        <Image className='h-[56px] mr-[9px]' width={56} height={56} src={'/imgs/messages/icon-消息提醒@2x.png'} alt='' />
        <div className="mt-[7px] flex-1">
          <div className='text-sm text-[#333] mb-[7px]'>派勤提醒</div>
          <div className=" bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] pt-[15px] pr-[6px] pb-[15px] pl-[21px] text-[#333] leading-5">
          明天您有工作安排，请注意查收！
          </div>
        </div>
      </div>
    </div>
  );
}
/* 出勤提醒-3 */
function ChuQin(props: { item: any }) {
  return (
    <div>
      <div className="w-fit mx-auto h-5 bg-white rounded-[5px] text-xs text-center mb-[6px] px-[8px]">{props.item?.pushTime}</div>
      <div className='mb-[30px] flex'>
        <Image className='h-[56px] mr-[9px]' width={56} height={56} src={'/imgs/messages/icon-消息提醒@2x.png'} alt='' />
        <div className="mt-[7px] flex-1">
          <div className='text-sm text-[#333] mb-[7px]'>出勤提醒</div>
          <div className=" bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] pt-[15px] pr-[6px] pb-[15px] pl-[21px] text-[#333] leading-5">
          接下来您还有工作安排，请注意查收！
          </div>
        </div>
      </div>
    </div>
  );
}
/* 下班关闭打卡提醒-4  */
function CloseRank(props: { item: any }) {
  return (
    <div>
      <div className="w-fit mx-auto h-5 bg-white rounded-[5px] text-xs text-center mb-[6px] px-[8px]">{props.item?.pushTime}</div>
      <div className='mb-[30px] flex'>
        <Image className='h-[56px] mr-[9px]' width={56} height={56} src={'/imgs/messages/icon-消息提醒@2x.png'} alt='' />
        <div className="mt-[7px] flex-1">
          <div className='text-sm text-[#333] mb-[7px]'>下班关闭打卡提醒</div>
          <div className=" bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] pt-[15px] pr-[6px] pb-[15px] pl-[21px] text-[#333] leading-5">
            <div>当天工作已完成，如您接下来无工作安排，可合理关闭位置采集APP！</div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* 排班提醒-5  */
function ScheduleTip(props: { item: any }) {
  const [t] = useState({1: '日常排班', 2: '值班排班', 3: '专项排班'});
  return (
    <div>
      <div className="w-fit mx-auto h-5 bg-white rounded-[5px] text-xs text-center mb-[6px] px-[8px]">{props.item?.pushTime}</div>
      <div className='mb-[30px] flex'>
        <Image className='h-[56px] mr-[9px]' width={56} height={56} src={'/imgs/messages/icon-消息提醒@2x.png'} alt='' />
        <div className="mt-[7px] flex-1">
          <div className='text-sm text-[#333] mb-[7px]'>排班提醒</div>
          <div className=" bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] pt-[15px] pr-[6px] pb-[15px] pl-[21px] text-[#333] leading-5">
            {
              (props.item?.schedulingType || []).map((i: 1|2|3) => {
                return <div key={i}>
                  {props.item?.orgName}明日【{t[i]}】还未完成，请及时至勤务PC端排班！
                </div>
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}
/* 任务签收提醒-6  */
function TaskSign(props: { item: any }) {
  return (
    <div>
      <div className="w-fit mx-auto h-5 bg-white rounded-[5px] text-xs text-center mb-[6px] px-[8px]">{props.item?.pushTime}</div>
      <div className='mb-[30px] flex'>
        <Image className='h-[56px] mr-[9px]' width={56} height={56} src={'/imgs/messages/icon-消息提醒@2x.png'} alt='' />
        <div className="mt-[7px] flex-1">
          <div className='text-sm text-[#333] mb-[7px]'>任务签收提醒</div>
          <div className=" bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] pt-[15px] pr-[6px] pb-[15px] pl-[21px] text-[#333] leading-5">
            {props.item?.orgName}还有任务未签收，请及时签收！
          </div>
        </div>
      </div>
    </div>
  );
}
/* 任务排班提醒-7  */
function TaskSchedule(props: { item: any }) {
  return (
    <div>
      <div className="w-fit mx-auto h-5 bg-white rounded-[5px] text-xs text-center mb-[6px] px-[8px]">{props.item?.pushTime}</div>
      <div className='mb-[30px] flex'>
        <Image className='h-[56px] mr-[9px]' width={56} height={56} src={'/imgs/messages/icon-消息提醒@2x.png'} alt='' />
        <div className="mt-[7px] flex-1">
          <div className='text-sm text-[#333] mb-[7px]'>任务排班提醒</div>
          <div className=" bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] pt-[15px] pr-[6px] pb-[15px] pl-[21px] text-[#333] leading-5">
            {props.item?.orgName}还有任务相关岗位未排班，请及时至勤务PC端排班！
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const userInfo = useAppSelector(userInfoSelector);
  const msgs = useAppSelector(msgListSelector);
  const dispatch = useAppDispatch();
  const [updateTime, setUpdateTime] = useSafeState<string>();
  const listRef = useRef<any>(null);

  useEffect(() => { /* 进入消息页，取消“小红点”提醒 */
    dispatch(clearMessageTab())
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    dispatch(getMsgList());
  }, [userInfo, dispatch])

  useEffect(() => {
    setUpdateTime(moment().format('yyyy-MM-DD HH:mm:ss'))
    const t$ = setTimeout(() => {
      listRef.current?.scrollTo(0, 10000);
    });
    return () => {
      clearTimeout(t$);
    };
  }, [msgs, setUpdateTime]);

  return (
    <div
      className='h-full overflow-y-auto'
      style={{ padding: msgs.length === 0 ? 0 : '32px 60px 0 13px' }}
      ref={listRef}
    >
      {msgs.map((item: any) => {
        if (item.messageType === 1) {
          return <NotRank key={_.uniqueId()} item={item} />;
        } else if (item.messageType === 2) {
          return <Paiqin key={_.uniqueId()} item={item} />;
        } else if (item.messageType === 3) {
          return <ChuQin key={_.uniqueId()} item={item} />;
        } else if (item.messageType === 4) {
          return <CloseRank key={_.uniqueId()} item={item} />;
        } else if (item.messageType === 5) {
          return <ScheduleTip key={_.uniqueId()} item={item} />;
        } else if (item.messageType === 6) {
          return <TaskSign key={_.uniqueId()} item={item} />;
        } else if (item.messageType === 7) {
          return <TaskSchedule key={_.uniqueId()} item={item} />;
        }
        return <></>;
      })}
      {msgs.length === 0 && <Empty image={
                                <Image className='h-[56px] mr-[9px]' src='/imgs/statistics/empty.png' width={65} height={74} alt='' />
                            } description="暂无数据~" />}
      <div className='text-[#707070] leading-5 text-base text-center mb-[30px]'>更新时间 {updateTime}</div>
    </div>
  );
}
