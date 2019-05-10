import Vue from 'vue';
import Router from 'vue-router';
import manage from '../components/manage/manage.vue';
import fileOps from '../components/fileOps.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'manage',
      component: manage
    },
    {
      path: '/files',
      component: fileOps
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
