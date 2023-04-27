import apis from '@/utils/apis';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { getUserInfo, userInfoSelector } from '@/redux/userInfoSlice';

type SubscribeInfo = {
  list: { key: string; name: string; checked: boolean; loading: boolean }[];
  isLoading: boolean;
};
const initInfo: SubscribeInfo = {
  list: [
    {
      key: 'notPunchMessage',
      name: '未打卡提醒',
      loading: true,
      checked: true,
    },
    {
      key: 'schedulingMessage',
      name: '派勤提醒',
      loading: true,
      checked: true,
    },
    {
      key: 'attendanceMessage',
      name: '出勤提醒',
      loading: true,
      checked: true,
    },
    {
      key: 'clockOutMessage',
      name: '下班关闭打卡提醒',
      loading: true,
      checked: true,
    },
    {
      key: 'schedulingReminderMessage',
      name: '排班提醒',
      loading: true,
      checked: true,
    },
    {
      key: 'taskSignInMessage',
      name: '任务签收提醒',
      loading: true,
      checked: true,
    },
    {
      key: 'taskSchedulingMessage',
      name: '任务排班提醒',
      loading: true,
      checked: true,
    },
    {
      key: 'policeForceManage',
      name: '警力安排',
      loading: true,
      checked: true,
    },
  ],
  isLoading: false,
};

/* 获取订阅情况 */
export const getSubscribeInfo = createAsyncThunk('subscribeInfo/fetch', async (p, { getState, dispatch }) => {
  const appState = getState() as RootState;
  const userInfo = userInfoSelector(appState);
  const rsp: any = await axios.get(apis.querySubscription, {
    params: {
      idCard: userInfo?.idcard,
    },
  });
  const temp = [rsp.notPunchMessage === 1, rsp.schedulingMessage === 1, rsp.attendanceMessage === 1, rsp.clockOutMessage === 1, rsp.schedulingReminderMessage === 1, rsp.taskSignInMessage === 1, rsp.taskSchedulingMessage === 1, rsp.policeForceManage === 1];
  return initInfo.list
    .map((i, idx) => ({
      ...i,
      checked: temp[idx],
      loading: false,
    }))
    .slice(0, userInfo?.policeType === 1 ? 4 : 8);
});

/* 更新订阅情况 */
export const updateSubscribe = createAsyncThunk('updateSubscribe', async (p: number, { getState, rejectWithValue, dispatch }) => {
  const appState = getState() as RootState;
  const userInfo = userInfoSelector(appState);
  const subscribeInfo = subScribeInfoSelector(appState);
  const tt: { [key: string]: number } = {};
  dispatch(switchSubscribeStatus(p));
  subscribeInfo.forEach((i, index) => {
    if (p === index) {
      tt[i.key] = 1 - +i.checked;
    } else {
      tt[i.key] = +i.checked;
    }
  });
  try {
    await axios.get(apis.updateSubscription, {
      params: {
        perCode: userInfo?.perCode,
        idCard: userInfo?.idcard,
        ...tt,
      },
    });
  } catch (error) {
    throw rejectWithValue(p);
  }
  if (p === 7) {
    /* 警力安排变更时，重新查询用户信息 */
    dispatch(getUserInfo());
  }
  return p;
});

export const getSubscribeInfoSlice = createSlice({
  name: 'subscribeInfo',
  initialState: initInfo,
  extraReducers: builder => {
    builder
      .addCase(getSubscribeInfo.pending, state => {
        state.isLoading = true;
      })
      .addCase(getSubscribeInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getSubscribeInfo.rejected, state => {
        state.isLoading = false;
      })
      .addCase(updateSubscribe.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateSubscribe.fulfilled, state => {
        state.isLoading = false;
        state.list = state.list.map(i => ({
          ...i,
          loading: false,
        }));
      })
      .addCase(updateSubscribe.rejected, (state, action) => {
        state.isLoading = false;
        state.list = state.list.map((i, idx) => ({
          ...i,
          loading: false,
          checked: idx === action.payload ? !i.checked : i.checked,
        }));
      });
  },
  reducers: {
    switchSubscribeStatus(state, { payload }: PayloadAction<number>) {
      state.list = state.list.map((i, idx) => ({
        ...i,
        loading: true,
        checked: idx === payload ? !i.checked : i.checked,
      }));
    },
  },
});

export const subScribeInfoSelector = (state: { subscribeInfo: SubscribeInfo }) => state.subscribeInfo.list;
export const { switchSubscribeStatus } = getSubscribeInfoSlice.actions;

export default getSubscribeInfoSlice.reducer;
