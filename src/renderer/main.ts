import Vue from 'vue';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import store from './store/index';
const vueElectron = require('vue-electron')

if (!process.env.IS_WEB) Vue.use(vueElectron);
(Vue as any).http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
