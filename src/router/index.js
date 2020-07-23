import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home'
import CameraManage from '@/components/CameraManage'
import DeviceManage from '@/components/DeviceManage'
Vue.use(Router)


/**
 * 解决element-ui导航栏中的vue-router在3.0版本以上重复点菜单报错问题
 * 报错内容如下：
 * Avoided redundant navigation to current location: "/Home/device"
 */
 const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

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
          name: 'CameraManage',
          component: CameraManage
        },
        {
          path: '/Home/device',
          name: 'DeviceManage',
          component: DeviceManage
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    }
  ]

})
