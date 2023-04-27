import { TabBar, WaterMark } from 'antd-mobile';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import _ from 'lodash';
import { useAppSelector } from '@/redux/store';
import { tabsSelector, userInfoSelector } from '@/redux/userInfoSlice';

export default function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = useAppSelector(tabsSelector);
  const userInfo = useAppSelector(userInfoSelector);

  function go(path: string) {
    router.push(path);
  }

  return (
    <>
      <TabBar className="tBottom" activeKey={(pathname || '').slice(5)} onChange={value => go(`/home${value}`)}>
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={(pathname || '').slice(5).startsWith(item.key) ? <Image width={32} height={32} src={item.icon2} alt="" /> : <Image src={item.icon} width={32} height={32} alt="" />} title={item.title} badge={item.badge} />
        ))}
      </TabBar>
      <WaterMark fontColor={'rgba(0,0,0,.06)'} rotate={-18} content={userInfo?.perName + ' ' + userInfo?.perCode} fullPage={true} />
    </>
  );
}
