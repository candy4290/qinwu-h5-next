import { getUnReadMsg } from '@/redux/messageInfoSlice';
import { getUserInfo, tabsSelector } from '@/redux/userInfoSlice';
import { useAppDispatch } from '@/redux/store';
import { useAuth } from '@/utils/hooks/use-auth';
import { useEffect } from 'react';
import { useAppSelector } from '@/redux/store';
import { userInfoSelector } from '@/redux/userInfoSlice';

/* 进入系统页面后，根据进入方式，获取用户信息；并轮询用户信息 */
export function useUserInfo() {
    const userInfo = useAppSelector(userInfoSelector);
    const tabs = useAppSelector(tabsSelector);
    const { setCode, initUserInfo } = useAuth();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (localStorage.getItem('guestPsw') !== 'true') { /* 通过授权进入 */
            setCode(process.env.NEXT_PUBLIC_REDIRECT_URL + (location.pathname.slice(1) === 'home' ? 'home/schedule' : location.pathname.slice(1)));
            initUserInfo(() => dispatch(getUserInfo()));
        } else { /* 通过手势密码进入 */
            dispatch(getUserInfo());
        }
        const t$ = setInterval(() => { /* 1分钟获取一次用户信息 */
            dispatch(getUserInfo())
        }, 60 * 1000);
        return () => {
            clearInterval(t$);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (userInfo) {
            dispatch(getUnReadMsg());
        }
    }, [userInfo, dispatch])
    return {tabs, userInfo};
}