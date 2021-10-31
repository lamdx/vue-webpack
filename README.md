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

## 埋点

埋点也叫日志上报，指的是前端功能中，根据需求来添加对用户行为的统计工作，并且进行数据上报

为什么需要埋点？
埋点的作用就是数据采集，记录用户在客户端的操作记录和客户端响应情况。用来跟踪应用或者网站的使用情况，追踪用户行为。包括页面访问统计、来源渠道分析、漏斗分析等。

埋点的目的大致分为以下两类
用户行为追踪：主要是产品，运营及其他业务人员使用；跟踪应用或者网站的使用情况，追踪用户行为，包括页面访问统计、来源渠道分析、漏斗分析等
质量监控：主要是技术和产品使用；记录客户端闪退、异常、性能等质量数据，监控质量异常。当发生生产问题时还原用户操作

## npm run lint 修复文件

--ext：可以指定在指定目录中搜索 JavaScript 文件时，ESLint 将使用哪些文件扩展名。默认扩展名为.js。

--fix：该选项指示 ESLint 试图修复尽可能多的问题。修复只针对实际文件本身，而且剩下的未修复的问题才会输出。
--fix-dry-run：该选项与 --fix 有相同的效果，唯一一点不同是，修复不会保存到文件系统中。

## 浏览器输出 store 日志

```js
import logger from "vuex/dist/logger"; // 只需浏览器就可以查看 state
export default new Vuex.Store({
  plugins: [logger()]
});
```

## 数组应用

数组对象中的值转义 过滤 非空验证

```js
var list = [
  {
    id: 390,
    title: "写作业的风波（下）",
    subtitle: "过去的很多日志中说过",
    time: "19/12/10 16:34",
    num: 125,
    zan: "无需办理"
  },
  {
    id: 267,
    title: "写作业的风波（中）",
    subtitle: "这还不容易？",
    time: "19/12/10 16:34",
    num: "2",
    zan: "已办理"
  },
  {
    id: 624,
    title: "小风波",
    subtitle: "我都晕死了",
    time: "19/12/10 16:34",
    num: "第一质押",
    zan: "办理中"
  },
  {
    id: 581,
    title: "小风波",
    subtitle: "结果臭孩子又来毛病了",
    time: "19/12/10 16:34",
    num: "34",
    zan: "无需办理"
  }
];
list.map(item => {
  if (item.zan === "办理中") {
    item.zan = "1";
  }
  if (item.zan === "无需办理") {
    item.zan = "2";
  }
  return item;
});
this.list = list.filter((item, i) => i < 3);
console.log(list);
function notNull() {
  let temp = list.reduce((prev, cur) => {
    prev.push(cur.subtitle);
    prev.push(cur.zan);
    prev.push(cur.num);
    return prev;
  }, []);
  console.log(temp);
  let flag = temp.every(item => item !== "");
  console.log(flag);
  return flag;
}
notNull();
```

## 数组排序

```js
// 从小到大排序
tabPanes.sort((a, b) => {
  if (a.count && b.count) {
    return a.count > b.count ? 1 : -1;
  }
});
```

## 千分位

```js
var str = "123456789.12";
str.replace(/(\d)(?=(\d{3})+(\.|$))/g, "$1,");
// "123,456,789.12"
```

## CSS 中 calc() 里面的表达式 运算符前后要有空格

## loading

```js

import LOADING from './loading';
config = {
  if(config.loadingEl){
    LOADING.loadingBtn(config.loadingEl)
  }
}

response=>{
  if(response.config && response.config.loadingEl){
    LOADING.removeLoadingBtn(response.config.loadingEl)
  }
}
```

## 词汇

default
settings
is
has
function
get
query
set
result
object
array

## 数据结构转换

- map 遍历取到数组对象中的部分属性值

```js
var arr = [
  { key: "0", value: "同意" },
  { key: "1", value: "取消" }
];

var newArr = arr.map(item => {
  return item.value;
});
console.log(newArr);
// ["同意", "取消"]
```

- 过滤数组对象

```js
var skuData = [
  { name: "a", num: 10 },
  { name: "b", num: 20 },
  { name: "c", num: 30 }
];
var ranges = {
  type: "price",
  low: 15, // 区间的最小值
  height: 30 // 区间的最大值
};
var inventory = ranges => {
  const skus = new Array();
  // 筛选条件
  skuData.map(item => {
    if (item.num >= ranges.low && item.num <= ranges.height) {
      skus.push({
        ...item
      });
    }
  });
  return skus;
};
skuData = inventory(ranges);
// [{name: "b", num: 20}, {name: "c", num: 30}]
```

- `[{},{}] => [[],[]]`

```js
var arr = [
  { amount: "100", user: "admin", date: "March 6, 2019" },
  { amount: "120", user: "admin", date: "March 6, 2019" },
  { amount: "150", user: "admin", date: "March 7, 2019" },
  { amount: "200", user: "admin", date: "March 7, 2019" }
];
var newArr = arr.map(({ amount, user, date }) => [amount, user, date]);
console.log(JSON.stringify(newArr));
// [["100","admin","March 6, 2019"],["120","admin","March 6, 2019"],["150","admin","March 7, 2019"],["200","admin","March 7, 2019"]]
```

