import Vue from 'vue';
import Router from 'vue-router';
import account from '@/views/home/account.vue';
import home from '@/views/home/home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/account',
      name: 'account',
      component: account
    }
  ]
});
