import Vue from 'vue';
import Router from 'vue-router';
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
      component: () =>
        import(/* webpackChunkName: "account" */ '@/views/home/account.vue'),

      // 路由组件可以通过 props 接收路由跳转传递的参数(params 和 query 是可以同时存在的)
      // 如果路由传参携带了 params 参数，跳转的时候只能使用 name 跳转，不能使用 path

      // 布尔值，路由组件可以通过 props 接收路由的 params，且只能接收 params
      // props: true,
      // 对象，可以额外地给路由组件传递一些 props
      // props: { a: 1, b: 2 },
      // 函数，可以将路由 params 参数、query 参数，通过 props 传递给路由组件
      props: $route => ({ keyword: $route.params.keyword, k: $route.query.k })
    }
  ]
});
