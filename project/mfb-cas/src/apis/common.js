import API_CONFIG from './index'
import { MfbRequest } from '@mfb/pc-utils-micro'; 
import moment from 'moment'
import iView from 'iview'
let _this = iView
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT }) 
// const { request } = MfbRequest({ }) 


/**
 * 根据账号权限获取大区/大仓等列表
 */
const getSelectorList = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].SELECTOR_LIST,
    method: 'POST',
    data
  })
}

/**
 * 根据识别号 获取纳税人信息
 */
const getTaxpayerByNo = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].QUERY_TAXPAYER_BY_NO,
    method: 'POST',
    data
  })
}

/**
 * 根据名称获取承运方信息
 */
const getCarrierByName = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].QUERY_CARRIER_BY_NAME,
    method: 'POST',
    data
  })
}

/**
 * 获取收货城市列表
 */
const getShipCityList = async (data={}) => {
  return request({
    url: API_CONFIG['COMMON'].QUERY_SHIP_CITY_LIST,
    method: 'POST',
    data
  })
}

/**
 * 通用枚举列表
 */
const getEnumList = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].ENUM_LIST,
    method: 'POST',
    data
  })
}

/**
 * 上传
 */
export const uploadFile = async (url, data) => {
  return request({
    url: url,
    method: 'post',
    data,
    responseType: 'blob',
    timeout: 60000 * 10,
    loading: true
  })
}

/**
 * 根据原料编号查询
 */
export const materialQuery = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].materialQuery,
    method: 'post',
    data,
  })
}

/**
 * 根据原料编号查询加权平均价
 */
export const selectPackMaterial = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].selectPackMaterial,
    method: 'post',
    data,
  })
}
/**
 * 获取城市列表
 */
export const listCity = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].LISTCITY,
    method: 'post',
    data,
  })
}
/**
 * 纳税人识别号查询公司信息接口
 */
export const listSupplierInfo = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].listSupplierInfo,
    method: 'post',
    data,
  })
}

/**
 * 供应商,纳税人识别号模糊查询
 */
export const listLikeSupplierInfo = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].listLikeSupplierInfo,
    method: 'post',
    data,
  })
}
/**
 * 干线程远方查询模糊
 */
export const carrierQuery = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].carrierQuery,
    method: 'post',
    data,
  })
}

/**
 * 导出Excel流文件
 * @param {*} data //查询条件
 * url 请求链接
 */

const exportList = async (url, data) => {
  return request({
    url: url,
    method: "POST",
    data,
    responseType: 'blob',
    timeout: 60*1000,
  })
}

function ExcelTip(desc="正在导出...",type) {
  _this.Notice[type]({
      title:"导出Excel文件",
      desc,
      duration: 0,
      name: "excel"
  });
}
/**
* 导出Excel文件
* @param {请求链接} url 
* @param {请求数据} data 
* @param {导出的文件名} filename 
*/
const exportFlie = async (url, data, filename = "download", datetime=moment().format("YYYYMMDDHHmmss")) => {
  ExcelTip('正在导出...','info')
  try {
    let res = await exportList(url, data)
    if(res.code == 200) {
        let blob = new Blob([res.result], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename + datetime + ".xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();
        ExcelTip('导出成功','success')
        setTimeout(()=>{
          _this.Notice.close("excel")
        },3000)

    }else{
      _this.Message.error(res.message)
    }
    _this.Notice.close("excel")
  } catch (error) {
    _this.Notice.close("excel")
  }
 

}
export default {
  getSelectorList,
  getShipCityList,
  getCarrierByName,
  getEnumList,
  getTaxpayerByNo,
  materialQuery,
  listSupplierInfo,
  selectPackMaterial,
  exportFlie,
  listLikeSupplierInfo
}