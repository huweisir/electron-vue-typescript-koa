import Vue from 'vue';
import axios from 'axios';
import * as $ from 'jquery';

import App from './App.vue';
import router from './router';
import store from './store/index';
import {
  use
} from './plugin/index';
const vueElectron = require('vue-electron');
require("babel-polyfill");

use.forEach((element: any) => {
  Vue.use(element);
});

// message之类绑定到prototype上的方法
// Object.assign(Vue.prototype, protos)

if (!process.env.IS_WEB) Vue.use(vueElectron);
(Vue as any).http = Vue.prototype.$http = axios;
(Vue as any).$ = Vue.prototype.$ = $;
Vue.config.productionTip = false;

/* eslint-disable no-new */
(window as any).app = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');

