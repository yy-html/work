// 订单压力平衡模块
const routes = [
  {
    path: '/cas/',
    name: 'ruleSetting', // 大仓干线
    component: () => import('@/views/baseSetting/index.vue')
  },
  {
    path: '/cas/ruleSetting',
    name: 'ruleSetting', // 次日达配送
    component: () => import('@/views/baseSetting/index.vue')
  },
  {
    path: '/cas/basic-setting/consignor',
    name: 'ConsignorManagement', // 货主管理
    component: () => import('@/views/baseSetting/consignor-management/index.vue')
  },
  {
    path: '/cas/basic-setting/next-day-setting',
    name: 'NextDaySetting', // 次日达设置
    component: () => import('@/views/baseSetting/next-day-setting/index.vue')
  }
]

export default [
  ...routes
]
