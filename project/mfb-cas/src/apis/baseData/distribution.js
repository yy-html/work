import { MfbRequest } from '@mfb/pc-utils-micro'; 
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT })
import API_CONFIG from '../index'

/**
 *次日达配送分页查询
 */
export const distributionList = async (data) => {
  return request({
    url: API_CONFIG['BASE_DATA_DISTRIBUTION'].LIST,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *次日达配送详情
 */
export const distributionDetail = async (data) => {
  return request({
    url: API_CONFIG['BASE_DATA_DISTRIBUTION'].DETAIL + `?id=${data}`,
    method: 'get',
    loading: true
  })
}

/**
 *次日达配送新增
 */
export const distributionAdd = async (data) => {
  return request({
    url: API_CONFIG['BASE_DATA_DISTRIBUTION'].ADD,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *次日达配送删除
 */
export const distributionDelete = async (data) => {
  return request({
    url: API_CONFIG['BASE_DATA_DISTRIBUTION'].DELETE,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *次日达配送保存
 */
export const distributionSave = async (data) => {
  return request({
    url: API_CONFIG['BASE_DATA_DISTRIBUTION'].SAVE,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *次日达配送提交数据
 */
export const distributionSubmit = async (data) => {
  return request({
    url: API_CONFIG['BASE_DATA_DISTRIBUTION'].SUBMIT,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *次日达配送选择城市
 */
export const distributionCitylist = async (data) => {
  return request({
    url: API_CONFIG['BASE_DATA_DISTRIBUTION'].CITYLIST,
    method: 'post',
    data,
    loading: true
  })
}

 