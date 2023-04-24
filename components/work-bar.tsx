import { useEffect, useState } from 'react';

const prefix = 'ms-workbar';
/* 工作时长统计图 */
export default function WorkBar(props: {
    title: string,
    total: number,
    max: number,
    rc: number,
    zx: number,
    zb: number
}) {
    const [theme, setTheme] = useState<any>({
        color:'#008FFF',
        background: 'linear-gradient(314deg, #00D7FF 0%, #008FFF 100%)',
        boxShadow: 'box-shadow: 0px 2px 8px 1px rgba(0,143,255,0.3490)'
    });
    useEffect(() => {
        if (props.title === '本月工作时长') {
            setTheme({
                color:'#008FFF',
                background: 'linear-gradient(314deg, #00D7FF 0%, #008FFF 100%)',
                boxShadow: 'box-shadow: 0px 2px 8px 1px rgba(0,143,255,0.3490)',
            });
        } else {
            setTheme({
                color:'#00D7FF',
                background: 'linear-gradient(314deg, #008FFF 0%, #00D7FF 100%)',
                boxShadow: '0px 2px 8px 1px rgba(0,143,255,0.3020)',
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <div className='mb-[50px]'>
        <div className='flex items-center justify-between text-sm font-medium text-[#000]/[.9]'>
            <span>{props.title}</span>
            <span>{props.total} 小时</span>
        </div>
        <div className='mt-[6px] mb-[14px] text-[#000]/[.5] text-xs'>单位：小时</div>
        <div className='mb-[6px] flex items-center'>
            <div className='text-[#000]/[.5] text-xs mr-3'>日常</div>
            <div className='flex-1 mr-[30px] h-[5px]'>
                <div className="h-[5px] shadow-[0px_2px_8px_1px_rgba(0,143,255,0.35)] rounded-[3px]" style={{width: props.max === 0 ? 0 : (props.rc/props.max * 100).toFixed(2) + '%', background: theme.background, boxShadow: theme.boxShadow}}></div>
            </div>
            <div className='w-[52px] text-xs font-semibold' style={{color: theme.color}}>{props.rc}</div>
        </div>
        <div className='mb-[6px] flex items-center'>
            <div className='text-[#000]/[.5] text-xs mr-3'>专项</div>
            <div className='flex-1 mr-[30px] h-[5px]'>
                <div className="h-[5px] shadow-[0px_2px_8px_1px_rgba(0,143,255,0.35)] rounded-[3px]" style={{width: props.max === 0 ? 0 : (props.zx/props.max * 100).toFixed(2) + '%', background: theme.background, boxShadow: theme.boxShadow}}></div>
            </div>
            <div className='w-[52px] text-xs font-semibold' style={{color: theme.color}}>{props.zx}</div>
        </div>
        <div className='mb-[6px] flex items-center'>
            <div className='text-[#000]/[.5] text-xs mr-3'>值班</div>
            <div className='flex-1 mr-[30px] h-[5px]'>
                <div className="h-[5px] shadow-[0px_2px_8px_1px_rgba(0,143,255,0.35)] rounded-[3px]" style={{width: props.max === 0 ? 0 : (props.zb/props.max * 100).toFixed(2) + '%', background: theme.background, boxShadow: theme.boxShadow}}></div>
            </div>
            <div className='w-[52px] text-xs font-semibold' style={{color: theme.color}}>{props.zb}</div>
        </div>
    </div>
}