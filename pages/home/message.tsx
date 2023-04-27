import { Empty } from 'antd-mobile';
import { useEffect, useRef } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { useSafeState } from 'ahooks';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearMessageTab, userInfoSelector } from '@/redux/userInfoSlice';
import { getMsgList, msgListSelector } from '@/redux/messageInfoSlice';

function MsgItem(props: {item: any}) {
  const msgObj: any = {
    1: {
      title: '打卡提醒',
      info: '暂未查询到您的打卡信息，请打开位置采集APP！'
    },
    2: {
      title: '派勤提醒',
      info: '明天您有工作安排，请注意查收！'
    },
    3: {
      title: '出勤提醒',
      info: '接下来您还有工作安排，请注意查收！'
    },
    4: {
      title: '下班关闭打卡提醒',
      info: '当天工作已完成，如您接下来无工作安排，可合理关闭位置采集APP！'
    },
    5: {
      title: '排班提醒',
      info: null
    },
    6: {
      title: '任务签收提醒',
      info: null
    },
    7: {
      title: '任务排班提醒',
      info: null
    }
  }
  const t = {1: '日常排班', 2: '值班排班', 3: '专项排班'};
  if (!msgObj[props.item.messageType].title)
    return <></>
  return (
    <div>
      <div className="w-fit mx-auto h-5 bg-white rounded-[5px] text-xs text-center mb-[6px] px-[8px]">{props.item?.pushTime}</div>
      <div className='mb-[30px] flex'>
        <Image className='h-[56px] mr-[9px]' width={56} height={56} src={'/imgs/messages/icon-消息提醒@2x.png'} alt='' />
        <div className="mt-[7px] flex-1">
          <div className='text-sm text-[#333] mb-[7px]'>{msgObj[props.item.messageType].title}</div>
          <div className=" bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] pt-[15px] pr-[6px] pb-[15px] pl-[21px] text-[#333] leading-5">
            {
              msgObj[props.item.messageType].info
            }
            {
              props.item.messageType === 5 && 
              (props.item?.schedulingType || []).map((i: 1|2|3) => {
                return <div key={i}>
                  {props.item?.orgName}明日【{t[i]}】还未完成，请及时至勤务PC端排班！
                </div>
              })
            }
            {
              props.item.messageType === 6 && 
              <>{props.item?.orgName}还有任务未签收，请及时签收！</>
            }
            {
              props.item.messageType === 7 && 
              <>{props.item?.orgName}还有任务相关岗位未排班，请及时至勤务PC端排班！</>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 消息提醒页面
 */
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
          return <MsgItem  key={_.uniqueId()} item={item} />
      })}
      {msgs.length === 0 && <Empty image={
                                <Image className='h-[56px] mr-[9px]' src='/imgs/statistics/empty.png' width={65} height={74} alt='' />
                            } description="暂无数据~" />}
      <div className='text-[#707070] leading-5 text-base text-center mb-[30px]'>更新时间 {updateTime}</div>
    </div>
  );
}
