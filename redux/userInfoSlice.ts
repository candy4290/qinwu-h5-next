import { MenuItem } from './../utils/types/index';
import { PoliceInfoType } from '@/utils/types';
import apis from '@/utils/apis';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import { RootState } from './store';

type UserInfo = {
    tabs: MenuItem[],
    data: PoliceInfoType | null,
    isLoading: boolean,
}
const initInfo: UserInfo = {
    tabs: [],
    data: null,
    isLoading: false,
};
const { ScheduleImg, Schedule2Img, StatisticsImg, Statistics2Img, SubscribeImg, Subscribe2Img, MessageImg, Message2Img, PoliceImg, Police2Img } = {
    ScheduleImg: '/imgs/tabs/icon-排班-未选中@2x.png',
    Schedule2Img: '/imgs/tabs/icon-排班-选中@2x.png',
    StatisticsImg: '/imgs/tabs/icon-统计-未选中@2x.png',
    Statistics2Img: '/imgs/tabs/icon-统计-选中@2x.png',
    SubscribeImg: '/imgs/tabs/icon-订阅-未选中@2x.png',
    Subscribe2Img: '/imgs/tabs/icon-订阅-选中@2x.png',
    MessageImg: '/imgs/tabs/icon-消息-未选中@2x.png',
    Message2Img: '/imgs/tabs/icon-消息-选中@2x.png',
    PoliceImg: '/imgs/tabs/icon-警力分析-未选中@2x.png',
    Police2Img: '/imgs/tabs/icon-警力分析-选中@2x.png'
}

/* 获取用户信息及其订阅配置及菜单权限 */
export const getUserInfo = createAsyncThunk('userInfo/fetch', async (p, { getState, dispatch }) => {
    const appState = getState() as RootState;
    const curTabs = tabsSelector(appState);
    const idCard = localStorage.getItem('UserId');
    const response = await
        Promise.all([
            axios.get(apis.queryPersionDetail, {
                params: {
                    idCard
                }
            }),
            axios.get(apis.querySubscription, {
                params: {
                    idCard
                }
            }),
        ]).then((rsp: any) => {
            if (rsp[0].manageUnit) {
                const temp = axios.get(apis.getOrgInfo, {
                    params: {
                        orgCode: rsp[0].manageUnit
                    }
                }).then((rr: any) => {
                    return [...rsp, { manageUnitOrgAttr: rr[0]?.orgAttr, manageUnitOrgName: rr[0]?.orgName }]
                })
                return temp;
            }
            return rsp;
        });
    const info = { ...response[0], ...response[1], ...response[2] };
    const tabs = [
        {
            key: '/schedule',
            title: '排班',
            icon: ScheduleImg,
            icon2: Schedule2Img
        },
        {
            key: '/statistics',
            title: '统计',
            icon: StatisticsImg,
            icon2: Statistics2Img
        },
        {
            key: '/police',
            title: '警力',
            icon: PoliceImg,
            icon2: Police2Img
        },
        {
            key: '/subscribe',
            title: '订阅',
            icon: SubscribeImg,
            icon2: Subscribe2Img
        },
        {
            key: '/message',
            title: '消息',
            icon: MessageImg,
            icon2: Message2Img,
            badge: curTabs.length === 0 ? null : curTabs[curTabs.length - 1].badge
        },
    ];
    if (info.policeForceManage === 1) {
        dispatch(setTabs(tabs))
    } else {
        tabs.splice(2, 1);
        dispatch(setTabs(tabs))
    }
    return info;
});

export const getUserInfoSlice = createSlice({
    name: 'userInfo',
    initialState: initInfo,
    extraReducers: builder => {
        builder.addCase(getUserInfo.pending, state => {
            state.isLoading = true;
        })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                localStorage.setItem('userInfo', JSON.stringify(action.payload || '{}'))
            })
            .addCase(getUserInfo.rejected, state => {
                state.isLoading = false;
            });
    },
    reducers: {
        setTabs(state, { payload }: PayloadAction<MenuItem[]>) {
            state.tabs = payload
        },
        clearMessageTab(state) {
            const temp = _.cloneDeep(state.tabs);
            temp.forEach(i => {
                if (i.title === '消息') {
                    i.badge = null;
                }
            });
            state.tabs = temp;
        },
    }
});

export const userInfoSelector = (state: { userInfo: UserInfo }) => state.userInfo.data;
export const tabsSelector = (state: { userInfo: UserInfo }) => state.userInfo.tabs;
export const { setTabs, clearMessageTab } = getUserInfoSlice.actions;

export default getUserInfoSlice.reducer;