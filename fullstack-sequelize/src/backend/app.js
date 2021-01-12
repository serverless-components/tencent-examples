const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

routes(app);

module.exports = { app };
