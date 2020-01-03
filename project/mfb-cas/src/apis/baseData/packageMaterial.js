import {
  MfbRequest
} from '@mfb/pc-utils-micro';
const {
  request
} = MfbRequest({
  // baseUrl: 'http://172.16.176.149:8080/'
  baseUrl: process.env.VUE_APP_API_ROOT 
})
import API_CONFIG from '../index'

/**
 *  分页查询接口
 */
export const getList = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_PACKAGEMATERIAL'].list,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  编辑、详情查询
 */
export const getDetail = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_PACKAGEMATERIAL'].detail,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  新增、修改接口
 */
export const edit = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_PACKAGEMATERIAL'].edit,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  删除、提交数据接口
 */
export const changeStatus = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_PACKAGEMATERIAL'].changeStatus,
    method: 'post',
    data,
    loading: true
  })
}

