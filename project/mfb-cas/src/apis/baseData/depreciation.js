import {
  MfbRequest
} from '@mfb/pc-utils-micro';
const {
  request
} = MfbRequest({
  baseUrl: process.env.VUE_APP_API_ROOT
})
import API_CONFIG from '../index'

/**
 *  查询折旧费用列表
 */
export const getList = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_DEPRECIATION'].list,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  新增折旧、修改折旧
 */
export const edit = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_DEPRECIATION'].edit,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  批量删除折旧记录
 */
export const del = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_DEPRECIATION'].del,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  批量提交折旧费用
 */
export const submit = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_DEPRECIATION'].submit,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  导入折旧费用文件
 */
export const importFile = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_DEPRECIATION'].import,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  导出折旧费用列表
 */
export const exportFile = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_DEPRECIATION'].export,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  查看折旧费用详情
 */
export const getDetail = async (data) => {
  return request({
    url: API_CONFIG['BASE_SETTING_DEPRECIATION'].detail,
    method: 'post',
    data,
    loading: true
  })
}
