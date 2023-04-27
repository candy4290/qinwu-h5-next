import { PoliceInfoType } from '@/utils/types';
import { usePrevious, useSafeState } from 'ahooks';
import { PullToRefresh } from 'antd-mobile';
import _ from 'lodash';
import moment from 'moment';
import { createContext, useEffect } from 'react';
import ChildOverview from '@/components/police/child-overview';
import Fenju from '@/components/police/fenju';
import OtherOrg from '@/components/police/other-org';
import PaiChuSuo from '@/components/police/paichusuo';
import Shiju from '@/components/police/shiju';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { useAppSelector } from '@/redux/store';
import { userInfoSelector } from '@/redux/userInfoSlice';
export const CurrentOrgContext = createContext<React.Dispatch<React.SetStateAction<CurrentOrgInterface | undefined>>>(null as any);
CurrentOrgContext.displayName = 'CurrentOrgContext';

export interface CurrentOrgInterface {
  orgName: string;
  orgCode: string;
  orgAttr: PoliceInfoType['manageUnitOrgAttr'];
  isZongLan?: boolean /* 下属单位总览页 */;
}

export default function Police() {
  const userInfo = useAppSelector(userInfoSelector);
  const [currentOrg, setCurrentOrg] = useSafeState<CurrentOrgInterface>();
  const preUserInfo = usePrevious(userInfo);
  const [updateTime, setUpdateTime] = useSafeState<string>(moment().format('yyyy-MM-DD HH:mm:ss'));

  if (userInfo && !currentOrg) {
    setCurrentOrg({
      orgCode: userInfo.manageUnit,
      orgAttr: userInfo.manageUnitOrgAttr,
      orgName: userInfo.manageUnitOrgName,
    });
  }

  useEffect(() => {
    if (currentOrg?.isZongLan) {
      const idx = currentOrg?.orgName.indexOf('公安局');
      const temp = currentOrg?.orgName.slice(idx === -1 ? 0 : idx + 3);
      document.title = temp + '下属单位警力总览';
    } else {
      if (currentOrg?.orgAttr + '' === '0') {
        document.title = '市局轻应用';
      } else {
        const idx = currentOrg?.orgName.indexOf('公安局') || -1;
        const temp = currentOrg?.orgName.slice(idx === -1 ? 0 : idx + 3);
        document.title = temp || '';
      }
      return () => {
        document.title = '市局轻应用';
      };
    }
  }, [currentOrg, userInfo]);

  useEffect(() => {
    if (userInfo && preUserInfo?.manageUnit !== userInfo?.manageUnit) {
      /* 管理单位发生变化时---更新警力页面 */
      setCurrentOrg({
        orgCode: userInfo.manageUnit,
        orgAttr: userInfo.manageUnitOrgAttr,
        orgName: userInfo.manageUnitOrgName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <PullToRefresh
      completeText={<span>{'更新时间：' + updateTime}</span>}
      onRefresh={async () => {
        await sleep(1000);
        setCurrentOrg(i => {
          return _.cloneDeep(i);
        });
        setUpdateTime(moment().format('yyyy-MM-DD HH:mm:ss'));
      }}
    >
      <CurrentOrgContext.Provider value={setCurrentOrg}>
        {currentOrg?.isZongLan ? (
          <ChildOverview currentOrg={currentOrg} />
        ) : (
          <>
            {
              /* 管理单位-市局 */
              currentOrg && currentOrg.orgAttr + '' === '0' && <Shiju currentOrg={currentOrg} />
            }
            {
              /* 管理单位-分局 */
              currentOrg && currentOrg.orgAttr + '' === '1' && <Fenju currentOrg={currentOrg} />
            }
            {
              /* 管理单位-派出所 */
              currentOrg && currentOrg.orgAttr + '' === '4' && <PaiChuSuo currentOrg={currentOrg} />
            }
            {
              /** 管理单位-其他 */
              currentOrg && !['0', '1', '4'].includes(currentOrg.orgAttr + '') && <OtherOrg currentOrg={currentOrg} />
            }
          </>
        )}
      </CurrentOrgContext.Provider>
    </PullToRefresh>
  );
}
