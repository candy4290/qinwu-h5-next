const tripMode: any = {
  1: '步行',
  2: '自行车',
  3: '摩托车',
  4: '警车',
  5: '船',
  6: '电动四轮',
  7: '电瓶车',
};
function getGwsj(info: any) {
  const start = (info.postStartTime || '').slice(0, 5);
  const end = (info.postEndTime || '').slice(0, 5);
  if (+start.split(':').join('') >= +end.split(':').join('')) {
    return start + '~' + end + '(跨天)';
  }
  return start + '~' + end;
}
/* 岗位组件 */
export default function PostItem(props: { postType: any; info: any }) {
  // props: {postType: any}
  return (
    <div className="relative mb-[14px] rounded-[14px] bg-white px-4 py-[18px] shadow-[0px_2px_7px_1px_rgba(61,110,232,0.0902)]">
      {props.postType === 1 && (
        <>
          <div className="mb-[9px] text-xl text-mitBlue">{props.info.postInfoName}</div>
          <div className="mb-[6px] flex">
            <div className="mr-[15px] leading-5 text-mitBlack/[.7]">岗位时间</div>
            <div className="leading-5 text-mitBlack">{getGwsj(props.info)}</div>
          </div>
          <div className="mb-[6px] flex">
            <div className="mr-[15px] leading-5 text-mitBlack/[.7]">岗位类型</div>
            <div className="h-4 rounded-lg bg-mitBlue px-[6px] text-sm leading-4 text-white">{props.info.postTypeName}</div>
          </div>
          {props.info.postTimeName && (
            <div className="mb-[6px] flex">
              <div className="mr-[15px] leading-5 text-mitBlack/[.7]">岗次类型</div>
              <div className="leading-5 text-mitBlack">{props.info.postTimeName}</div>
            </div>
          )}
          {(props.info.modeOfTravel || props.info.wheatherGun + '' === '1') && (
            <div className="mb-[6px] flex">
              <div className="mr-[15px] leading-5 text-mitBlack/[.7]">岗位标签</div>
              <div className="leading-5 text-mitBlack">
                {[tripMode[props.info.modeOfTravel], props.info.wheatherGun + '' === '1']
                  .filter(i => !!i)
                  .map(i => {
                    if (i + '' === 'true') {
                      return '携枪';
                    }
                    return i;
                  })
                  .join(' | ')}
              </div>
            </div>
          )}
          {props.info.dutyAddress && (
            <div className="mb-[6px] flex">
              <div className="mr-[15px] leading-5 text-mitBlack/[.7]">工作地点</div>
              <div className="leading-5 text-mitBlack">{props.info.dutyAddress}</div>
            </div>
          )}
        </>
      )}
      {props.postType !== 1 && (
        <>
          <div className="mb-[9px] text-xl text-mitBlue">{props.info.postInfoName}</div>
          <div className="">
            <span className="mr-[15px] leading-5 text-mitBlack/[.7]">岗位类型</span>
            <span className="h-4 rounded-lg bg-mitBlue px-[6px] text-sm leading-4 text-white">值班</span>
          </div>
          <div className="">
            <span className="mr-[15px] leading-5 text-mitBlack/[.7]">班次时间</span>
            <span className="leading-5 text-mitBlack">{getGwsj(props.info)}</span>
          </div>
        </>
      )}
    </div>
  );
}
