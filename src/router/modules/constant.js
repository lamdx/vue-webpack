const constantRoutes = [
  {
    path: '/comp',
    name: 'comp',
    component: () => import(/* webpackChunkName: "comp" */ '@/views/comp')
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import(/* webpackChunkName: "layout" */ '@/views/layout')
  },
  {
    path: '/test-request',
    name: 'test-request',
    component: () => import(/* webpackChunkName: "test-request" */ '@/views/test-request')
  },
  {
    path: '/dynamic-store',
    name: 'dynamic-store',
    component: () => import(/* webpackChunkName: "dynamic-store" */ '@/views/dynamic-store')
  }
];
export default constantRoutes;
