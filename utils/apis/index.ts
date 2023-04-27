const apis = {
  getToken: '/qinyingyong/weChat/getToken' /* 获取政务微信token */,
  queryPersionDetail: '/shijuqinwu-h5/schedual/h5/personDetail' /* 通过警号或身份证号查询警员详情 */,

  queryScheduleRange: '/shijuqinwu-h5/schedual/h5/querySchedulingDetail' /* 根据身份证查询警员一段时间范围内的排班明细 */,

  queryMonthData: '/shijuqinwu-h5/schedual/h5/getMonthStatistics' /* 月统计数据 */,
  queryPostDate: '/shijuqinwu-h5/schedual/police_assessment/manHourAnalysisDayRound' /* 按岗位统计 */,

  querySubscription: '/shijuqinwu-h5/schedual/MessageManagement/queryMessageSubscriptionManagement' /* 根据警号或身份证号查询订阅详情 */,
  updateSubscription: '/shijuqinwu-h5/schedual/MessageManagement/insertOrUpdateSubscriptionManagement' /* 修改订阅 */,

  getMessages: '/shijuqinwu-h5/schedual/MessageManagement/messageReminder' /* 消息提醒 */,

  /* 警力页面 */
  getDutyLevel: '/shijuqinwu-h5/schedual/duty_level/info' /* 获取等级勤务 */,
  getDownOrgsInfo: '/shijuqinwu-h5/schedual/homePage/queryOrgCodesScheelDetail' /* 获取下级单位警力信息 */,
  getSjTopData: '/shijuqinwu-h5/schedual/homePage/queryScheelDetail' /* 警力-市局页 统计数据 */,
  getOrgInfo: '/shijuqinwu-h5/schedual/agency/org_info_list' /* 获取机构详细信息 */,
  getDutyLeaders: '/shijuqinwu-h5/schedual/duty_leader/list_leader' /* 获取值班领导 */,
  getTjData: '/shijuqinwu-h5/schedual/homePage/queryOrgScheel' /* 获取档期排班、当期排班、当前打卡 */,
  getDataByPost: '/shijuqinwu-h5/schedual/homePage/queryOrgFirtScheel' /* 一级岗位总览 */,
  getAllPersonNumsOfOrg: '/shijuqinwu-h5/schedual/daily_inspection/analysisOfShiftScheduling' /* 获取机构总人数 */,
  getDownOrgList: '/shijuqinwu-h5/schedual/agency/info_list' /* 下属机构列表 */,
};
export default apis;
