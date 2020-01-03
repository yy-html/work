import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import dashboardRoutes from './dashboard'
import baseSettingRoutes from './baseSetting'
import baseDataRoutes from './baseData'
const viewRoutes = [
  ...dashboardRoutes,
  ...baseSettingRoutes,
  ...baseDataRoutes
]

const pageRoutes = [

]

const router = new Router({
  routes: [
    ...viewRoutes, 
    ...pageRoutes,
    {
      path: '/error'
    },
    {
      path: '/cas/*',
      redirect: '/error'
    }
  ]
})

export default router
