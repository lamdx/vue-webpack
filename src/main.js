// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import http from './http';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
// 动态引入图片
import '@/assets/images';

Vue.use(iView);
// Vue.prototype.$request = http.request;
Vue.use(http);
Vue.config.productionTip = false;

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: { App },
//   template: '<App/>'
// });

const app = new Vue({
  router,
  store,
  render: h => h(App)
});

// mock 数据执行方法只在指定的演示环境触发
// if (location.origin === process.env.MOCK_ENV || process.env.IS_DEMO_ENV) {
import(/* webpackChunkName:"mock-data" */ '@/mock/index.js').then(res => {
  res.mockFilter();
});
// }
app.$mount('#app');
