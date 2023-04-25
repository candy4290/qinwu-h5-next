import apis from '@/utils/apis';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import { RootState } from './store';
import { userInfoSelector, tabsSelector, setTabs } from './userInfoSlice';

/* 获取最新的消息列表 + 获取未读消息数量 */

function formatDate3(date: string) {
    if (!date) return '';
    return (
        date.slice(5, 7) +
        '月' +
        date.slice(8, 10) +
        '日 ' +
        date.slice(11, 13) +
        ':' +
        date.slice(14, 16)
    );
}
type MsgInfo = {
    isLoading: boolean,
    unReadMsgNums: any,
    msgList: any[]
}
const initInfo: MsgInfo = {
    isLoading: false,
    unReadMsgNums: 0,
    msgList: []
}
export const getUnReadMsg = createAsyncThunk('unReadMsg', async (p, { getState, dispatch }) => {
    const appState = getState() as RootState;
    const userInfo = userInfoSelector(appState)
    const tabs = tabsSelector(appState);

    const rsp: any = await axios.get(apis.getMessages, {
        params: {
            personCode: userInfo?.perCode
        }
    });
    const notReadList = JSON.parse(localStorage.getItem('notReadMsgList') || '[]');
    notReadList.push(...(rsp || []));
    localStorage.setItem('notReadMsgList', JSON.stringify(notReadList));
    const notReadNum = notReadList.length || null;
    const r = notReadNum > 99 ? '99+' : notReadNum;
    if (tabs[tabs.length - 1].badge !== r) {
        const temp = _.cloneDeep(tabs);
        temp[temp.length - 1].badge = r;
        dispatch(setTabs(temp));
    }
    return r;
});
export const getMsgList = createAsyncThunk('msgList', async (p, { getState, dispatch }) => {
    const appState = getState() as RootState;
    const userInfo = userInfoSelector(appState)
    const rsp: any = await axios.get(apis.getMessages, {
        params: {
            personCode: userInfo?.perCode
        }
    });
    const tempMsgList = JSON.parse(localStorage.getItem('msgList') || '[]');
    const notReadMsgList = JSON.parse(localStorage.getItem('notReadMsgList') || '[]'); /* 未读消息列表 */
    localStorage.removeItem('notReadMsgList'); /* 清除未读消息列表缓存 */
    const temp = [...tempMsgList, ...notReadMsgList, ...(rsp || [])];
    temp.forEach((item: any) => {
        item.postStartTime = formatDate3(item.postStartTime);
        item.postEndTime = formatDate3(item.postEndTime);
        item.pushTime = formatDate3(item.pushTime);
    })
    if (temp.length > 30) {
        localStorage.setItem('msgList', JSON.stringify(temp.slice(temp.length - 30)))
        return temp.slice(temp.length - 30);
    } else {
        localStorage.setItem('msgList', JSON.stringify(temp))
        return temp;
    }
});
export const getUnReadMsgSlice = createSlice({
    name: 'unReadMsg',
    initialState: initInfo,
    extraReducers: builder => {
        builder
            .addCase(getUnReadMsg.pending, state => {
                state.isLoading = true;
            })
            .addCase(getUnReadMsg.fulfilled, (state, action) => {
                state.isLoading = false;
                state.unReadMsgNums = action.payload;
            })
            .addCase(getUnReadMsg.rejected, state => {
                state.isLoading = false;
            })
            .addCase(getMsgList.pending, state => {
                state.isLoading = true;
            })
            .addCase(getMsgList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.msgList = action.payload;
            })
            .addCase(getMsgList.rejected, state => {
                state.isLoading = false;
            });
    },
    reducers: {

    }
})
export const unReadMsgNumsSelector = (state: { msgInfo: MsgInfo }) => state.msgInfo.unReadMsgNums;
export const msgListSelector = (state: { msgInfo: MsgInfo }) => state.msgInfo.msgList;

export default getUnReadMsgSlice.reducer;