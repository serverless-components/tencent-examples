'use strict';

const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const rootDir = path.join(__dirname, '..');
const backendDir = path.join(rootDir, 'server');
const frontendDir = path.join(rootDir, 'frontend');

async function installDependencies(dir) {
  await exec('npm install', {
    cwd: dir,
  });
}

/* eslint-disable no-console*/
async function bootstrap() {
  console.log('Start install dependencies...\n');
  console.log('Start install backend dependencies...\n');
  await installDependencies(backendDir);
  console.log('Server dependencies installed success.');
  console.log('Start install frontend dependencies...\n');
  await installDependencies(frontendDir);
  console.log('Frontend dependencies installed success.');
  console.log('All dependencies installed.');
}

bootstrap();

process.on('unhandledRejection', (e) => {
  throw e;
});
