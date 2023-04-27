import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/utils/hooks/use-auth';

/* 欢迎页 */
export default function Home() {
  const { setCode } = useAuth();
  const router = useRouter();

  const params = useSearchParams();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PROD === 'false') {
      /* 开发环境初次进入，根据url参数设置UserId */
      const UserId = params.get('UserId');
      if ((UserId || localStorage.getItem('UserId')) !== localStorage.getItem('UserId')) {
        /* 切换用户了-清除本地缓存 */
        localStorage.clear();
      }
      localStorage.setItem('UserId', UserId || localStorage.getItem('UserId') || '');
    }
  }, [params]);

  function init() {
    localStorage.setItem('guestPsw', 'false');
    router.push('/home/schedule');
  }
  function goLock() {
    if (localStorage.getItem('UserId')) {
      /* 已授权且拿到过用户id */
      goSetLock();
    } else {
      /* 没有拿到过用户id且未设置过密码 */
      setCode(process.env.NEXT_PUBLIC_REDIRECT_URL + 'lock/');
    }
  }

  function goSetLock() {
    router.push('/lock');
  }
  return (
    <div className="relative h-screen bg-[url('/imgs/welcome/bg-login.png')] bg-cover">
      <div className="absolute left-10 top-36 text-[44px] leading-[62px] text-white" style={{ textShadow: '0px 3px 6px #1054B7' }}>
        您好！
      </div>
      <div className={'absolute left-10 top-[200px] text-[22px] leading-[33px] text-white'} style={{ textShadow: '0px 3px 6px #1054B7' }}>
        欢迎来到市局勤务系统
      </div>
      <div className={'absolute bottom-[187px] left-10 right-10 h-16 rounded-[10px] bg-gradient-to-r from-mitBlue2 to-mitBlue text-center text-lg leading-[64px] text-white active:opacity-90'} onClick={init}>
        政务微信登录
      </div>
      <div className="absolute bottom-[102px] left-1/2 -translate-x-1/2 text-base text-white/[0.85] active:opacity-90" onClick={goLock}>
        手势密码登录
      </div>
    </div>
  );
}
