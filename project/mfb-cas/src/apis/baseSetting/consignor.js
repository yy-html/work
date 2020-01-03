import API_CONFIG from '../index'
import { MfbRequest } from '@mfb/pc-utils-micro'; 
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT }) 

/**
 * 列表
 */
const getList = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_CONSIGNOR_MANAGEMENT'].LIST,
    method: 'POST',
    data
  })
}

/**
 * 禁用
 */
const updateStatus = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_CONSIGNOR_MANAGEMENT'].UPDATE_STATUS,
    method: 'POST',
    data
  })
}


/**
 * 详情
 */
const detail = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_CONSIGNOR_MANAGEMENT'].DETAIL,
    method: 'POST',
    data
  })
}

/**
 * 编辑保存
 */
const save = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_CONSIGNOR_MANAGEMENT'].SAVE,
    method: 'POST',
    data
  })
}

/**
 * 根据名称模糊查询货主列表
 */
const getConsignorByName = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_CONSIGNOR_MANAGEMENT'].LIST_BY_CONSIGNOR,
    method: 'POST',
    data
  })
}

/**
 * 新增保存
 */
const add = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_CONSIGNOR_MANAGEMENT'].ADD,
    method: 'POST',
    data
  })
}

/**
 * 获取状态列表
 */
const getStatusList = async () => {
  return request({
    url: API_CONFIG['COMMON'].ENUM_LIST,
    method: 'POST',
    data: {enumType: '1'}
  })
}

/**
 * 查看日志
 */
const lookUpLog = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_CONSIGNOR_MANAGEMENT'].LOOK_UP_LOG,
    method: 'POST',
    data
  })
}

export default {
  getStatusList,
  getList,
  updateStatus,
  detail,
  save,
  add,
  getConsignorByName,
  lookUpLog
}