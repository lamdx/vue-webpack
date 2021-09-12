import Vue from 'vue';
import http from '../utils/http';
const config = {
  prefix: 'dict_' // 添加前缀防止业务代码缓存名称相同导致冲突(不能100%防止)
};
function initDicts(codes) {
  let promises = [];
  codes.forEach(code => {
    promises.push(getDictCodeValues(code));
  });
  Promise.race(promises).then(res => {
    console.log(res);
  });
}
function getDictCodeValues(code) {
  return new Promise(resolve => {
    if (hasSessionStorage(code)) {
      let list = JSON.parse(getSessionStorage(code));
      resolve(list);
    }
    let url = '/api/dict';
    http
      .request({
        url,
        method: 'post',
        data: {
          dictCode: code
        }
      })
      .then(res => {
        setSessionStorage(code, res.data);
        resolve(res.data);
      });
  });
}
function hasSessionStorage(code) {
  let cache = getSessionStorage(code);
  if (cache && cache.length > 0) {
    return true;
  } else {
    return false;
  }
}
function getSessionStorage(code) {
  return sessionStorage.getItem('' + config.prefix + code);
}
function setSessionStorage(code, list) {
  if (code && list && list.length > 0) {
    sessionStorage.setItem('' + config.prefix + code, JSON.stringify(list));
  }
  return list;
}
function getDictText(code, value) {
  return new Promise(resolve => {
    setTimeout(() => {
      getDictCodeValues(code).then(list => {
        let text = '';
        list.forEach(item => {
          if (item.value === value) {
            text = item.name;
          }
        });
        resolve(text);
      });
    });
  });
}
function getDictTextFn(el, binding) {
  if (typeof binding.value === 'string') {
    let code = binding.value;
    let value = el.innerText;
    getDictText(code, value).then(text => {
      if (text) {
        el.innerText = text;
      }
    });
  }
  if (typeof binding.value === 'object') {
    let dictObj = binding.value;
    getDictText(dictObj.code, dictObj.value).then(text => {
      if (text) {
        el.innerText = text;
      }
    });
  }
}
// 字典转义
// 使用方法
// <span v-dict:currency>{{ a }}</span>
Vue.directive('dict', {
  inserted: getDictTextFn,
  componentUpdated: getDictTextFn
});
