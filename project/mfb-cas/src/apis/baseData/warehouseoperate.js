import { MfbRequest } from '@mfb/pc-utils-micro'; 
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT })
import API_CONFIG from '../index'

/**
 *大仓仓租
 */
export const operateList = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_OPERATE'].LIST,
      method: 'post',
      data,
     
    })
  }
  export const operateAdd = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_OPERATE'].ADD,
      method: 'post',
      data,
    
    })
  }
  export const operateUpdate = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_OPERATE'].UPDATE,
      method: 'post',
      data,
      
    })
  }
  export const operateDetail = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_OPERATE'].QUERYDETAIL,
      method: 'post',
      data,
     
    })
  }
  export const operateImport = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_OPERATE'].IMPORT,
      method: 'post',
      data,
     
    })
  }
  export const operateUpload = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_OPERATE'].UPLOAD,
      method: 'post',
      data,
      
    })
  }
  export const operateExport = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_OPERATE'].EXPORT,
      method: 'post',
      data,
     
    })
  }
 