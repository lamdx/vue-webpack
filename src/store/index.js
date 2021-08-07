import Vue from 'vue';
import Vuex from 'vuex';
import logger from 'vuex/dist/logger';
import getters from './getter';
Vue.use(Vuex);
const modulesFiles = require.context('./modules', true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

export default new Vuex.Store({
  // 严格模式下 store 存储 iview 表单
  // Error in mounted hook: "RangeError: Maximum call stack size exceeded"
  // 挂载钩子中的错误："RangeError:超过最大调用堆栈大小"
  // strict: process.env.NOD_ENV !== 'production',
  modules,
  getters,
  plugins: [logger()]
});
