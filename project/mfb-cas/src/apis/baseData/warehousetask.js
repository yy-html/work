import { MfbRequest } from '@mfb/pc-utils-micro'; 
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT })
import API_CONFIG from '../index'

/**
 *大仓作业
 */
export const taskList = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_TASK'].LIST,
      method: 'post',
      data,
     
    })
  }
  export const taskAdd = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_TASK'].ADD,
      method: 'post',
      data,
    
    })
  }
  export const taskUpdate = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_TASK'].UPDATE,
      method: 'post',
      data,
    
    })
  }
  export const taskDetail = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_TASK'].QUERYDETAIL,
      method: 'post',
      data,
    
    })
  }
  export const taskExport = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_TASK'].EXPORT,
      method: 'post',
      data,
      
    })
  }
  export const taskImport = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_TASK'].IMPORT,
      method: 'post',
      data,
   
    })
  }
  export const taskCommit = async (data) => {
    return request({
      url: API_CONFIG['BASE_DATA_TASK'].COMMIT,
      method: 'post',
      data,
     
    })
  }
 