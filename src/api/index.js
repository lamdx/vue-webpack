import http from '@/http';

const request = function(config) {
  return http.request(config);
};

export const getData = data => request(data);
