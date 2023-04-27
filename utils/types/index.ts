export interface LockType {
  pwd: number[] /* 九宫格密码 */;
  pwdIdcard: string /* 九宫格密码对应的身份证号 */;
}

export interface PoliceInfoType {
  perName: string /* 警员姓名 */;
  perCode: string /* 警号 */;
  perDepartId: string /* 所属机构编号 */;
  orgName: string /* 所属机构名称 */;
  secondmentOrg: string /* 借调组织编号 */;
  secondmentOrgName: string /* 借调组织名称 */;
  policeType: number /* 警员类型 */;
  idcard: string /* 身份证号 */;
  ifSecondment: string /* 0-借调 1-不借调 */;
  policeForceManage: 0 | 1 /* 0-关闭 1-打开 */;
  manageUnit: string /* 管理单位：警力页面看到的内容，以此为准 */;
  manageUnitOrgName: string /* 管理单位名称 */;
  manageUnitOrgAttr: 0 | 1 | 2 | 3 | 4 | 5 /* 机构属性;  机关属性,0-市局,1-分局,2-机关,3-业务,4-派出所,5-合作单位 */;
}

export interface MenuItem {
  key: string;
  title: string;
  icon: string;
  icon2: string;
  badge?: any;
}

export interface CurrentOrgInterface {
  orgName: string;
  orgCode: string;
  orgAttr: PoliceInfoType['manageUnitOrgAttr'];
  isZongLan?: boolean /* 下属单位总览页 */;
}
