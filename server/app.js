const express = require('express');
const app = express();
const port = 3000;

app.get('/api/account/list', (req, res) => {
  res.json({
    errorCode: '0000',
    data: [
      {
        enterprise: '中国平安集团金融股份有限公司',
        account: '6236 8739 1234 8891 753',
        amount: '753,951,123,456.78元'
      }
    ]
  });
});

app.get('/api/seller', (req, res) => {
  res.json({
    errorCode: '0000',
    data: 'server /api/seller'
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
