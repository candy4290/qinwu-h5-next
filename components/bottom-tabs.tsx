import { TabBar } from 'antd-mobile';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useUserInfo } from '@/utils/hooks/use-userInfo';
import _ from 'lodash';

export default function BottomTabs() {
    const pathname = usePathname();
    const router = useRouter();
    const {tabs} = useUserInfo();

    function go(path: string) {
        router.push(path);
    }

    return (
        <TabBar className='tBottom' activeKey={(pathname || '').slice(5)} onChange={value => go(`/home${value}`)}>
            {tabs.map(item => (
                <TabBar.Item
                key={item.key}
                icon={(pathname || '').slice(5).startsWith(item.key) ? 
                <Image width={32} height={32} src={item.icon2} alt='' />
                 : <Image src={item.icon} width={32} height={32} alt='' />}
                title={item.title}
                badge={item.badge}
                />
            ))}
        </TabBar>
    )
}