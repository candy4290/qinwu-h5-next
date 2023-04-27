import { RightOutline } from 'antd-mobile-icons';
import { useContext } from 'react';
import { CurrentOrgContext } from '@/pages/home/police';
import { Empty } from 'antd-mobile';
import Image from 'next/image';

function Dutyleads(props: { personLeaderVOList: any }) {
  const { personLeaderVOList } = props;
  return (
    <>
      {(personLeaderVOList || []).length === 0 && <Empty className="org-empty" style={{ height: 95 }} image={<Image src="/imgs/statistics/empty.png" width={65} height={74} alt="" />} description="暂无值班领导~" />}
      {(personLeaderVOList || []).length > 0 && (
        <>
          <div className="flex">
            {personLeaderVOList.map((item: any) => {
              return (
                <div className="w-1/2" key={item.name + item.perCode}>
                  <div className="flex items-center break-keep">
                    <span className="text-lg font-semibold text-mitBlack">{item.name}</span>
                    <span className="text-xs text-mitBlack opacity-70"> ({item.perCode || '暂无警号'})</span>
                    {item.equipType === '1' && (
                      <div
                        className="m-[2px] h-4 w-4 rounded-[50%] text-center text-xs text-white shadow-[0px_0px_2px_1px_rgba(0,143,255,0.35)]"
                        style={{
                          background: 'linear-gradient(314deg, #008FFF 0%, #00D7FF 100%)',
                        }}
                      >
                        枪
                      </div>
                    )}
                  </div>
                  <div className="mt-[2px] text-sm text-mitBlack/[.7]">{item.personJob || '暂无职位'}</div>
                  <div className="mt-1 flex items-center">
                    <Image className="mr-[2px]" alt="" width={20} height={20} src="/imgs/police/icon-手机@2x.png" />
                    <span className="text-sm text-mitBlack">{item.phone || '暂无手机号'}</span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <Image className="mr-[2px]" alt="" width={20} height={20} src="/imgs/police/icon-座机@2x.png" />
                    <span className="text-sm text-mitBlack">{item.fixedTelephone || '暂无座机号'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

/* 警力分析页-某个单位项 */
export default function OrgItem(props: { info: any | any[] }) {
  const { info = {} } = props;
  const setCurrentOrg = useContext(CurrentOrgContext);

  function go(orgInfo: any) {
    setCurrentOrg({
      orgAttr: orgInfo.orgAttr,
      orgCode: orgInfo.orgCode,
      orgName: orgInfo.orgName,
    });
  }
  return (
    <div className="relative mt-3 rounded-[20px] bg-white py-[18px] pl-[21px] pr-[29px] shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]">
      {Array.isArray(info) ? (
        <>
          <div>
            <div className="relative text-base font-semibold text-mitBlue after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-10 after:bg-mitBlue after:content-['']">{info[0].orgName}</div>
            <div className="absolute right-0 top-0 px-[29px] py-6" onClick={() => go(info[0])}>
              <RightOutline />
            </div>
          </div>
          <div className="flex" style={{ marginTop: 19 }}>
            <span
              className="shaodow-[0px_2px_8px_1px_rgba(0,143,255,0.3020)] mr-[10px] block h-4 rounded-lg px-[5px] text-center text-xs text-white"
              style={{
                background: 'linear-gradient(314deg, #00D7FF 0%, #008FFF 100%)',
              }}
            >
              集中
            </span>
            <div className="mb-[10px] flex w-[40%] items-center text-sm">
              <div className="mr-[10px] text-mitBlack/[.65]">当前排班</div>
              <div>{info[0].currentDutyPeopleNum || 0}</div>
            </div>
            <div className="mb-[10px] flex w-[40%] items-center text-sm">
              <div className="mr-[10px] text-mitBlack/[.65]">当前打卡</div>
              <div>{info[0].currentCardPeopleNum || 0}</div>
            </div>
          </div>
          <div className="flex">
            <span
              className="shaodow-[0px_2px_8px_1px_rgba(0,143,255,0.3020)] mr-[10px] block h-4 rounded-lg px-[5px] text-center text-xs text-white"
              style={{
                background: 'linear-gradient(314deg, #00D7FF 0%, #008FFF 100%)',
              }}
            >
              动中
            </span>
            <div className="mb-[10px] flex w-[40%] items-center text-sm">
              <div className="mr-[10px] text-mitBlack/[.65]">当前排班</div>
              <div>{info[1].currentDutyPeopleNum || 0}</div>
            </div>
            <div className="mb-[10px] flex w-[40%] items-center text-sm">
              <div className="mr-[10px] text-mitBlack/[.65]">当前打卡</div>
              <div>{info[1].currentCardPeopleNum || 0}</div>
            </div>
          </div>
          <div className="mb-[10px] h-[1px] bg-mitBlack opacity-[.07]"></div>
          <Dutyleads personLeaderVOList={info[0].personLeaderVOList} />
        </>
      ) : (
        <>
          <div>
            <div className="relative text-base font-semibold text-mitBlue after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-10 after:bg-mitBlue after:content-['']">{info.orgName}</div>
            <div className="absolute right-0 top-0 px-[29px] py-6" onClick={() => go(info)}>
              <RightOutline />
            </div>
          </div>
          <div className="mt-[19px] flex flex-wrap">
            <div className="mb-[10px] flex w-1/2 items-center text-sm">
              <div className="mr-[10px] text-mitBlack/[.65]">当日排班</div>
              <div>{info.totayCardPeopleNum || 0}</div>
            </div>
            <div className="mb-[10px] flex w-1/2 items-center text-sm">
              <div className="mr-[10px] text-mitBlack/[.65]">当日值班</div>
              <div>{(info.todayDuty || '').split(',')[0] || 0}</div>
            </div>
            <div className="mb-[10px] flex w-1/2 items-center text-sm">
              <div className="mr-[10px] text-mitBlack/[.65]">当前排班</div>
              <div>{info.currentDutyPeopleNum || 0}</div>
            </div>
            <div className="mb-[10px] flex w-1/2 items-center text-sm">
              <div className="mr-[10px] text-mitBlack/[.65]">当前打卡</div>
              <div>{info.currentCardPeopleNum || 0}</div>
            </div>
          </div>
          <div className="mb-[10px] h-[1px] bg-mitBlack opacity-[.07]"></div>
          <Dutyleads personLeaderVOList={info.personLeaderVOList} />
        </>
      )}
    </div>
  );
}
