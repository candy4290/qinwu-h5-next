import apis from '@/utils/apis';
import { CurrentOrgInterface } from '@/utils/types';
import { useSafeState } from 'ahooks';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect } from 'react';

export interface DutyLevelProps {
  dutyLevelValue?: '0' | '1' | '2' | '3' | '4';
  currentOrg: CurrentOrgInterface /* 机构code */;
  dutyDate?: string;
  style?: React.CSSProperties;
}
export const dutyMap = {
  0: '常态勤务',
  1: '三级勤务',
  2: '二级勤务',
  3: '一级勤务',
  4: '一级加强',
};
export default function DutyLevel(props: DutyLevelProps) {
  const { dutyLevelValue, currentOrg, dutyDate = moment().format('yyyy-MM-DD'), style } = props;
  const [dutyLevel, setDutyLevel] = useSafeState<DutyLevelProps['dutyLevelValue']>('0');
  useEffect(() => {
    if (!dutyLevelValue) {
      axios
        .get(apis.getDutyLevel, {
          params: {
            dutyDate,
            orgCode: currentOrg.orgCode,
          },
        })
        .then((rsp: any) => {
          setDutyLevel(rsp['duty_level'] || '0');
        });
    }
  }, [dutyLevelValue, dutyDate, currentOrg, setDutyLevel]);
  return (
    <div className="flex h-[62px] items-center justify-between rounded-[20px] bg-white pl-[36px] pr-[42px] shadow-[0px_2px_7px_1px_rgba(61,110,232,0.1)]" style={style}>
      <div className="text-xs text-black">等级勤务</div>
      <div className="text-base font-semibold text-mitBlue">{dutyMap[dutyLevelValue || dutyLevel || '0']}</div>
    </div>
  );
}
