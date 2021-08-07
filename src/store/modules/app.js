
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

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
