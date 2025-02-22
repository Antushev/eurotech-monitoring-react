import { NameSpace } from '../../const.js';

export const getCurrentUser = (state) => {
  return state[NameSpace.DATA].user;
}

export const getAllFirms = (state) => {
  return state[NameSpace.DATA].firms;
}

export const getProductWithDetailStats = (state) => {
  return state[NameSpace.DATA].productWithDetailStats;
}

export const getAllProducts = (state) => {
  return state[NameSpace.DATA].products;
}

export const getAllTriggers = (state) => {
  return state[NameSpace.DATA].triggers;
}

export const getTriggersForProduct = (state) => {
  return state[NameSpace.DATA].triggersForProduct;
}

export const getCurrentProduct = (state) => {
  return state[NameSpace.DATA].currentProduct;
}

export const getGroups = (state) => {
  return state[NameSpace.DATA].groups;
}

export const getAllMarks = (state) => {
  return state[NameSpace.DATA].marks;
}

export const getAllProjects = (state) => {
  return state[NameSpace.DATA].projects;
}

export const getStatusLoadFirms = (state) => {
  return state[NameSpace.DATA].hasLoadFirms;
}

export const getStatusLoadFirm = (state) => {
  return state[NameSpace.DATA].hasLoadFirm;
}

export const getStatusLoadProduct = (state) => {
  return state[NameSpace.DATA].hasLoadProduct;
}

export const getStatusLoadProducts = (state) => {
  return state[NameSpace.DATA].hasLoadProducts;
}

export const getStatusLoadLink = (state) => {
  return state[NameSpace.DATA].hasLoadLink;
}

export const getStatusLoadTriggers = (state) => {
  return state[NameSpace.DATA].hasLoadTriggers;
}

export const getStatusLoadTriggersForProduct = (state) => {
  return state[NameSpace.DATA].hasLoadTriggersForProduct;
}

export const getStatusLoadTrigger = (state) => {
  return state[NameSpace.DATA].hasLoadTrigger;
}

export const getStatusCreateNewProject = (state) => {
  return state[NameSpace.DATA].hasCreateNewProject;
}

export const getStatusLoadMarks = (state) => {
  return state[NameSpace.DATA].hasLoadMarks;
}

export const getParseData = (state) => {
  return state[NameSpace.DATA].parseData;
}

export const getStatusLoadParseData = (state) => {
  return state[NameSpace.DATA].hasLoadParseData;
}

export const getReports = (state) => {
  return state[NameSpace.DATA].reports;
}

export const getStatusDeleteAllData = (state) => {
  return state[NameSpace.DATA].hasDeleteAllData;
}

export const getPeriod = (state) => {
  return state[NameSpace.DATA].period;
}

export const getTypeShowValue = (state) => {
  return state[NameSpace.DATA].typeShowValue;
}

export const getTypeShowConditionValue = (state) => {
  return state[NameSpace.DATA].typeShowConditionValue;
}

export const getIsShowNotifications = (state) => {
  return state[NameSpace.DATA].isShowNotifications;
}

export const getCheckDataSyncUrlXMLForBitrix = (state) => {
  return state[NameSpace.DATA].checkDataSyncUrlXMLForBitrix;
}

export const getStatusCheckSyncUrlXMLForBitrix = (state) => {
  return state[NameSpace.DATA].hasCheckSyncUrlXMLForBitrix;
}

export const getSettingsSyncBitrix = (state) => {
  return state[NameSpace.DATA].settingsSyncBitrix;
}

export const getStatusLoadSettingsSyncBitrix = (state) => {
  return state[NameSpace.DATA].hasLoadSettingsSyncBitrix;
}

export const getReportsIntegrations = (state) => {
  return state[NameSpace.DATA].reportsIntegrations;
}

export const getStatusLoadReportsIntegrations = (state) => {
  return state[NameSpace.DATA].hasLoadReportsIntegrations;
}

export const getStatusSyncBitrixProducts = (state) => {
  return state[NameSpace.DATA].hasSyncBitrixProducts;
}
