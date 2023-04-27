import PoliceInfo from '@/components/police-info';
import { useEffect, useState } from 'react';
import { PullToRefresh } from 'antd-mobile';
import CircleChart from '@/components/circle-chart';
import WorkBar from '@/components/work-bar';
import moment from 'moment';
import { useSafeState } from 'ahooks';
import { userInfoSelector } from '@/redux/userInfoSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Image from 'next/image';
import { getStaticsMonthInfo, getStaticsPostInfo, statisticsMonthSelector, statisticsPostSelector } from '@/redux/statisticsSlice';

function Item1(props: { className?: string; src: string; name: string; num1: number; num2: number; unit: string }) {
  const { className, src, name, num1, num2, unit } = props;
  return (
    <div className={className}>
      <Image width={56} height={56} alt="" src={src} />
      <div className="ml-[2px] pt-[5px]">
        <div className="whitespace-nowrap text-sm text-mitBlack/[.9]">{name}</div>
        <div className="-mt-1 flex items-center justify-between">
          <div className="flex">
            <span className="mr-1 text-2xl text-mitBlue">{num1 || 0}</span>
            <span className="text-xl leading-8 text-mitBlue/[.3]">
              (<span className="relative top-[1px]">{num2 || 0}</span>)
            </span>
          </div>
          <div className="ml-[6px] whitespace-nowrap text-sm text-mitBlack/[.7]">{unit}</div>
        </div>
      </div>
    </div>
  );
}

function Item2(props: { className?: string; src: string; name: string; num1: number; unit: string }) {
  const { className, src, name, num1, unit } = props;
  return (
    <div className={className}>
      <Image width={56} height={56} alt="" src={src} />
      <div className="ml-[2px] pt-[5px]">
        <div className="text-sm text-mitBlack/[.9]">{name}</div>
        <div className="-mt-1 flex items-center justify-between">
          <div className="mr-1 text-2xl text-mitBlue">{num1 || 0}</div>
          <div className="ml-[6px] leading-5 text-mitBlack/[.7]">{unit}</div>
        </div>
      </div>
    </div>
  );
}

