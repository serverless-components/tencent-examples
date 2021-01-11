const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const { app } = require('./app');
const { initDatabase } = require('./database');

/**
 * Start Express server.
 */
async function initServer() {
  await initDatabase();

  const server = app.listen(app.get('port'), () => {
    console.log(
      '  App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env'),
    );
    console.log('  Press CTRL-C to stop\n');
  });

  return server;
}

initServer();

process.on('unhandledRejection', (e) => {
  throw e;
});
