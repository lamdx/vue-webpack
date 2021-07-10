import request from '../index';

export default {
  login(params) {
    return request({
      url: '/user/login',
      method: 'get',
      params
    });
  }
};
