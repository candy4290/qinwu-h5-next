import apis from '@/utils/apis';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { userInfoSelector } from './userInfoSlice';

/* 获取最新的消息列表 */

const initInfo = {
    errMsg: null,
    isLoading: false,
    unReadMsgNums: 0,
}
export const getUnReadMsg = createAsyncThunk(apis.getMessages, async (p, {getState, dispatch}) => {
    const appState = getState() as RootState;
    const userInfo = userInfoSelector(appState)
    const rsp: any = await axios.get(apis.getMessages, {
        params: {
            personCode: userInfo?.perCode
        }
    });
    const notReadList = JSON.parse(localStorage.getItem('notReadMsgList') || '[]');
    notReadList.push(...(rsp || []))
    localStorage.setItem('notReadMsgList', JSON.stringify(notReadList));
    const notReadNum = notReadList.length || null;
    return notReadNum > 99 ? '99+' : notReadNum;
});
export const getUnReadMsgSlice = createSlice({
    name: 'unReadMsg',
    initialState: initInfo,
    extraReducers: builder => {
        builder.addCase(getUnReadMsg.pending, state => {
            state.isLoading = true;
        })
        .addCase(getUnReadMsg.fulfilled, (state, action) => {
            state.isLoading = false;
            state.unReadMsgNums = action.payload;
        })
        .addCase(getUnReadMsg.rejected, state => {
            state.isLoading = false;
        });
    },
    reducers: {

    }
})
export const unReadMsgNumsSelector = (state: { messageInfo: { unReadMsgNums: any; }; }) => state.messageInfo.unReadMsgNums;

export default getUnReadMsgSlice.reducer;