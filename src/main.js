import App from './App.vue'
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue'
import Axios from 'axios';
import { routes } from './routes';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import auth from "./jwt-auth"

Vue.prototype.$eventHub = new Vue();
Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.component('font-awesome-icon', FontAwesomeIcon)

const router = new VueRouter({ routes, mode: 'history' })

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start()
    validateUser();
  }
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

//  baseURL: 'https://forum-back-end.herokuapp.com/'
Vue.prototype.$http = Axios.create({

 baseURL: 'http://localhost:8080/'
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

Vue.prototype.$http.interceptors.request.use(function (config) {
  NProgress.start();
  validateUser();
  return config;
}, function (error) {
  return Promise.reject(error);
});

Vue.prototype.$http.interceptors.response.use(response => {
  NProgress.done()
  return response
})

function validateUser() {
  let jwt = localStorage.getItem("token");
  if (jwt && auth.user.isAuthenticated) {
    let tokenUser = JSON.parse(atob(jwt.split('.')[1])).sub;
    if (tokenUser != localStorage.getItem("username")) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      auth.user.isAuthenticated = false;
      Vue.prototype.$eventHub.$emit('enableLogout', false);
      router.push("/");
    }
  } else {
    router.push("/");
  }
}
