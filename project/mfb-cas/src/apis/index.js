const apis = {
  //基础数据-大仓仓租
  'BASE_DATA_RENT': {
    LIST: "/cost-data/data/warehouseRent/queryListPage", //列表查询
    ADD: "/cost-data/data/warehouseRent/save",//新增修改
    UPDATE: "/cost-data/data/warehouseRent/update", //删除、提交数据
    QUERYDETAIL: "/cost-data/data/warehouseRent/queryDetail", //查询编辑详情
    EXPORT: "/cost-data/data/warehouseRent/export",//导出
    UPLOAD:"/cost-data/data/warehouseRent/import",//上传
  },
  //基础数据-大仓运营费
  'BASE_DATA_OPERATE': {
    LIST: "/cost-data/data/operatingCost/queryListPage", //列表查询
    ADD: "/cost-data/data/operatingCost/save",//新增修改
    UPDATE: "/cost-data/data/operatingCost/update", //删除、提交数据
    QUERYDETAIL: "/cost-data/data/operatingCost/queryDetail", //查询编辑详情
    EXPORT: "/cost-data/data/operatingCost/export",//导出
    UPLOAD:"/cost-data/data/operatingCost/import",//上传
  },
  //基础数据-大仓作业
  'BASE_DATA_TASK': {
    LIST: "/cost-data/data/work/list", //列表查询
    ADD: "/cost-data/data/work/save",//新增修改
    UPDATE: "/cost-data/data/work/delete", //删除
    QUERYDETAIL: "/cost-data/data/work/detail", //查询编辑详情
    EXPORT: "/cost-data/data/work/export",//导出
    IMPORT: "/cost-data/data/work/import",//导入
    COMMIT: "/cost-data/data/work/commit",//提交
  },
  'BASE_DATA_DISTRIBUTION': {
    LIST:"/cost-data/data/overnightDelivery/queryListPage",//分页查询
    DETAIL:"/cost-data/data/overnightDelivery/detail/",//详情
    ADD:"/cost-data/data/overnightDelivery/add",//新增
    DELETE:"/cost-data/data/overnightDelivery/delete",//删除
    SAVE:"/cost-data/data/overnightDelivery/save",//保存
    SUBMIT:"/cost-data/data/overnightDelivery/submit",//提交数据,
    CITYLIST:'/cost-data/data/overnightDelivery/getReceiveCitySelectorList',//选择收货城市
    EXPORT: "/cost-data/data/overnightDelivery/export",//导出
    IMPORT: "/cost-data/data/overnightDelivery/import",//导入
  },
  'GROUND_LINE_BOX': {
    LIST:"/cost-data/data/lineBasket/list",//分页查询
    DETAIL:"/cost-data/data/lineBasket/info",//详情
    ADD:"/cost-data/data/lineBasket/add",//新增
    DELETE:"/cost-data/data/lineBasket/delete",//删除
    SAVE:"/cost-data/data/lineBasket/modify",//修改
    SUBMIT:"/cost-data/data/lineBasket/submit",//提交数据
    EXPORT: "/cost-data/data/lineBasket/export",//导出
    IMPORT: "/cost-data/data/lineBasket/import",//导入
  },
  'GROUND_LINE_CAR': {
    LIST:"/cost-data/data/line/car/list",//分页查询
    DETAIL:"/cost-data/data/line/car/info",//详情
    ADD:"/cost-data/data/line/car/add",//新增
    DELETE:"/cost-data/data/line/car/audit",//删除
    SAVE:"/cost-data/data/line/car/edit",//编辑
    SUBMIT:"/cost-data/data/line/car/audit",//提交数据
    EXPORT:"/cost-data/data/line/car/export",//导出数据
    IMPORT: "/cost-data/data/line/car/upload",//导入
  },

  // 基础配置 - 货主管理
  'BASE_SETTING_CONSIGNOR_MANAGEMENT': {
    LIST: "/cost-config/rule/shipper/list",
    ADD: '/cost-config/rule/shipper/add',
    DETAIL: '/cost-config/rule/shipper/info',
    LOOK_UP_LOG: '/cost-config/rule/shipper/log',
    UPDATE_STATUS: '/cost-config/rule/shipper/audit',
    SAVE: '/cost-config/rule/shipper/edit',
    LIST_BY_CONSIGNOR: '/cost-config/rule/shipper/shippersByName'
  },
  // 基础配置 - 次日达设置
  'BASE_SETTING_NEXT_DAY_SETTING': {
    LIST: "/cost-config/rule/overnightDelivery/queryListPage",
    FORBID: '/cost-config/rule/overnightDelivery/disable',
    START: '/cost-config/rule/overnightDelivery/enable',
    DETAIL: '/cost-config/rule/overnightDelivery/detail',
    SAVE: '/cost-config/rule/overnightDelivery/save',
    ADD: '/cost-config/rule/overnightDelivery/add',
    LOOK_UP_LOG: '/cost-config/rule/overnightDelivery/queryQptLogs',
    SUBMIT_AUDIT: '/cost-config/rule/overnightDelivery/examine/submit',
    AUDIT_PASS: '/cost-config/rule/overnightDelivery/examine/adopt',
    AUDIT_REJECT: '/cost-config/rule/overnightDelivery/examine/refuse',
    SHIP_CITY_LIST: '/cost-config/rule/carrier/getShipCitySelectorList',
    RETURN_BACK: '/cost-config/rule/overnightDelivery/examine/back'
  },
  // 通用api
  "COMMON": {
    REGION_LIST: '/cost-data/cas/common/regionList',
    SELECTOR_LIST: '/cost-data/data/common/getSelectorList', //大区、大仓、货主、费用类型、数据状态、起停用状态、岗位 枚举数据获取
    QUERY_TAXPAYER_BY_NO: '/cost-config/rule/carrier/getTaxNoSelectorList',
    QUERY_CARRIER_BY_NAME: '/cost-config/rule/carrier/getCarrierSelectorList',
    QUERY_SHIP_CITY_LIST: '/cost-data/data/common/getShipCitySelectorList',
    selectPackMaterial: '/cost-data/data/common/selectPackMaterial',
    ENUM_LIST: '/cost-config/common/getEnum/',
    SELECT_PACK_MATERIAL: '/cost-data/data/common/selectPackMaterial',
    materialQuery: '/cost-data/data/common/materialQuery',
    listSupplierInfo: '/cost-data/data/common/listSupplierInfo',
    LISTCITY: '/cost-data/data/common/listCity',//获取城市列表
    listLikeSupplierInfo: '/cost-data/data/common/listLikeSupplierInfo',
    carrierQuery:'/cost-data/data/common/carrierQuery',//干线承运方查询接口
  },

  // 基础配置 - 折旧
  'BASE_SETTING_DEPRECIATION':{
    list: "/cost-data/data/depreciation/list",  // 查询折旧费用列表
    edit: "/cost-data/data/depreciation/save",  // 新增折旧、修改折旧
    del: "/cost-data/data/depreciation/delete", // 批量删除折旧记录
    detail: "/cost-data/data/depreciation/detail",  // 查看折旧费用详情
    import: '/cost-data/data/depreciation/import',  // 导入折旧费用文件
    export: '/cost-data/data/depreciation/export',  // 导出折旧费用列表
    submit: '/cost-data/data/depreciation/commit'  // 批量提交折旧费用
  },

  // 基础配置 - 包材
  'BASE_SETTING_PACKAGEMATERIAL':{
    list: "/cost-data/data/packagingMaterials/queryListPage",  // 分页查询接口
    detail: "/cost-data/data/packagingMaterials/queryDetail",  // 编辑、详情查询
    edit: "/cost-data/data/packagingMaterials/save",  // 新增、修改接口
    changeStatus: '/cost-data/data/packagingMaterials/update',  // 删除、提交数据接口
    upload: '/cost-data/data/packagingMaterials/import',
    export: '/cost-data/data/packagingMaterials/export',

  }

}

export default apis
