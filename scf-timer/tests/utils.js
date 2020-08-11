const { ServerlessSDK } = require('@serverless/platform-client-china')
require('dotenv').config()
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

/*
 * Initializes and returns an instance of the serverless sdk
 * @param ${string} orgName - the serverless org name.
 */
const getServerlessSdk = (orgName) => {
  const sdk = new ServerlessSDK({
    skipRoleBinding: true,
    context: {
      orgName,
    },
  })
  return sdk
}
const getCredentials = () => {
  const credentials = {
    tencent: {
      SecretId: process.env.TENCENT_SECRET_ID,
      SecretKey: process.env.TENCENT_SECRET_KEY,
    },
  }

  if (!credentials.tencent.SecretId || !credentials.tencent.SecretKey) {
    throw new Error(
      'Unable to run tests. Tencent credentials not found in the envionrment',
    )
  }

  return credentials
}

const defaultConfig = {
  org: 'orgDemo',
  app: 'appDemo',
  component: 'scf',
  name: 'personal-reminder-tests',
  stage: 'dev',
  inputs: {
    name: 'personal-reminder-tests',
    src: path.resolve(__dirname, '../'),
    handler: 'index.main_handler',
    runtime: 'Nodejs8.9',
    namespace: 'default',
    description: 'trigger scf function based on time',
    memoriSize: 128,
    timeout: 10,
    region: process.env.REGION,
    environment: {
      variables: {
        EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
        EMAIL_ADDRESS_PASSWORD: process.env.EMAIL_ADDRESS_PASSWORD,
      },
    },
    events: [
      {
        timer: {
          name: 'test-timer',
          parameters: {
            cronExpression: '*/60 * * * * * *',
            enable: true,
            argument: 'argument',
          },
        },
      },
    ],
  },
}

const getYamlConfig = (filePath) => {
  let config
  try {
    config = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'))
    console.log('successfully read serverless yaml file')
    config.inputs.environment.variables.EMAIL_ADDRESS =
      process.env.EMAIL_ADDRESS || 'test@test.com'
    config.inputs.environment.variables.EMAIL_ADDRESS_PASSWORD =
      process.env.EMAIL_ADDRESS_PASSWORD || 'testPW'
    config.inputs.region = process.env.REGION
    config.inputs.src = path.resolve(__dirname, '../')
  } catch (e) {
    console.log('read constant yaml file fail:', e)
    console.log('use default config')
    config = defaultConfig
  }
  return config
}
module.exports = { getServerlessSdk, getCredentials, getYamlConfig }
