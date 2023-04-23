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
    const {
        info
    } = props;
    
    return (
        <div className=' relative mt-[19px] mb-3 ml-5 flex'>
            <Image src='/imgs/police-photo.png' className='mr-2 rounded-[50%]' width={48} height={48} alt='' />
            <div>
                <div className='flex items-center text-[18px] text-white leading-[25px]'>
                    <div className='font-semibold mr-1'>{props.info?.perName}</div>
                    <span className='font-semibold relative top-[-2px]'>(</span>
                    <span>{props.info?.perCode || '暂无警号'}</span>
                    <span className='font-semibold relative top-[-2px]'>)</span>
                </div>
                <div className='text-white leading-5 opacity-70'><span>{showOrgName(props.info?.orgName || '')}</span></div>
                {
                    info?.ifSecondment === '0' && info.secondmentOrgName && <div className='text-white leading-5 opacity-70'>
                        借调：{info.secondmentOrgName}
                    </div>
                }
            </div>
        </div>
    )
}