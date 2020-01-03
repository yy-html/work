import { MfbRequest } from '@mfb/pc-utils-micro'; 
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT })
import API_CONFIG from '../index'

/**
 *大仓仓租
 */
export const rentList = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_RENT'].LIST,
      method: 'post',
      data,
     
    })
  }
  export const rentAdd = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_RENT'].ADD,
      method: 'post',
      data,
      
    })
  }
  export const rentUpdate = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_RENT'].UPDATE,
      method: 'post',
      data,
     
    })
  }
  export const rentDetail = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_RENT'].QUERYDETAIL,
      method: 'post',
      data,
    
    })
  }
  export const rentImport = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_RENT'].IMPORT,
      method: 'post',
      data,
     
    })
  }
  export const rentUpload = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_RENT'].UPLOAD,
      method: 'post',
      data,
     
    })
  }
  export const rentExport = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_RENT'].EXPORT,
      method: 'post',
      data,
     
    })
  }
 