// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.css'
import './assets/style.css'
import 'nprogress/nprogress.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import nprogress from 'nprogress'
import store from './vuex/store'
import Api from './Helper/Api'

window.nprogress = nprogress
window.store = store
window.router = router
window.api = Api.data().api

axios.defaults.baseURL = HOST
axios.defaults.timeout = 1000 * 15
axios.defaults.withCredentials = true
axios.defaults.headers.session_id = lockr.get('session_id') ? lockr.get('session_id') : ''
axios.defaults.headers['Content-Type'] = 'application/json'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  nprogress.start()
  if (cookies.get('user') && cookies.get('session_id')) {
    store.dispatch('setCurrentUser', JSON.parse(cookies.get('user')))
  } else {
    let params = {
      name: 'user01',
      password: '111111'
    }
    window.api.post('Public/login', params).then(response => {
      if (response.status === 200 && response.data.status !== true) {
        cookies.remove('user')
        cookies.remove('session_id')
        lockr.flush()
        window.store.dispatch('setCurrentUser', {})
      } else {
        window.api.resetCommonData(response.data)
      }
    }).catch(error => {
      alert(error)
    })
  }
  next()
})

router.afterEach(route => {
  nprogress.done()
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
