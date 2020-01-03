import API_CONFIG from '../index'
import { MfbRequest } from '@mfb/pc-utils-micro'; 
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT }) 


/**
 * 列表
 */
const getList = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].LIST,
    method: 'POST',
    data
  })
}

/**
 * 禁用
 */
const forbid = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].FORBID,
    data
  })
}

/**
 * 起用
 */
const start = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].START,
    data
  })
}

/**
 * 详情
 */
const detail = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].DETAIL,
    data
  })
}

/**
 * 编辑保存
 */
const save = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].SAVE,
    method: 'POST',
    data
  })
}

/**
 * 新增保存
 */
const add = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].ADD,
    method: 'POST',
    data
  })
}

/**
 * 查看日志
 */
const lookUpLog = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].LOOK_UP_LOG,
    method: 'GET',
    data
  })
}

/**
 * 提交审核
 */
const submitAudit = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].SUBMIT_AUDIT,
    method: 'POST',
    data
  })
}

/**
 * 审核通过
 */
const auditPass = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].AUDIT_PASS,
    method: 'POST',
    data
  })
}

/**
 * 审核驳回
 */
const auditReject = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].AUDIT_REJECT,
    method: 'POST',
    data
  })
}

/**
 * 回退为待提交
 */
const returnBack = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].RETURN_BACK,
    method: 'POST',
    data
  })
}

/**
 * 收货城市
 */
const getShipCityList = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_NEXT_DAY_SETTING'].SHIP_CITY_LIST,
    method: 'POST',
    data
  })
}

export default {
  getList,
  forbid,
  start,
  detail,
  save,
  add,
  lookUpLog,
  submitAudit,
  getShipCityList,
  auditPass,
  returnBack,
  auditReject
}