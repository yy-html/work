import { MfbRequest } from '@mfb/pc-utils-micro'; 
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT })
import API_CONFIG from '../index'

/**
 *干线筐分页查询
 */
export const groundlineBoxList = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_BOX'].LIST,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *干线筐详情
 */
export const groundlineBoxDetail = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_BOX'].DETAIL,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *干线筐新增
 */
export const groundlineBoxAdd = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_BOX'].ADD,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *干线筐删除
 */
export const groundlineBoxDelete = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_BOX'].DELETE,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *干线筐保存
 */
export const groundlineBoxSave = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_BOX'].SAVE,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *干线筐提交数据
 */
export const groundlineBoxSubmit = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_BOX'].SUBMIT,
    method: 'post',
    data,
    loading: true
  })
}
 