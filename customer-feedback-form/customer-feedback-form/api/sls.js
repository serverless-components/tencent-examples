'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const FeedbackForm = require('./controller/feedback');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// add new user
app.post('/feedback', async (req, res) => {
  console.log("in app.post")
  let result = '';
  try {
    const user = req.body;
    const data = await FeedbackForm.createUserFeedbackForm(user);
    result = {
      code: 0,
      data,
      message: 'Insert Success',
    };
  } catch (e) {
    result = {
      code: e.code,
      message: `Insert Fail: ${e.message}`,
    };
  }
  res.send(JSON.stringify(result));
});

module.exports = app;
