const state = {
  userInfo: {}
};

const mutations = {
  updateUserInfo: (state, userInfo) => {
    state.userInfo = userInfo;
  }
};

const actions = {
  setUserInfo({ commit }, userInfo) {
    commit('updateUserInfo', userInfo);
  }
};

// reduce 这种写法会破坏 vuex 的功能，不建议使用，因为 mutations getters 里面可以书写其他逻辑
// const keysList = Object.keys(state);

// const mutations = keysList.reduce(
//   (prev, key) => ({ ...prev, [key]: (state, data) => (state[key] = data) }),
//   {}
// );

// const getters = keysList.reduce(
//   (prev, key) => ({ ...prev, [key]: state => state[key] }),
//   {}
// );

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
