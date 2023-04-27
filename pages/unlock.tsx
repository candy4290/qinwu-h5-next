import CanvasLock from '@/components/canvas-lock';
import { CenterPopup, Toast } from 'antd-mobile';
import { useRef, useState } from 'react';
import { CloseOutline } from 'antd-mobile-icons';
import { useRouter } from 'next/router';

/* 手势登录页 */
export default function Unlock() {
  // const {setCode} = useAuth();
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(); /* 是否前往验证的弹窗 */
  const [visible2, setVisible2] = useState<boolean>(); /* 错误超过5次的弹窗 */
  const errorTimeRef = useRef(0);
  const canvasLockRef = useRef<any>();

  function init() {
    localStorage.setItem('guestPsw', 'false');
    // setCode(process.env.NEXT_PUBLIC_REDIRECT_URL + 'home/');
  }
  function onChange(password: any) {
    if (errorTimeRef.current > 5) {
      setVisible2(true);
      canvasLockRef.current.reset();
      return;
    }
    const psw = password + '';
    if (psw.length < 4) {
      Toast.show({
        content: '至少需连接4个点',
        position: 'bottom',
      });
      canvasLockRef.current.error();
      const t$ = setTimeout(() => {
        canvasLockRef.current.reset();
        clearTimeout(t$);
      }, 1000);
    } else if (localStorage.getItem('psw') !== psw) {
      errorTimeRef.current++;
      Toast.show({
        content: '手势密码错误',
        position: 'bottom',
      });
      canvasLockRef.current.error();
      const t$ = setTimeout(() => {
        canvasLockRef.current.reset();
        clearTimeout(t$);
      }, 1000);
      if (errorTimeRef.current > 5) {
        setVisible2(true);
      }
    } else {
      canvasLockRef.current.success();
      localStorage.setItem('guestPsw', 'true');
      router.push('/home/schedule');
    }
  }

  function forgetPsw() {
    /* 忘记密码 */
    setVisible(true);
  }

  function goYanZheng() {
    /* 重新设置密码 */
    localStorage.removeItem('UserId');
    localStorage.removeItem('psw');
    localStorage.removeItem('pwdIdcard');
    localStorage.setItem('guestPsw', 'false');
    router.push(process.env.NEXT_PUBLIC_REDIRECT_URL + 'lock/');
  }

  return (
    <div className="relative h-screen bg-white">
      <div className="fixed h-full w-full bg-[url('/imgs/welcome/bg-login.png')] bg-cover blur-[10px]" />
      <div className="absolute left-10 top-36 text-[44px] leading-[62px] text-white" style={{ textShadow: '0px 3px 6px #1054B7' }}>
        您好！
      </div>
      <div className="absolute left-10 top-[200px] text-[22px] leading-[33px] text-white" style={{ textShadow: '0px 3px 6px #1054B7' }}>
        欢迎来到市局勤务系统
      </div>
      <div className="absolute left-1/2 top-[40%] h-[26px] -translate-x-1/2 rounded-[20px] bg-white px-[10px] text-sm leading-[26px] text-mitGray active:opacity-80" onClick={init}>
        使用政务微信登录
      </div>
      <CanvasLock
        callBack={onChange}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 80,
        }}
        ref={canvasLockRef}
      />
      <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 text-sm leading-[18px] text-white/[.85] active:opacity-80" onClick={forgetPsw}>
        忘记手势密码
      </div>
      <CenterPopup visible={visible}>
        <div className="relative px-6 pb-[19px] pt-4">
          <div className="text-base leading-[22px] text-black/[.85]">忘记手势密码？</div>
          <CloseOutline onClick={() => setVisible(false)} className="absolute right-6 top-4 text-base text-black/[.45]" />
          <div className="mt-[14px] text-sm text-black/[.65]">请前往与手势密码绑定的政务微信验证</div>
          <div className="mt-[37px] flex items-center justify-between">
            <div className="w-[101px] text-center text-black/[.65] active:opacity-70" onClick={() => setVisible(false)}>
              取消
            </div>
            <div className="h-[12px] w-[1px] bg-[#a6a6a6]"></div>
            <div className="w-[101px] text-center text-[#2A82E4] active:opacity-70" onClick={goYanZheng}>
              去验证
            </div>
          </div>
        </div>
      </CenterPopup>
      <CenterPopup visible={visible2}>
        <div className="relative px-6 pb-[19px] pt-4">
          <div className="text-base leading-[22px] text-black/[.85]">手势密码输入错误超过5次？</div>
          <CloseOutline onClick={() => setVisible2(false)} className="absolute right-6 top-4 text-base text-black/[.45]" />
          <div className="mt-[14px] text-sm text-black/[.65]">请到政务微信验证并重新设置手势密码</div>
          <div className="mt-[37px] flex items-center justify-between">
            <div className="w-[101px] text-center text-black/[.65] active:opacity-70" onClick={init}>
              政务微信登录
            </div>
            <div className="h-[12px] w-[1px] bg-[#a6a6a6]"></div>
            <div className="w-[101px] text-center text-[#2A82E4] active:opacity-70" onClick={goYanZheng}>
              去设置
            </div>
          </div>
        </div>
      </CenterPopup>
    </div>
  );
}
