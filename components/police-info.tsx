import { PoliceInfoType } from '@/utils/types';
import Image from 'next/image';

/* 所属单位名称显示 */
function showOrgName(orgName: string = '') {
  const idx = orgName.indexOf('分局');
  if (idx > -1) {
    if (orgName.length === idx + 2) {
      if (orgName.includes('上海市公安局')) {
        return orgName.slice(6);
      }
      return orgName;
    } else {
      return orgName.slice(idx + 2);
    }
  }
  return orgName;
}

export interface PoliceInfoInterface {
  info: PoliceInfoType | null;
}

export default function PoliceInfo(props: PoliceInfoInterface) {
  const { info } = props;

  return (
    <div className=" relative mb-3 ml-5 mt-[19px] flex">
      <Image src="/imgs/police-photo.png" className="mr-2 rounded-[50%]" width={48} height={48} alt="" />
      <div>
        <div className="flex items-center text-[18px] leading-[25px] text-white">
          <div className="mr-1 font-semibold">{props.info?.perName}</div>
          <span className="relative top-[-2px] font-semibold">(</span>
          <span>{props.info?.perCode || '暂无警号'}</span>
          <span className="relative top-[-2px] font-semibold">)</span>
        </div>
        <div className="leading-5 text-white opacity-70">
          <span>{showOrgName(props.info?.orgName || '')}</span>
        </div>
        {info?.ifSecondment === '0' && info.secondmentOrgName && <div className="leading-5 text-white opacity-70">借调：{info.secondmentOrgName}</div>}
      </div>
    </div>
  );
}
