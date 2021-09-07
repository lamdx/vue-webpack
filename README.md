# vue-webpack

> A Vue.js project

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 使用 iView 时报 "Parsing error: x-invalid-end-tag" 错误的解决方案

问题原因 iView 将标签渲染为原生 html 标签时，由于这些标签是自闭合的，所以有 end 标签会报错。

```js
// .eslintrc.js 添加规则
rules: {
  "vue/no-parsing-error": [2, {"x-invalid-end-tag": false }]
}
```

## Vuex 严格模式下 store 存储 iView 表单报错

- 不要在发布环境下启用严格模式！严格模式会深度监测状态树来检测不合规的状态变更——请确保在发布环境下关闭严格模式，以避免性能损失。

```js
export default new Vuex.Store({
  // 严格模式下 store 存储 iView 表单
  // Error in mounted hook: "RangeError: Maximum call stack size exceeded"
  // 挂载钩子中的错误："RangeError:超过最大调用堆栈大小"
  // 因此不使用严格模式
  // strict: process.env.NOD_ENV !== 'production',
  modules,
  getters,
  plugins: [logger()]
});
```

## store 模块动态注册 && 创建基于某个命名空间辅助函数 createNamespacedHelpers

```js
const state = {
  localStore: "localStore",
  formInstance: null
};

const mutations = {
  updateLocalStore(state, localStore) {
    state.localStore = localStore;
  },
  updateFormInstance(state, formInstance) {
    state.formInstance = formInstance;
  }
};

const actions = {
  setLocalStore({ commit }, localStore) {
    commit("updateLocalStore", localStore);
  },
  setFormInstance({ commit }, formInstance) {
    commit("updateFormInstance", formInstance);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
```

```js
import dynamicStore from "./dynamicStore.js";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("dynamicStore");

export default {
  computed: {
    // ...mapState('dynamicStore', ['localStore', 'formInstance']),
    ...mapState(["localStore", "formInstance"])
  },
  methods: {
    // ...mapMutations('dynamicStore', [('updateLocalStore', 'updateFormInstance')]),
    ...mapMutations(["updateLocalStore", "updateFormInstance"]),
    init() {
      console.log(this.localStore);
      // this.$store.commit('dynamicStore/updateLocalStore', 'hello world');
      this.updateLocalStore("hello world");
      console.log(this.localStore);
    }
  },
  beforeCreate() {
    //  动态注册 store 空间
    if (!this.$store.hasModule("dynamicStore")) {
      this.$store.registerModule("dynamicStore", dynamicStore);
    }
  },
  beforeDestroy() {
    // 动态卸载模块 并没有清空该 store 中 state 存储的值
    this.$store.unregisterModule("dynamicStore");
  },
  created() {
    this.init();
  }
};
```

## 禁用样式

```css
.disabled {
  // 鼠标禁止
  cursor: not-allowed;
  // 不能选中文本
  user-select: none;
}
```

## 字体的引用

```css
@font-face {
  font-family: "Wow";
  src: url("Wow.otf");
}
```

然后在 main.js 中引入这个 css 文件

## watch

```js
watch: {
  'this.$refs.content': {
    deep: true,
    handler() {
      this.$refs.content.style.height = `${this.$refs.title.offsetHeight +
        this.$refs.item.offsetHeight * this.options.length}px`;
    }
  }
}

// filter 的使用
this.$options.filters.toPercent()
```
