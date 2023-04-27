import Image from 'next/image';
export interface StatisticsDataInterface {
  totayCardPeopleNum: number;
  currentCardPeopleNum: number;
  currentDutyPeopleNum: number;
  totayDutyPeopleNum: number;
}

/* 统计数据块：当日排班数、当前排班数、当前打卡数  */
export function StatisticData(props: { style?: React.CSSProperties; data: StatisticsDataInterface | StatisticsDataInterface[] }) {
  const { data = {} as StatisticsDataInterface, style } = props;
  const item = 'absolute h-[56px] flex items-center';
  const tag = 'absolute bg-mitBlue2 h-5 text-sm text-center w-[200px] top-[25px] right-[-65px] text-white rotate-45';
  return (
    <>
      {Array.isArray(data) ? (
        <>
          {' '}
          {/* 备勤警力 */}
          <div className="relative h-[160px] overflow-hidden rounded-[20px] bg-white px-3 py-4 shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]" style={style}>
            <div className={item + ' left-3 top-4'}>
              <Image alt="" width={56} height={56} src="/imgs/statistics/icon-上月排班天数@2x.png" />
              <div className="flex flex-col justify-between">
                <span className="text-sm text-mitBlack">当日排班数</span>
                <span className="text-2xl text-mitBlue2">{data[0].totayCardPeopleNum || data[0].totayDutyPeopleNum || 0}</span>
              </div>
            </div>
            <div className={item + ' bottom-4 left-3'}>
              <Image alt="" width={56} height={56} src="/imgs/statistics/icon-本月排班天数@2x.png" />
              <div className="flex flex-col justify-between">
                <span className="text-sm text-mitBlack">当前排班数</span>
                <span className="text-2xl text-mitBlue2" style={{ color: '#476FF2' }}>
                  {data[0].currentDutyPeopleNum || 0}
                </span>
              </div>
            </div>
            <div className={item + ' bottom-4 left-[168px]'}>
              <Image alt="" width={56} height={56} src="/imgs/statistics/icon-本月打卡天数@2x.png" />
              <div className="flex flex-col justify-between">
                <span className="text-sm text-mitBlack">当前打卡数</span>
                <span className="text-2xl text-mitBlue2" style={{ color: '#008FFF' }}>
                  {data[0].currentCardPeopleNum || 0}
                </span>
              </div>
            </div>
            <div className={tag}>集中备勤</div>
          </div>
          <div className="relative h-[160px] overflow-hidden rounded-[20px] bg-white px-3 py-4 shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]" style={{ ...style, marginTop: 10 }}>
            <div className={item + ' left-3 top-4'}>
              <Image alt="" width={56} height={56} src="/imgs/statistics/icon-上月排班天数@2x.png" />
              <div className="flex flex-col justify-between">
                <span className="text-sm text-mitBlack">当日排班数</span>
                <span className="text-2xl text-mitBlue2">{data[1].totayCardPeopleNum || data[1].totayDutyPeopleNum || 0}</span>
              </div>
            </div>
            <div className={item + ' bottom-4 left-3'}>
              <Image alt="" width={56} height={56} src="/imgs/statistics/icon-本月排班天数@2x.png" />
              <div className="flex flex-col justify-between">
                <span className="text-sm text-mitBlack">当前排班数</span>
                <span style={{ color: '#476FF2' }}>{data[1].currentDutyPeopleNum || 0}</span>
              </div>
            </div>
            <div className={item + ' bottom-4 left-[168px]'}>
              <Image alt="" width={56} height={56} src="/imgs/statistics/icon-本月打卡天数@2x.png" />
              <div className="flex flex-col justify-between">
                <span className="text-sm text-mitBlack">当前打卡数</span>
                <span className="text-2xl text-mitBlue2" style={{ color: '#008FFF' }}>
                  {data[1].currentCardPeopleNum || 0}
                </span>
              </div>
            </div>
            <div className={tag} style={{ background: '#008FFF' }}>
              动中备勤
            </div>
          </div>
        </>
      ) : (
        <div className="relative h-[160px] overflow-hidden rounded-[20px] bg-white px-3 py-4 shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]" style={style}>
          <div className={item + ' left-3 top-4'}>
            <Image alt="" width={56} height={56} src="/imgs/statistics/icon-上月排班天数@2x.png" />
            <div className="flex flex-col justify-between">
              <span className="text-sm text-mitBlack">当日排班数</span>
              <span className="text-2xl text-mitBlue2">{data.totayCardPeopleNum || data.totayDutyPeopleNum || 0}</span>
            </div>
          </div>
          <div className={item + ' bottom-4 left-3'}>
            <Image alt="" width={56} height={56} src="/imgs/statistics/icon-本月排班天数@2x.png" />
            <div className="flex flex-col justify-between">
              <span className="text-sm text-mitBlack">当前排班数</span>
              <span className="text-2xl text-mitBlue2" style={{ color: '#476FF2' }}>
                {data.currentDutyPeopleNum || 0}
              </span>
            </div>
          </div>
          <div className={item + ' bottom-4 left-[168px]'}>
            <Image alt="" width={56} height={56} src="/imgs/statistics/icon-本月打卡天数@2x.png" />
            <div className="flex flex-col justify-between">
              <span className="text-sm text-mitBlack">当前打卡数</span>
              <span className="text-2xl text-mitBlue2" style={{ color: '#008FFF' }}>
                {data.currentCardPeopleNum || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
