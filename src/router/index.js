import Vue from 'vue';
import Router from 'vue-router';
import account from '@/components/account';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'account',
      component: account
    }
  ]
});
