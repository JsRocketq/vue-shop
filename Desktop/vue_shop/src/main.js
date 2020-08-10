import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/gloable.css'
import axios from 'axios'
// axios配置
Vue.prototype.$http = axios
axios.defaults.timeout = 8000
axios.defaults.baseURL = 'http://127.0.0.1:3000/api/private/v1/'
// http请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }
)
// http响应拦截器
// axios.interceptors.response.use(
//   response => {
//   }
// )
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
