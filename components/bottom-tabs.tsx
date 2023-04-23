import { TabBar } from 'antd-mobile';
import { useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useUserInfo } from '@/utils/hooks/use-userInfo';
import { useAppDispatch } from '@/redux/store';
import { clearMessageTab } from '@/redux/userInfoSlice';
import _ from 'lodash';

export default function BottomTabs() {
    const pathname = usePathname();
    const router = useRouter();
    const {tabs, userInfo} = useUserInfo();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!userInfo) {
            return;
        }
        if (userInfo.policeForceManage !== 1) {
            if (location.pathname.startsWith('/home/police')) { /* 如果在警力分析页，跳转到排班页 */
                router.push('/home/schedule');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    function go(path: string) {
        router.push(path);
        if (path === '/home/message') { /* 进入消息页，取消“小红点”提醒 */
            document.getElementById('pBody')?.scrollTo(0, 10000);
            dispatch(clearMessageTab())
        } else {
            document.getElementById('pBody')?.scrollTo(0, 0);
        }
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