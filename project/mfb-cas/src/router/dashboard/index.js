// 订单压力平衡模块
const banlanceRoute = [
  {
    path: '/cas/dashboard',
    name: 'CASDashboard', // 看板
    component: () => import('@/views/dashboard/index.vue')
  }
]

export default [
  ...banlanceRoute
]
