import Vue from 'vue';
import Router from 'vue-router';
import manage from '../components/manage/manage.vue';
import LandingPage from '../components/LandingPage.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'manage',
      component: manage
    },
    {
      path: '/list',
      name: 'landing-page',
      component: LandingPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
