import Vue from 'vue';
import Vuex from 'vuex';
import logger from 'vuex/dist/logger';
Vue.use(Vuex);
const modules = [];
export default new Vuex.Store({
  strict: process.env.NOD_ENV !== 'production',
  modules,
  plugins: [logger()]
});
