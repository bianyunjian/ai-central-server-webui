import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home'
import CameraManage from '@/components/CameraManage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/Home/camera',
          name: 'CameraNamage',
          component: CameraManage
        }
        // ,
        // {
        //   path: '/cameraManage',
        //   name: 'CameraManage',
        //   components:
        //   {
        //     containerRouteView4Child: CameraManage
        //   }
        // }
        
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    }
  ]

})