- `[{},{}] => {}`

```js
var arr = [
  { amount: "100", user: "admin1" },
  { amount: "120", user: "admin2" },
  { amount: "150", user: "admin3" },
  { amount: "200", user: "admin4" }
];
var obj = arr.reduce((prev, item) => {
  prev[item.user] = item.amount;
  return prev;
}, {});
console.log(obj);
// {admin1: "100", admin2: "120", admin3: "150", admin4: "200"}
```

- `{} => [{},{}]`

```js
var obj = { admin1: "100", admin2: "120", admin3: "150", admin4: "200" };
var arr = Object.entries(obj).reduce((prev, item, i) => {
  prev[i] = {};
  prev[i]["user"] = item[0];
  prev[i]["amount"] = item[1];
  return prev;
}, []);
console.log(JSON.stringify(arr));
// [{"user":"admin1","amount":"100"},{"user":"admin2","amount":"120"},{"user":"admin3","amount":"150"},{"user":"admin4","amount":"200"}]
```

- 将有父子关系的数组转换成树形结构数据

```js
var data = [
  { parentId: 0, id: 1, value: "xxx" },
  { parentId: 1, id: 3, value: "xxx" },
  { parentId: 4, id: 6, value: "xxx" },
  { parentId: 3, id: 5, value: "xxx" },
  { parentId: 2, id: 4, value: "xxx" },
  { parentId: 1, id: 2, value: "xxx" }
];

// 转换为树形 Array 结构
function toTreeAry(arr, pId = 0) {
  return arr
    .filter(({ parentId }) => parentId === pId)
    .map(a => ({
      ...a,
      children: toTreeAry(
        arr.filter(({ parentId }) => parentId !== pId),
        a.id
      )
    }));
}

// 转换为树形 Object 结构
function toTreeObj(arr, pId = 0) {
  let res = {};
  arr
    .filter(({ parentId }) => parentId === pId)
    .forEach(a => {
      res[a.id] = {
        ...a,
        children: toTreeObj(
          arr.filter(({ parentId }) => parentId !== pId),
          a.id
        )
      };
    });
  return res;
}

console.log(JSON.stringify(toTreeAry(data)));
console.log(JSON.stringify(toTreeObj(data)));
```

## 字体图标 icon 的使用

```less
// 在 main.less 引入
import './style/font/iconfont.css'
```

```css
/* 项目迭代可能需要引入多个字体图标文件，如果引入了多个字体图标文件，因 font-family 默认为 iconfont，没有修改 font-family 的话，后引入的的字体图标样式文件会覆盖之前的字体图标样式 */
/* 解决方案 修改 iconfont.css 中的 font-family iconfont => myiconfont(自定义) */
@font-face {
  font-family: "myiconfont"; /* Project id  */
  src: url("iconfont.ttf?t=1625235647029") format("truetype");
}

.myiconfont {
  font-family: "myiconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-xinxi:before {
  content: "\e64d";
}
```

```html
<i class="icon iconfont icon-xinxi"></i>
<!-- 修改样式后的使用 -->
<i class="icon myiconfont icon-xinxi"></i>
```

## 清除表单校验的粗暴方法

```js
this.isShowForm = false;
this.$nextTick(() => {
  this.isShowForm = true;
});
```

## 前端非空校验

```js
// 表单失焦时实时校验
checkData = function() {
  if (!this.count) {
    this.alertDialog("数量不能为空");
    return false;
  } else {
    var reg = /^[0-9]+[\.]{0,1}[0-9]{0,5}$/;
    if (!reg.test(this.count)) {
      this.alertDialog("只能为数字，且最多允许5位小数");
      return false;
    }
  }
  if (!this.upDate) {
    this.alertDialog("开始日期不能为空");
    return false;
  }
  if (!this.downDate) {
    this.alertDialog("结束日期不能为空");
    return false;
  }
  return true;
};
doNext = function() {
  var flag = checkData();
  if (!flag) {
    return;
  }
  var params = {
    count: this.count,
    upDate: this.upDate,
    downDate: this.downDate
  };
  $remote.post("queryware.do", params, function(data) {
    // 相关处理逻辑以及跳转
  });
};
```

## 代理请求日志输出

```js
dev: {
  proxyTable: {
    "/api": {
      target: "http://127.0.0.1:3000",
      logLevel: "debug", // 代理请求日志输出
      changeOrigin: true
    }
  }
}
```

## \$nextTick

作用: 在下一次 DOM 更新结束后执行指定的回调
什么时候用: 当改变数据后，要基于更新后的新 DOM 进行某些操作时，要在 nextTick 所指定的回调函数中执行

```js
// input 点击编辑的时候 input 可编辑并且获取焦点
handleEdit(todo) {
  if (todo.hasOwnProperty('isEdit')) {
    todo.isEdit = true;
  } else {
    todo.isEdit = false;
  }
  this.$nextTick(() => {
    this.$refs.input.focus();
  });
}
```

##
