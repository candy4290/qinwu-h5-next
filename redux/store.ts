import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userInfo from './userInfoSlice';
import msgInfo from './messageInfoSlice';
import scheduleInfo from './scheduleSlice';
import subscribeInfo from './subscribeSlice';
import statisticsInfo from './statisticsSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      userInfo,
      msgInfo,
      scheduleInfo,
      subscribeInfo,
      statisticsInfo,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
