// 基础数据
const baseDataRoutes = [
   {
    path: '/cas/baseData/warehouseRent',
    name: 'warehouserent', // 大仓仓租
    component: () => import('@/views/baseData/warehouserent/index.vue')
   },
   {
    path: '/cas/baseData/warehouseTask',
    name: 'warehousetask', // 大仓作业
    component: () => import('@/views/baseData/warehousetask/index.vue')
   },
   {
    path: '/cas/baseData/groundline',
    name: 'groundline', // 大仓干线
    component: () => import('@/views/baseData/groundline/index.vue')
   },
    {
      path: '/cas/baseData/groundline',
      name: 'groundline', // 大仓干线
      component: () => import('@/views/baseData/groundline/index.vue')
    },
    {
      path: '/cas/baseData/distribution',
      name: 'distribution', // 次日达配送
      component: () => import('@/views/baseData/distribution/index.vue')
    },
    {
      path: '/cas/baseData/oldList',
      name: 'DepreciationList', // 折旧
      component: () => import('@/views/Depreciation/list.vue')
    },
    {
      path: '/cas/baseData/packageMaterialList',
      name: 'packageMaterialList', // 包材
      component: () => import('@/views/PackageMaterial/list.vue')
    }
  ]
  
  export default [
    ...baseDataRoutes
  ]
  