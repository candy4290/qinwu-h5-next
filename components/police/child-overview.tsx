import { Empty, Input, Tabs } from 'antd-mobile';
import { CurrentOrgInterface } from '@/utils/types';
import { SearchOutline, CloseCircleOutline } from 'antd-mobile-icons';
import { BarContent, BarTitle } from './bar';
import { useEffect, useRef } from 'react';
import { useSafeState } from 'ahooks';
import axios from 'axios';
import apis from '@/utils/apis';
import OrgItem from './org-item';
import _ from 'lodash';
import Image from 'next/image';

type OrgTypes = '4' | '2' | '3';

type DynamicTabsInterface = {
  [i in OrgTypes]: any[];
};

const tt: {
  [i in OrgTypes]: string;
} = {
  '4': '派出所',
  '2': '机关单位',
  '3': '业务部门',
};

const ttt: OrgTypes[] = ['4', '2', '3'];

function DynamicTabs(props: { data: DynamicTabsInterface; originData: DynamicTabsInterface }) {
  const { data, originData } = props;
  const [tabs, setTabs] = useSafeState<[string, OrgTypes][]>([]);
  const [activeKey, setActiveKey] = useSafeState<OrgTypes>('4');
  useEffect(() => {
    /* 初始化存在的tab */
    const temp: [string, OrgTypes][] = [];
    ttt.forEach(i => {
      if (originData[i].length > 0) {
        temp.push([tt[i], i]);
      }
    });
    setTabs(temp);
  }, [originData, setTabs]);

  useEffect(() => {
    if (data[activeKey].length === 0) {
      if (data[4].length > 0) {
        setActiveKey('4');
      } else if (data[2].length > 0) {
        setActiveKey('2');
      } else if (data[3].length > 0) {
        setActiveKey('3');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Tabs
      activeKey={activeKey}
      onChange={e => {
        setActiveKey(e as OrgTypes);
      }}
    >
      {tabs.map((i, idx) => {
        return (
          <Tabs.Tab title={<BarTitle title={i[0]} hasSplit={idx < tabs.length - 1} />} key={i[1]} destroyOnClose={true}>
            <BarContent>
              {data[i[1]].length === 0 && <Empty image={<Image src="/imgs/statistics/empty.png" width={65} height={74} alt="" />} description="暂无结果~" />}
              {data[i[1]].map(item => {
                return <OrgItem key={item.orgCode} info={item} />;
              })}
            </BarContent>
          </Tabs.Tab>
        );
      })}
    </Tabs>
  );
}

/* 下属单位警力总览页 */
export default function ChildOverview(props: { currentOrg: CurrentOrgInterface }) {
  const { currentOrg } = props;
  const [downDataList, setDownDataList] = useSafeState<DynamicTabsInterface>({
    4: [],
    2: [],
    3: [],
  });
  const [originDownDataList, setOriginDownDataList] = useSafeState<DynamicTabsInterface>({ 4: [], 2: [], 3: [] });
  const [keywords, setKeywords] = useSafeState('');
  const [height] = useSafeState(window.innerHeight);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    Promise.all([
      axios.get(apis.getDownOrgsInfo, {
        /* 下属派出所 */
        params: {
          orgCode: currentOrg.orgCode,
          jgsx: 4,
          postTypeId: '',
        },
      }),
      axios.get(apis.getDownOrgsInfo, {
        /* 下属机关单位 */
        params: {
          orgCode: currentOrg.orgCode,
          jgsx: 2,
          postTypeId: '',
        },
      }),
      axios.get(apis.getDownOrgsInfo, {
        /* 下属业务部门 */
        params: {
          orgCode: currentOrg.orgCode,
          jgsx: 3,
          postTypeId: '',
        },
      }),
    ]).then((rsp: any) => {
      const temp = { 4: [], 2: [], 3: [] };
      temp[4] = rsp[0];
      temp[2] = rsp[1];
      temp[3] = rsp[2];
      setOriginDownDataList(temp);
    });
  }, [currentOrg, setOriginDownDataList]);

  function enterPress(e: any) {
    setKeywords(e.target.value);
  }

  function search() {
    if (inputRef.current?.nativeElement.value && inputRef.current?.nativeElement.value === keywords) {
      setDownDataList(data => {
        return _.cloneDeep(data);
      });
    } else {
      setKeywords(inputRef.current?.nativeElement.value);
    }
  }

  function clear() {
    inputRef.current?.clear();
    setKeywords('');
  }

  useEffect(() => {
    const temp = _.cloneDeep(originDownDataList);
    temp['4'] = temp['4'].filter(i => i.orgName.includes(keywords));
    temp['2'] = temp['2'].filter(i => i.orgName.includes(keywords));
    temp['3'] = temp['3'].filter(i => i.orgName.includes(keywords));
    setDownDataList(temp);
  }, [keywords, setDownDataList, originDownDataList]);

  useEffect(() => {
    function controlTabls() {
      const u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        if (height > window.innerHeight) {
          const item = document.getElementsByClassName('tBottom')[0] as HTMLElement;
          item.style.visibility = 'hidden';
        } else {
          const item = document.getElementsByClassName('tBottom')[0] as HTMLElement;
          item.style.visibility = 'visible';
        }
      }
    }
    window.addEventListener('resize', controlTabls);
    return () => {
      window.removeEventListener('resize', controlTabls);
    };
  }, [height]);

  return (
    <div>
      <div className="h-[309px] w-screen overflow-hidden bg-[url('/imgs/schedule/bg+圆@2x.png')] bg-cover">
        <div className="relative mx-4 my-8 flex h-9 items-center">
          <SearchOutline className="absolute left-[14px] top-1/2 -translate-y-1/2 cursor-pointer text-base text-[grey]" />
          <CloseCircleOutline className="absolute right-[52px] top-1/2 -translate-y-1/2 cursor-pointer text-base text-[grey]" onClick={clear} />
          <Input className="child-overview-input" ref={inputRef} onEnterPress={enterPress} placeholder="请输入内容" />
          <div className="break-keep text-base text-white" onClick={search}>
            搜索
          </div>
        </div>
      </div>
      <div className="mt-[-208px] min-h-[300px] rounded-t-[40px] bg-mitWhite pt-6">
        <DynamicTabs data={downDataList} originData={originDownDataList} />
      </div>
    </div>
  );
}
