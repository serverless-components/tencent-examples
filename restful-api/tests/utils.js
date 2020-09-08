const { ServerlessSDK } = require('@serverless/platform-client-china')
require('dotenv').config()
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

/*
 * Generate random id
 */
const generateId = () => Math.random().toString(36).substring(6)

/*
 * Initializes and returns an instance of the serverless sdk
 * @param ${string} orgName - the serverless org name.
 */
const getServerlessSdk = () => {
  const sdk = new ServerlessSDK({
    skipRoleBinding: true,
    context: {},
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
  name: 'restful-api-tests',
  stage: 'dev',
  inputs: {
    name: 'restful-api-tests',
    src: path.resolve(__dirname, '../src/'),
    handler: 'index.main_handler',
    runtime: 'Python3.6',
    functionName: 'ocr-backend-integration-tests',
    description: 'My Serverless Function',
    memoriSize: 128,
    timeout: 20,
    region: process.env.REGION,
    events: [
      {
        apigw: {
          name: 'serverless',
          parameters: {
            protocols: ['http'],
            serviceName: 'serverless',
            description: 'the serverless service',
            environment: 'release',
            endpoints: [
              {
                path: '/users/{user_type}/{action}',
                method: 'GET',
                description: 'serverless rest api',
                enableCORS: true,
                serviceTimeout: 10,
                param: [
                  {
                    name: 'user_type',
                    position: 'PATH',
                    required: 'TRUE',
                    type: 'string',
                    defaultValue: 'teacher',
                    desc: 'mytest',
                  },
                  {
                    name: 'action',
                    position: 'PATH',
                    required: 'TRUE',
                    type: 'string',
                    defaultValue: 'go',
                    desc: 'mytest',
                  },
                ],
              },
            ],
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
    config.inputs.name = config.name
    config.inputs.region = process.env.REGION
    config.inputs.src = path.resolve(__dirname, '../src/')
  } catch (e) {
    console.log('read constant yaml file fail:', e)
    console.log('use default config')
    config = defaultConfig
  }
  return config
}
module.exports = { generateId, getServerlessSdk, getCredentials, getYamlConfig }
