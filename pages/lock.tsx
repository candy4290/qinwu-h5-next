import { useEffect, useRef, useState } from 'react';
import CanvasLock from '@/components/canvas-lock';
import Image from 'next/image';
import { useRouter } from 'next/router';

/* 设置手势密码 */
export default function Lock() {
  const [type, setType] = useState<1 | 2 | 3>(1); /* 1-第一遍 2-第二遍 3-输入密码 */
  const [helpText, setHelpText] = useState<string>();
  const pswRef = useRef<any>({ firstPsw: '', secondPsw: '' });
  const typeRef = useRef<any>();
  const canvasLockRef = useRef<any>();
  const router = useRouter();

  function getUserInfo() {
    if (localStorage.getItem('pwdIdcard') !== localStorage.getItem('UserId')) {
      /* 设置密码 */
      setType(1);
    } else if (localStorage.getItem('psw')) {
      /* 输入密码 */
      // navigate('/unlock');
    }
  }

  useEffect(() => {
    typeRef.current = type;
    if (type === 1) {
      setHelpText('绘制解锁图案，至少需连接4个点');
    } else if (type === 2) {
      setHelpText('再次绘制图案进行确认');
    }
  }, [type]);

  function onChange(password: any) {
    if ((password + '').length < 4) {
      setHelpText('绘制解锁图案，至少需连接4个点');
      canvasLockRef.current.error();
    } else {
      if (typeRef.current === 2) {
        pswRef.current.secondPsw = password + '';
        if (pswRef.current.secondPsw !== pswRef.current.firstPsw) {
          setHelpText('两次绘制不一致！');
          canvasLockRef.current.error();
        } else {
          canvasLockRef.current.success();
          setHelpText('您的新解锁图案');
        }
      } else {
        canvasLockRef.current.success();
      }
    }
    const t$ = setTimeout(() => {
      if ((password + '').length < 4) {
        canvasLockRef.current.reset();
      } else {
        if (typeRef.current === 1) {
          canvasLockRef.current.reset();
          pswRef.current.firstPsw = password + '';
          setType(2);
        } else if (typeRef.current === 2) {
          if (pswRef.current.secondPsw !== pswRef.current.firstPsw) {
            canvasLockRef.current.reset();
          }
        }
      }
      clearTimeout(t$);
    }, 1000);
  }

  function goBack() {
    router.push('/');
  }

  function retry() {
    /* 重绘 */
    setType(1);
    canvasLockRef.current.reset();
  }

  function goGusture() {
    /* 确认按钮 */
    if (pswRef.current.secondPsw && pswRef.current.secondPsw === pswRef.current.firstPsw) {
      localStorage.setItem('pwdIdcard', localStorage.getItem('UserId') || '');
      localStorage.setItem('psw', pswRef.current.secondPsw);
      router.push('/unlock');
    }
  }
  return (
    <div className="relative h-screen bg-white">
      <Image width={26} height={26} className="absolute left-[18px] top-[10px] active:opacity-70" src="/imgs/lock/back.png" onClick={goBack} alt="" />
      <div className="absolute left-1/2 top-[150px] -translate-x-1/2 text-center text-[30px] leading-[44px] text-[#06121E]">请设置图案</div>
      <div className="absolute left-1/2 top-[214px] w-fit -translate-x-1/2 text-base leading-[22px] text-[#06121E]/[0.65]">{helpText}</div>
      <CanvasLock
        ref={canvasLockRef}
        callBack={onChange}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 80,
        }}
      />
      {type === 2 && (
        <div className="absolute bottom-10 left-[26px] right-[26px] flex items-center justify-between">
          <div className="h-[42px] w-[calc((100%-26px)/2)] rounded-[40px] bg-gradient-to-r from-mitBlue2 to-mitBlue text-center text-base leading-[42px] text-white" onClick={retry}>
            重绘
          </div>
          <div className={'w-[calc((100%-26px)/2)] rounded-[40px] text-center text-base leading-[42px] text-white ' + (pswRef.current.secondPsw === pswRef.current.firstPsw ? ' h-[42px] bg-gradient-to-r from-mitBlue2 to-mitBlue' : 'bg-[#e5e5e5] text-[#a6a6a6]')} onClick={goGusture}>
            确认
          </div>
        </div>
      )}
    </div>
  );
}
