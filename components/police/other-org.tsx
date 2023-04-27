import DutyLevel, { DutyLevelProps } from './duty-level';
import apis from '@/utils/apis';
import { useSafeState } from 'ahooks';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { useContext, useEffect } from 'react';
import { CurrentOrgContext, CurrentOrgInterface } from '@/pages/home/police';
import DutyLeader from './duty-leader';
import PoliceStrengthItem from './police-strength-item';
import { StatisticData, StatisticsDataInterface } from './statistics-data';

const prefix = `ms-otherorg`;
export default function OtherOr(props: { currentOrg: CurrentOrgInterface }) {
  const { currentOrg } = props;

  const [dutyLevel, setDutyLevel] = useSafeState<DutyLevelProps['dutyLevelValue']>('0');
  const [data, setData] = useSafeState<any>({});
  const setCurrentOrg = useContext(CurrentOrgContext);
  const [statisticData, setStatisticData] = useSafeState<StatisticsDataInterface>({
    totayCardPeopleNum: 0,
    currentCardPeopleNum: 0,
    currentDutyPeopleNum: 0,
    totayDutyPeopleNum: 0,
  });
  const [hasDownOrgs, setHasDownOrgs] = useSafeState(false); /* 是否有下属机构 */

  useEffect(() => {
    axios
      .get(apis.getDutyLevel, {
        /* 获取等级勤务 */
        params: {
          dutyDate: moment().format('yyyy-MM-DD'),
          orgCode: currentOrg.orgCode,
        },
      })
      .then((rsp: any) => {
        setDutyLevel(rsp['duty_level'] || '0');
      });

    axios
      .get(apis.getTjData, {
        /* 当日排班数+当前排班数+当前打卡 */
        params: {
          orgCode: currentOrg.orgCode,
        },
      })
      .then((rsp: any) => {
        setStatisticData(rsp);
      });

    axios
      .get(apis.getDataByPost, {
        /* 一级岗位总览 */
        params: {
          orgCode: currentOrg.orgCode,
        },
      })
      .then((rsp: any) => {
        const temp: any = {};
        rsp.forEach((i: any) => {
          temp[i.postTypeId] = i;
        });
        setData(temp);
      });

    axios
      .get(apis.getDownOrgList, {
        params: {
          orgCode: currentOrg.orgCode,
        },
      })
      .then((rsp: any) => {
        setHasDownOrgs((rsp || []).length > 0 ? true : false);
      });
  }, [setDutyLevel, setStatisticData, setData, setHasDownOrgs, currentOrg]);

  return (
    <div className="px-6 py-5">
      <DutyLevel dutyLevelValue={dutyLevel} currentOrg={currentOrg} />
      <DutyLeader currentOrg={currentOrg} />
      <StatisticData style={{ marginTop: 18 }} data={statisticData} />
      <div className="mt-[18px] flex flex-wrap justify-between">
        <PoliceStrengthItem data={data['2000']} postTypeName="业务-街面警力" />
        <PoliceStrengthItem data={data['2003']} postTypeName="业务-窗口警力" />
        <PoliceStrengthItem data={data['2016']} postTypeName="日常办公警力" />
      </div>
      {hasDownOrgs && (
        <div
          className="mt-[14px] h-[45px] rounded-[23px] bg-mitBlue text-center text-lg font-semibold text-white"
          onClick={() =>
            setCurrentOrg((org: any) => {
              const temp = _.cloneDeep(org);
              temp.isZongLan = true;
              return temp;
            })
          }
        >
          下属单位警力总览
        </div>
      )}
    </div>
  );
}
