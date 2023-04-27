import { StatisticsDataInterface } from './statistics-data';

/* 警力数量 */
export default function PoliceStrengthItem(props: { data: StatisticsDataInterface & { postTypeName: string; postTypeId: string }; postTypeName?: string }) {
  const { data = {} as any, postTypeName } = props;
  return (
    <div className="mb-[10px] w-[calc((100%-7px)/2)] rounded-[20px] bg-white px-[14px] pb-[2px] pt-[9px] shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]">
      <div className="relative mb-3 text-base font-semibold text-mitBlue after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-10 after:rounded-[3px] after:bg-mitBlue after:content-['']">{postTypeName || data.postTypeName + '警力'}</div>
      <div className="flex items-center">
        <div className="mr-[10px] text-sm text-mitBlack/[.9]">当日排班</div>
        <div className="text-2xl text-black">{data.totayCardPeopleNum}</div>
      </div>
      <div className="flex items-center">
        <div className="mr-[10px] text-sm text-mitBlack/[.9]">当前排班</div>
        <div className="text-2xl text-black">{data.currentDutyPeopleNum}</div>
      </div>
    </div>
  );
}
