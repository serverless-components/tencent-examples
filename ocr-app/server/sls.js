const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Apis = require('./apis');

const isDev = process.env.NODE_ENV === 'development';

// if is development, inject environment variables by dotenv
// for SCF, it will get inject by config in serverless.yml
if (isDev) {
  require('dotenv').config({
    path: '../.env',
  });
}

const app = express();
const apis = new Apis();

app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res, next) => {
  res.send({
    version: '1.0',
  });
});

app.post('/token', async (req, res, next) => {
  const uuid = req.body.uuid;
  const result = await apis.getCosTmpCredential(uuid);
  if (result.Error) {
    res.send({
      code: 1,
      error: result.Error,
    });
  } else {
    res.send({
      code: 0,
      data: result,
    });
  }
});

app.post('/ocr', async (req, res, next) => {
  const imgUrl = req.body.imgUrl;
  const result = await apis.getOCRResult(imgUrl);
  if (result.Error) {
    res.send({
      code: 1,
      error: result.Error,
    });
  } else {
    res.send({
      code: 0,
      data: result.TextDetections,
    });
  }
});

if (isDev) {
  const host = '0.0.0.0';
  const port = 8080;
  app.listen(port, host, () => {
    console.log(`Server starting on http://${host}:${port}`);
  });

  process.on('unhandledRejection', (e) => {
    console.log(e);
  });
}

module.exports = app