/* 统计页 */
export default function Statistics() {
  const userInfo = useAppSelector(userInfoSelector);
  const dispatch = useAppDispatch();
  const [type, setType] = useSafeState<0 | 1>(0); /* 0-月统计 1-岗位统计 */

  const [updateTime, setUpdateTime] = useState<string>();
  const dataList = useAppSelector(statisticsMonthSelector);
  const dataList2 = useAppSelector(statisticsPostSelector);
  useEffect(() => {
    if (!userInfo) return;
    dispatch(getStaticsMonthInfo());
    dispatch(getStaticsPostInfo());
  }, [userInfo, dispatch]);

  return (
    <PullToRefresh
      completeText={<span>{'更新时间：' + updateTime}</span>}
      onRefresh={async () => {
        if (type === 0) {
          await dispatch(getStaticsMonthInfo()).then(() => {
            setUpdateTime(moment().format('yyyy-MM-DD HH:mm:ss'));
          });
        } else {
          await dispatch(getStaticsPostInfo()).then(() => {
            setUpdateTime(moment().format('yyyy-MM-DD HH:mm:ss'));
          });
        }
      }}
    >
      <div className="h-[309px] w-screen overflow-hidden bg-[url('/imgs/statistics/top-bg@2x.png')] bg-cover">
        <PoliceInfo info={userInfo} />
        <div className="mx-auto h-[1px] w-[calc(100%-26px)] bg-white/[.16]"></div>
      </div>
      <div
        className="px-5"
        style={{
          marginTop: userInfo?.ifSecondment === '0' && userInfo?.secondmentOrgName ? -210 : -230,
        }}
      >
        <div className="flex items-center px-[22px] pb-4 pt-[18px]">
          <div className={(type === 0 ? 'font-semibold text-white' : 'font-normal text-white/[.65]') + ' text-[18px]'} onClick={() => setType(0)}>
            月统计
          </div>
          <div className="mx-[30px] h-4 w-[2px] bg-mitGray/[.2]"></div>
          <div className={(type === 1 ? 'font-semibold text-white' : 'font-normal text-white/[.65]') + ' text-[18px]'} onClick={() => setType(1)}>
            岗位统计
          </div>
        </div>
        {type === 0 && (
          <>
            <div className="relative rounded-[20px] bg-white bg-[url('/imgs/statistics/center-bg@2x.png')] bg-[length:100%_auto] bg-no-repeat pb-[22px] pl-[9px] pr-[18px] pt-[18px] shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]" id="lefts">
              <CircleChart percent={+((dataList[0]?.attendanceRate || 0) * 100).toFixed(1)} />
              <Item1 className="mb-1 flex" src="/imgs/statistics/icon-本月排班天数@2x.png" name="本月排班天数" num1={dataList[0]?.schedulingDays} num2={dataList[0]?.orgCodeAvgSchedulingDays} unit="天" />
              <Item1 className="mb-1 flex" src="/imgs/statistics/icon-本月打卡天数@2x.png" name="本月打卡天数" num1={dataList[0]?.attendanceDays} num2={dataList[0]?.orgCodeAvgAttendanceDays} unit="天" />
              <div className="flex">
                <Item1 className="flex" src="/imgs/statistics/icon-本月总工时@2x.png" name="本月工作总工时" num1={dataList[0]?.sumWorkTime} num2={dataList[0]?.orgCodeAvgWorkTime} unit="小时" />
                <Item1 className="flex" src="/imgs/statistics/icon-本月值班天数@2x.png" name="本月值班天数" num1={dataList[0]?.dutyDays} num2={dataList[0]?.avgDutyDays} unit="天" />
              </div>
              <div className="mx-auto my-[18px] h-[1px] w-[calc(100%-23px)] bg-mitBlack/[.07]"></div>
              <div className="mb-1 flex">
                <Item2 className="flex" src="/imgs/statistics/icon-上月排班天数@2x.png" name="上月排班天数" num1={dataList[1]?.schedulingDays} unit="天" />
                <Item2 className="ml-[14px] flex" src="/imgs/statistics/icon-上月打卡率@2x.png" name="上月打卡率" num1={dataList[1]?.attendanceRate} unit="%" />
              </div>
              <div className="mb-1 flex">
                <Item2 className="flex" src="/imgs/statistics/icon-上月打卡天数@2x.png" name="上月打卡天数" num1={dataList[1]?.attendanceDays} unit="天" />
              </div>
              <div className="flex">
                <Item2 className="flex" src="/imgs/statistics/icon-上月总工时@2x.png" name="上月工作总工时" num1={dataList[1]?.sumWorkTime} unit="小时" />
                <Item2 className="flex" src="/imgs/statistics/icon-上月值班天数@2x.png" name="上月值班天数" num1={dataList[1]?.dutyDays} unit="天" />
              </div>
            </div>
            <div className="my-3 flex justify-center text-xs text-mitGray">
              <div className="scale-[0.83] whitespace-nowrap text-center">备注：括号内数字是所有警员排班、打卡、总工时、值班的平均时间。</div>
            </div>
          </>
        )}
        {type === 1 && (
          <div
            className="relative rounded-[20px] bg-white bg-[url('/imgs/statistics/center-bg@2x.png')] bg-[length:100%_auto] bg-no-repeat pb-[22px] pl-[9px] pr-[18px] pt-[18px] shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]"
            style={{
              padding: '48px 20px 24px',
              height: document.getElementById('lefts')?.offsetHeight,
            }}
          >
            <WorkBar title="本月工作时长" total={dataList2[0]?.sumALLWorkTime || 0} rc={dataList2[0]?.['1']} zx={dataList2[0]?.['2']} zb={dataList2[0]?.['3']} max={dataList2[0]?.max} />
            <div className="mx-auto my-[18px] h-[1px] w-[calc(100%-23px)] bg-mitBlack/[.07]" style={{ margin: '48px auto', width: 'calc(100% - 10px)' }}></div>
            <WorkBar title="上月工作时长" total={dataList2[1]?.sumALLWorkTime || 0} rc={dataList2[1]?.['1']} zx={dataList2[1]?.['2']} zb={dataList2[1]?.['3']} max={dataList2[1]?.max} />
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}
