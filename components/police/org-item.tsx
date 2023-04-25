import { RightOutline } from 'antd-mobile-icons';
import { useContext } from 'react';
import { CurrentOrgContext } from '@/pages/home/police';
import { Empty } from 'antd-mobile';
import Image from 'next/image';

function Dutyleads(props: {personLeaderVOList: any}) {
    const {personLeaderVOList} = props;
    return (
        <>
            {
                (personLeaderVOList || []).length === 0 &&
                <Empty className='org-empty' style={{ height: 95 }} image={<Image src='/imgs/statistics/empty.png' width={65} height={74} alt='' />} description='暂无值班领导~' />
            }
            {
                (personLeaderVOList || []).length > 0 &&
                <>
                    <div className='flex'>
                        {
                            personLeaderVOList.map((item: any) => {
                                return <div className='w-1/2' key={item.name + item.perCode}>
                                    <div className='flex items-center break-keep'>
                                        <span className='text-[#333] text-lg font-semibold'>{item.name}</span>
                                        <span className='text-[#333] text-xs opacity-70'> ({item.perCode || '暂无警号'})</span>
                                        {
                                            item.equipType === '1' &&
                                            <div className='m-[2px] w-4 h-4 shadow-[0px_0px_2px_1px_rgba(0,143,255,0.35)] rounded-[50%] text-center text-xs text-white' style={{background: 'linear-gradient(314deg, #008FFF 0%, #00D7FF 100%)'}}>枪</div>
                                        }
                                    </div>
                                    <div className='mt-[2px] text-[#333]/[.7] text-sm'>{item.personJob || '暂无职位'}</div>
                                    <div className='mt-1 flex items-center'>
                                        <Image className='mr-[2px]' alt='' width={20} height={20} src='/imgs/police/icon-手机@2x.png' />
                                        <span className='text-[#333] text-sm'>{item.phone || '暂无手机号'}</span>
                                    </div>
                                    <div className='mt-1 flex items-center'>
                                        <Image className='mr-[2px]' alt='' width={20} height={20} src='/imgs/police/icon-座机@2x.png' />
                                        <span className='text-[#333] text-sm'>{item.fixedTelephone || '暂无座机号'}</span>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </>
            }
        </>
    )
}

/* 警力分析页-某个单位项 */
export default function OrgItem(props: { info: any | any[] }) {
    const { info = {} } = props;
    const setCurrentOrg = useContext(CurrentOrgContext);

    function go(orgInfo: any) {
        setCurrentOrg({
            orgAttr: orgInfo.orgAttr,
            orgCode: orgInfo.orgCode,
            orgName: orgInfo.orgName
        })
    }
    return (
        <div className='bg-white shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)] rounded-[20px] py-[18px] pr-[29px] pl-[21px] mt-3 relative'>
            {
                Array.isArray(info) ? <>
                    <div>
                        <div className="text-[#008fff] text-base font-semibold relative after:content-[''] after:absolute after:h-[2px] after:w-10 after:bg-[#008fff] after:bottom-[-3px] after:left-0">{info[0].orgName}</div>
                        <div className='absolute top-0 right-0 py-6 px-[29px]' onClick={() => go(info[0])}>
                            <RightOutline />
                        </div>
                    </div>
                    <div className='flex' style={{ marginTop: 19 }}>
                        <span className='px-[5px] h-4 text-center text-xs block shaodow-[0px_2px_8px_1px_rgba(0,143,255,0.3020)] rounded-lg text-white mr-[10px]' style={{background: 'linear-gradient(314deg, #00D7FF 0%, #008FFF 100%)'}}>集中</span>
                        <div className='w-[40%] mb-[10px] flex items-center text-sm'>
                            <div className='text-[#333]/[.65] mr-[10px]'>当前排班</div>
                            <div>{info[0].currentDutyPeopleNum || 0}</div>
                        </div>
                        <div className='w-[40%] mb-[10px] flex items-center text-sm'>
                            <div className='text-[#333]/[.65] mr-[10px]'>当前打卡</div>
                            <div>{info[0].currentCardPeopleNum || 0}</div>
                        </div>
                    </div>
                    <div className='flex'>
                        <span className='px-[5px] h-4 text-center text-xs block shaodow-[0px_2px_8px_1px_rgba(0,143,255,0.3020)] rounded-lg text-white mr-[10px]' style={{background: 'linear-gradient(314deg, #00D7FF 0%, #008FFF 100%)'}}>动中</span>
                        <div className='w-[40%] mb-[10px] flex items-center text-sm'>
                            <div className='text-[#333]/[.65] mr-[10px]'>当前排班</div>
                            <div>{info[1].currentDutyPeopleNum || 0}</div>
                        </div>
                        <div className='w-[40%] mb-[10px] flex items-center text-sm'>
                            <div className='text-[#333]/[.65] mr-[10px]'>当前打卡</div>
                            <div>{info[1].currentCardPeopleNum || 0}</div>
                        </div>
                    </div>
                    <div className='h-[1px] bg-[#333] opacity-[.07] mb-[10px]'></div>
                    <Dutyleads personLeaderVOList={info[0].personLeaderVOList} />
                </> :
                    <>
                        <div>
                            <div className="text-[#008fff] text-base font-semibold relative after:content-[''] after:absolute after:h-[2px] after:w-10 after:bg-[#008fff] after:bottom-[-3px] after:left-0">{info.orgName}</div>
                            <div className='absolute top-0 right-0 py-6 px-[29px]' onClick={() => go(info)}>
                                <RightOutline />
                            </div>
                        </div>
                        <div className='mt-[19px] flex flex-wrap'>
                            <div className='mb-[10px] w-1/2 flex items-center text-sm'>
                                <div className='text-[#333]/[.65] mr-[10px]'>当日排班</div>
                                <div>{info.totayCardPeopleNum || 0}</div>
                            </div>
                            <div className='mb-[10px] w-1/2 flex items-center text-sm'>
                                <div className='text-[#333]/[.65] mr-[10px]'>当日值班</div>
                                <div>{(info.todayDuty || '').split(',')[0] || 0}</div>
                            </div>
                            <div className='mb-[10px] w-1/2 flex items-center text-sm'>
                                <div className='text-[#333]/[.65] mr-[10px]'>当前排班</div>
                                <div>{info.currentDutyPeopleNum || 0}</div>
                            </div>
                            <div className='mb-[10px] w-1/2 flex items-center text-sm'>
                                <div className='text-[#333]/[.65] mr-[10px]'>当前打卡</div>
                                <div>{info.currentCardPeopleNum || 0}</div>
                            </div>
                        </div>
                        <div className='h-[1px] bg-[#333] opacity-[.07] mb-[10px]'></div>
                        <Dutyleads personLeaderVOList={info.personLeaderVOList} />
                    </>
            }
        </div>
    )
}
