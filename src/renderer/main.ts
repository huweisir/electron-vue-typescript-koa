import Vue from 'vue';
import axios from 'axios';
import * as $ from 'jquery';

import App from './App.vue';
import router from './router';
import store from './store/index';
const vueElectron = require('vue-electron');
// import '../lib/DATracker.js';
// require("https://hubble-js-bucket.nosdn.127.net/DATracker.globals.1.2.2.js");


if (!process.env.IS_WEB) Vue.use(vueElectron);
(Vue as any).http = Vue.prototype.$http = axios;
(Vue as any).$ = Vue.prototype.$ = $;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');

