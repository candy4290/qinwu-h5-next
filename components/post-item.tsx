const tripMode: any = {
    1: '步行',
    2: '自行车',
    3: '摩托车',
    4: '警车',
    5: '船',
    6: '电动四轮',
    7: '电瓶车'
};
function getGwsj(info: any) {
    const start = (info.postStartTime || '').slice(0,5);
    const end = (info.postEndTime || '').slice(0,5);
    if (+start.split(':').join('') >= +end.split(':').join('')) {
        return start + '~' + end + "(跨天)";
    }
    return start + '~' + end;
}
/* 岗位组件 */
export default function PostItem(props: {postType: any, info: any}) { 
    // props: {postType: any}
    return (
        <div className='mb-[14px] px-4 py-[18px] relative bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.0902)] rounded-[14px]'>
            {
                props.postType === 1 && <>
                    <div className='text-xl text-[#008fff] mb-[9px]'>{props.info.postInfoName}</div>
                    <div className='mb-[6px] flex'>
                        <div className="leading-5 text-[#333]/[.7] mr-[15px]">岗位时间</div>
                        <div className="text-[#333] leading-5">{getGwsj(props.info)}</div>
                    </div>
                    <div className='mb-[6px] flex'>
                        <div className="leading-5 text-[#333]/[.7] mr-[15px]">岗位类型</div>
                        <div className='px-[6px] bg-[#008fff] rounded-lg text-white text-sm leading-4 h-4'>{props.info.postTypeName}</div>
                    </div>
                    {
                        props.info.postTimeName &&
                        <div className='mb-[6px] flex'>
                            <div className="leading-5 text-[#333]/[.7] mr-[15px]">岗次类型</div>
                            <div className="text-[#333] leading-5">{props.info.postTimeName}</div>
                        </div>
                    }
                    {
                        (props.info.modeOfTravel || props.info.wheatherGun + '' === '1') && 
                        <div className='mb-[6px] flex'>
                            <div className="leading-5 text-[#333]/[.7] mr-[15px]">岗位标签</div>
                            <div className="text-[#333] leading-5">
                                {[tripMode[props.info.modeOfTravel], props.info.wheatherGun + '' === '1'].filter(i => !!i).map(i => {
                                    if (i + '' === 'true') {
                                        return '携枪'
                                    }
                                    return i
                                }).join(' | ')}
                            </div>
                        </div>
                    }
                    {
                        props.info.dutyAddress &&
                        <div className='mb-[6px] flex'>
                            <div className="leading-5 text-[#333]/[.7] mr-[15px]">工作地点</div>
                            <div className="text-[#333] leading-5">{props.info.dutyAddress}</div>
                        </div>
                    }
                </>
            }
            {
                props.postType !== 1 && <>
                    <div className='text-xl text-[#008fff] mb-[9px]'>{props.info.postInfoName}</div>
                    <div className=''>
                        <span className="leading-5 text-[#333]/[.7] mr-[15px]">岗位类型</span>
                        <span className='px-[6px] bg-[#008fff] rounded-lg text-white text-sm leading-4 h-4'>值班</span>
                    </div>
                    <div className=''>
                        <span className="leading-5 text-[#333]/[.7] mr-[15px]">班次时间</span>
                        <span className="text-[#333] leading-5">{getGwsj(props.info)}</span>
                    </div>
                </>
            }
        </div>
    )
}