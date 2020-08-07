'use strict'

const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const rootDir = path.join(__dirname, '.')
const apiDir = path.join(rootDir, 'api')
const frontendDir = path.join(rootDir, 'feedback-form-website')
const nodemailerDir = path.join(rootDir, 'nodemailer')

async function installDependencies(dir) {
  await exec('npm install', {
    cwd: dir
  })
}

/* eslint-disable no-console*/
async function bootstrap() {
  console.log('Start install dependencies...\n')
  console.log('Start install api dependencies...\n')
  await installDependencies(apiDir)
  console.log('Api dependencies installed success.\n')
  console.log('Start install frontend dependencies...\n')
  await installDependencies(frontendDir)
  console.log('Frontend dependencies installed success.\n')
  console.log('Start install nodemailer module dependencies...\n')
  await installDependencies(nodemailerDir)
  console.log('Nodemailer dependencies installed success.\n')
  console.log('All dependencies installed.')
}

bootstrap()

process.on('unhandledRejection', (e) => {
  throw e
})
