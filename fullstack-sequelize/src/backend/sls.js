const { app } = require('./app');
const { initDatabase } = require('./database');

app.slsInitialize = async () => {
  try {
    await initDatabase();
  } catch (e) {
    console.log(`[DB Error]: ${e}`);
  }
};

app.binaryTypes = ['*/*'];

module.exports = app;
