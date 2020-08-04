import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 如果访问的是登录界面直接放行
  if (to.path === '/login') return next()
  // 从sessionStorage获取token
  const token = sessionStorage.getItem('token')
  // 没有token的值，直接跳转到登录界面
  if (!token) return next('/login')
  next()
})
export default router
