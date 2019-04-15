import Vue from 'vue';
import axios from 'axios';
import * as $ from 'jquery';

import App from './App.vue';
import router from './router';
import store from './store/index';
const vueElectron = require('vue-electron');

// var hubble = new (window as any).HubbleUtil('pay', 'payInfo')
// const PAYhubble = function (eventId: string, other: any) {
//   hubble.report(eventId, other)
// }

// Vue.prototype.$hubble = PAYhubble;
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
}).$mount('#app')
