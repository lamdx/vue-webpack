const proxyHost = 'http:22.0.141.40:9080';
const ZX = {
  target: "http:22.0.141.177:9080",
  changeOrigin: true,
  logLevel: "debug",
  headers: {
    Referer: "http:22.0.141.177:9080/star-web"
  }
};

module.exports = {
  // 上面的 url 优先级更高
  "/star-api/business/getContractDetail": ZX,
  "/star-api": {
    target: proxyHost,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {
      "^/star-api": "/star-api"
    },
    // 修改代理的请求头，也要调整 http 的请求头
    headers: {
      Referer: `${proxyHost}/star-web`
    }
  }
};