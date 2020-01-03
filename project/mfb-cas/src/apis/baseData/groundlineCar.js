import { MfbRequest } from '@mfb/pc-utils-micro'; 
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT })
import API_CONFIG from '../index'

/**
 *干线车分页查询
 */
export const groundlineCarList = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_CAR'].LIST,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *干线车详情
 */
export const groundlineCarDetail = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_CAR'].DETAIL,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *干线车新增
 */
export const groundlineCarAdd = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_CAR'].ADD,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *干线车删除
 */
export const groundlineCarDelete = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_CAR'].DELETE,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *干线车保存
 */
export const groundlineCarSave = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_CAR'].SAVE,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *干线车提交数据
 */
export const groundlineCarSubmit = async (data) => {
  return request({
    url: API_CONFIG['GROUND_LINE_CAR'].SUBMIT,
    method: 'post',
    data,
    loading: true
  })
}
 