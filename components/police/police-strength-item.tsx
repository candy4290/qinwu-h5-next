import { StatisticsDataInterface } from "./statistics-data";

/* 警力数量 */
export default function PoliceStrengthItem(props: {data: StatisticsDataInterface & {postTypeName: string, postTypeId: string}, postTypeName?: string}) {
    const {data = {} as any, postTypeName} = props;
    return (
        <div className='mb-[10px] bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] pt-[9px] px-[14px] pb-[2px] w-[calc((100%-7px)/2)]'>
             <div className="relative text-[#008fff] text-base font-semibold mb-3 after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-10 after:rounded-[3px] after:bg-[#008fff]">{postTypeName || data.postTypeName + '警力'}</div>
             <div className='flex items-center'>
                <div className="text-[#333]/[.9] text-sm mr-[10px]">当日排班</div>
                <div className="text-[#000] text-2xl">{data.totayCardPeopleNum}</div>
            </div>
             <div className='flex items-center'>
                <div className="text-[#333]/[.9] text-sm mr-[10px]">当前排班</div>
                <div className="text-[#000] text-2xl">{data.currentDutyPeopleNum}</div>
            </div>
        </div>
    )
}