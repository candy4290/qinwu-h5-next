import apis from "@/utils/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";
import { RootState } from "./store";
import { userInfoSelector } from "./userInfoSlice";

/* 获取year-month第一天和最后一天 */
export function getDateRange(year: number, month: number) {
    const date1 = new Date(year, month, 1);
    const date2 = new Date(year, month + 1, 0);
    return {
      start: year + '-' + `${month}`.padStart(2, '0') + '-' + `${date1.getDate()}`.padStart(2, '0'),
      end: year + '-' + `${month}`.padStart(2, '0') + '-' + `${date2.getDate()}`.padStart(2, '0'),
    }
  }
  
  /* 获取当前月第一天，及当前天的前一天日期 */
  export function getCurrentMonth(year: number, month: number) {
    const date1 = new Date(year, month, 1);
    return {
      start: year + '-' + `${month}`.padStart(2, '0') + '-' + `${date1.getDate()}`.padStart(2, '0'),
      end: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    }
  }

const initState = {
    isLoading: false,
    month: [{
        attendanceDays: 0,
        attendanceRate: 0,
        avgDutyDays: 0,
        dutyDays: 0,
        orgCodeAttendanceRate: 0,
        orgCodeAvgAttendanceDays: 0,
        orgCodeAvgSchedulingDays: 0,
        orgCodeAvgWorkTime: 0,
        schedulingDays: 0,
        sumWorkTime: 0
    }, {
        attendanceDays: 0,
        attendanceRate: 0,
        avgDutyDays: 0,
        dutyDays: 0,
        orgCodeAttendanceRate: 0,
        orgCodeAvgAttendanceDays: 0,
        orgCodeAvgSchedulingDays: 0,
        orgCodeAvgWorkTime: 0,
        schedulingDays: 0,
        sumWorkTime: 0
    }],
    post: []
}

/* 统计-月统计数据 */
export const getStaticsMonthInfo = createAsyncThunk('statisticsMonthInfo/fetch', async(p, {getState, dispatch}) => {
    const appState = getState() as RootState;
    const userInfo = userInfoSelector(appState);
    const preDate = getDateRange( /* 上个月 */
            new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
            new Date().getMonth() === 0 ? 12 : new Date().getMonth());
        const date = getCurrentMonth(new Date().getFullYear(), new Date().getMonth() + 1); /* 本月 */
        const rsp = await Promise.all([
            new Date(date.end).getTime() < new Date(date.start).getTime() ? /* 如果是本月第一天，本月全部数据为0，不调用接口 */
                new Promise(r => r({
                    attendanceDays: 0,
                    attendanceRate: 0,
                    avgDutyDays: 0,
                    dutyDays: 0,
                    orgCodeAttendanceRate: 0,
                    orgCodeAvgAttendanceDays: 0,
                    orgCodeAvgSchedulingDays: 0,
                    orgCodeAvgWorkTime: 0,
                    schedulingDays: 0,
                    sumWorkTime: 0
                }))
            :
            axios.get(apis.queryMonthData, { /* 本月 */
                params: {
                    personCode: userInfo?.perCode,
                    startDate: date.start,
                    endDate: date.end
                },
            }),
            axios.get(apis.queryMonthData, { /* 上月 */
                params: {
                    personCode: userInfo?.perCode,
                    startDate: preDate.start,
                    endDate: preDate.end
                },
            }),
        ])
        rsp.forEach((i: any) => {
            Object.keys(i).forEach(k => {
                if ((i[k] + '').includes('.') && k !== 'attendanceRate' && k !== 'orgCodeAttendanceRate') {
                    i[k] = (i[k] || 0).toFixed(0)
                }
            })
        });
        return rsp;
})

export const getStaticsPostInfo = createAsyncThunk('statisticsPostInfo/fetch', async(p, {getState, dispatch}) => {
    const appState = getState() as RootState;
    const userInfo = userInfoSelector(appState);
    const preDate = getDateRange( /* 上个月 */
            new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
            new Date().getMonth() === 0 ? 12 : new Date().getMonth());
        const date = getCurrentMonth(new Date().getFullYear(), new Date().getMonth() + 1); /* 本月 */
        const rsp: any = await Promise.all([
            new Date(date.end).getTime() < new Date(date.start).getTime() ? /* 如果是本月第一天，本月全部数据为0，不调用接口 */
                new Promise(r => r({
                    sumALLWorkTime: 0,
                    sumWorkTime: 0,
                    personPostSumWorkTimeVOS: []
                }))
            :
            axios.get(apis.queryPostDate, {
                params: {
                    personCode: userInfo?.perCode,
                    startDate: date.start,
                    endDate: date.end
                },
            }),
            axios.get(apis.queryPostDate, {
                params: {
                    personCode: userInfo?.perCode,
                    startDate: preDate.start,
                    endDate: preDate.end
                },
            }),
        ]);
        (rsp || []).forEach((i: any) => { /* 如果是本月第一天，本月全部数据为0，不调用接口 */
            i.max = 0;
            if ((i.sumALLWorkTime + '').includes('.')) {
                i.sumALLWorkTime = (i.sumALLWorkTime || 0).toFixed(2)
            }
            if ((i.sumWorkTime + '').includes('.')) {
                i.sumWorkTime = (i.sumWorkTime || 0).toFixed(2)
            }
            (i.personPostSumWorkTimeVOS || []).forEach((j: any) => {
                if ((j.workTime + '').includes('.')) {
                    j.workTime = (j.workTime || 0).toFixed(2)
                }
                i[j.postTypeId] = j.workTime || 0
                i.max = i[j.postTypeId] > i.max ? i[j.postTypeId] : i.max;
            })
        });
        if (rsp[0]?.max > rsp[1]?.max) {
            rsp[1].max = rsp[0].max
        } else {
            rsp[0].max = rsp[1].max
        }
        return rsp;
})

export const getStatisticsInfoSlice = createSlice({
    name: 'statisticsInfo',
    initialState: initState,
    extraReducers: builder => {
        builder
            .addCase(getStaticsMonthInfo.pending, state => {
                state.isLoading = true;
            })
            .addCase(getStaticsMonthInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.month = action.payload as any;
            })
            .addCase(getStaticsMonthInfo.rejected, state => {
                state.isLoading = false;
            })
            .addCase(getStaticsPostInfo.pending, state => {
                state.isLoading = true;
            })
            .addCase(getStaticsPostInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.post = action.payload as any;
            })
            .addCase(getStaticsPostInfo.rejected, state => {
                state.isLoading = false;
            });
    },
    reducers: {

    }
})

export const statisticsMonthSelector = (state: { statisticsInfo: any }) => state.statisticsInfo.month;
export const statisticsPostSelector = (state: { statisticsInfo: any }) => state.statisticsInfo.post;

export default getStatisticsInfoSlice.reducer;