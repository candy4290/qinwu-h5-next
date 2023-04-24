import apis from '@/utils/apis';
import { userInfoSelector } from '@/redux/userInfoSlice';
import { RootState } from './store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';

/* 获取一个时间段内的排班信息 */

type ScheduleInfo = {
    data: {
        [key: string]: any
    } | null,
    isLoading: boolean,
}
const initData: ScheduleInfo = {
    isLoading: false,
    data: null
}
export const getScheduleInfo = createAsyncThunk('shceduleInfo/fetch', async (p, {getState}) => {
    const appState = getState() as RootState;
    const userInfo = userInfoSelector(appState);
    const rsp: any = await axios.get(apis.queryScheduleRange, {
        params: {
            idCard: userInfo?.idcard,
            startDutyDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
            endDutyDate: moment().subtract(-6, 'days').format('YYYY-MM-DD'),
        }
    });
    const temp: ScheduleInfo['data'] = {};
    (rsp || []).forEach((item: any) => {
        const date = moment(item.dutyDate).format('YYYY-MM-DD');
        temp[date] = item;
    });
    return temp;
})

export const getScheduleInfoSlice = createSlice({
    name: 'scheduleInfo',
    initialState: initData,
    extraReducers: builder => {
        builder.addCase(getScheduleInfo.pending, state => {
            state.isLoading = true;
        })
        .addCase(getScheduleInfo.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        })
        .addCase(getScheduleInfo.rejected, state => {
            state.isLoading = false;
        });
    },
    reducers: {

    }
})

export const scheduleInfoSelector = (state: { scheduleInfo: ScheduleInfo }) => state.scheduleInfo.data;

export default getScheduleInfoSlice.reducer;