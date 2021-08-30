import Vue from 'vue';
let banksMap = {};
let req = require.context('./bank', false, /[a-zA-Z]\.png$/);
let requireAll = requireContext => {
  let banks = requireContext.keys();
  banks.forEach(bank => {
    let lastIndex = bank.lastIndexOf('.');
    let bankName = bank.substring(2, lastIndex);
    banksMap[bankName] = `${bankName}.png`;
  });
  Vue.prototype.$banksMap = banksMap;
  console.log(banksMap);
  // return requireContext.keys().map(requireContext);
};
requireAll(req);
