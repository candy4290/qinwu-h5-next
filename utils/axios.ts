import axios from 'axios';
import qs from 'qs';
import { Toast } from 'antd-mobile';

// (window as any).axiosCancel = [];

/* 设置超时时间 */
axios.defaults.timeout = 60000;

/* 请求前置处理器 */
axios.interceptors.request.use(
  function (config) {
    if (config.method === 'get') {
      config.paramsSerializer = {
        serialize: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      };
    }
    if (!config.url?.endsWith('----')) {
      /* 满足xxx不需要取消请求 */
      //   config.cancelToken = new axios.CancelToken(cancel => {
      //     (window as any).axiosCancel.push({ cancel });
      //   });
    }
    const token = localStorage.getItem('Authorization');
    if (token && config.headers) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/* 请求后置处理器 */
axios.interceptors.response.use(
  function (response) {
    const url = response.config.url;
    if (url?.endsWith('.json')) {
      /* 请求本地静态json文件 */
      return response.data;
    }
    if (response.config.responseType === 'blob') {
      return response;
    }
    if (url?.includes('/shijuqinwu-h5') || url?.includes('/qinyingyong')) {
      const whiteList = ['/prod-api/login']; /* 接口url白名单---用来处理返回体不统一的情况 */
      const urlInWhiteList = whiteList.findIndex(item => {
        return url?.startsWith(item);
      });
      if (urlInWhiteList > -1) {
        if (response.data.code + '' === '401') {
          Toast.show({
            icon: 'fail',
            content: response.data.msg,
          });
          return Promise.reject(response.data.msg);
        }
        return response.data;
      }
      if (response.data.code) {
        if (response.data.code + '' === '200') {
          return response.data.data;
        } else {
          Toast.show({
            icon: 'fail',
            content: response.data.msg || '未知异常',
          });
          return Promise.reject(response.data.msg);
        }
      }
      Toast.show({
        icon: 'fail',
        content: `接口${url},返回体不标准!`,
      });
      return Promise.reject(`接口${url},返回体不标准!`);
    } else {
      return response;
    }
  },
  function (error) {
    const url = error.response?.config?.url;
    const status = error.response?.status; /* 状态码 */
    switch (status) {
      case 400:
        Toast.show({
          icon: 'fail',
          content: `错误的请求。由于语法错误，该请求无法完成！`,
        });
        return Promise.reject(error);
      case 401 /* token失效 */:
        Toast.show({
          icon: 'fail',
          content: `用户登录失效，请重新登录！`,
        });
        localStorage.setItem('preUrl', window.location.pathname + window.location.search);
        return Promise.reject(error);
      case 404:
        Toast.show({
          icon: 'fail',
          content: `接口${url}不存在！`,
        });
        return Promise.reject(error);
      case 500:
        Toast.show({
          icon: 'fail',
          content: `服务端500异常！`,
        });
        return Promise.reject(error);
      case 504:
        Toast.show({
          icon: 'fail',
          content: `网关超时！`,
        });
        return Promise.reject(error);
      default:
        if ((error.message || '').startsWith('timeout of')) {
          return Promise.reject('请求超时!!!');
        }
        return Promise.reject(error);
    }
  }
);
export default axios;
