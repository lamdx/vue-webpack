const api = [
  {
    url: "/api/seller",
    callback: (req, res) => {
      res.json({
        errorCode: "0000",
        data: 123
      });
    }
  },
  {
    url: "/api/goods",
    callback: (req, res) => {
      res.json({
        errorCode: "0000",
        data: 456
      });
    }
  }
];

module.exports = app => {
  // app.get("/api/seller", (req, res) => {
  //   res.json({
  //     errorCode: "0000",
  //     data: 123
  //   });
  // });
  // app.get("/api/goods", (req, res) => {
  //   res.json({
  //     errorCode: "0000",
  //     data: 456
  //   });
  // });
  return api.forEach(item => {
    app.get(item.url, item.callback);
  });
};
