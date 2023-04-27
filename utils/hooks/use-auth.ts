import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import axios from 'axios';
import apis from '@/utils/apis';

/* 授权+获取用户信息 */
export function useAuth() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setCode = useCallback(
    (url?: string) => {
      const configCode = {
        base: false,
        appid: process.env.NEXT_PUBLIC_APPID /* 单位的CorpId */,
        agentid: process.env.NEXT_PUBLIC_AGENTID /* 单位应用的id */,
        redirect_uri: url || `${process.env.NEXT_PUBLIC_REDIRECT_URL}` /* 该地址的域名必须与该应用的可信域名一致 */,
      };
      const code = searchParams.get('code');
      if (code) {
        localStorage.setItem('code', code);
      } else {
        if (process.env.NEXT_PUBLIC_PROD === 'false') {
          const temp = (url || `${process.env.NEXT_PUBLIC_REDIRECT_URL}`).slice(process.env.NEXT_PUBLIC_REDIRECT_URL?.length);
          console.log('模拟授权登录成功，跳转回：' + '/' + temp);
          router.push('/' + temp);
        } else {
          const scope = configCode.base ? 'snsapi_privateinfo' : 'snsapi_userinfo'; // snsapi_base snsapi_userinfo snsapi_privateinfo
          location.href =
            'https://jwwx.gaj.sh.gov.cn/connect/oauth2/authorize?appid=' + configCode.appid + '&redirect_uri=' + encodeURIComponent(configCode.redirect_uri) + '&response_type=code&scope=' + scope + '&agentid=' + configCode.agentid + '&state=' + (configCode.base ? 3 : 2) + '#wechat_redirect';
        }
      }
    },
    [searchParams, router]
  );
  const initUserInfo = useCallback((callback?: any) => {
    if (process.env.NEXT_PUBLIC_PROD === 'false') {
      console.log('模拟获取token&&用户userID成功');
      callback && callback();
    } else {
      // 反向代理的地址
      // '/wechatApi'反向代理到'https://jwwx.gaj.sh.gov.cn'
      const proxy_url = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/wechatApi`;

      // 获取access_token，然后初始化
      // const getTokenParams = {
      //   corpid: process.env.NEXT_PUBLIC_APPID,
      //   corpsecret: process.env.NEXT_PUBLIC_CORPSECRET,
      // };
      axios.get(apis.getToken).then((res1: any) => {
        localStorage.setItem('accessToken', res1);
        const code = localStorage.getItem('code');
        axios
          .get(`${proxy_url}/cgi-bin/user/getuserinfo`, {
            params: {
              access_token: res1,
              code,
            },
          })
          .then(res2 => {
            if (res2.data && res2.data.errcode === 0 && res2.data.errmsg === 'ok') {
              if (localStorage.getItem('UserId') !== res2.data.UserId) {
                /* 切换了用户 */
                localStorage.removeItem('msgList');
                localStorage.removeItem('notReadMsgList');
              }
              localStorage.setItem('UserId', res2.data.UserId); /* 用户id,实际就是身份证号 */
              localStorage.setItem('user_ticket', res2.data.user_ticket); /* 成员票据 */
              callback && callback();
            }
          });
      });
    }
  }, []);
  return {
    setCode,
    initUserInfo,
  };
}
