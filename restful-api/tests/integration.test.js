const { getServerlessSdk, getCredentials } = require('./utils')
const path = require('path')
const axios = require('axios')
const { exception } = require('console')
require('dotenv').config()

// set enough timeout for deployment to finish
jest.setTimeout(600000)

// the yaml file we're testing against
const instanceBackendYaml = {
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

// get aws credentials from env
const credentials = getCredentials()

const sdk = getServerlessSdk(instanceBackendYaml.org)

it('should successfully deploy restful api app', async () => {
  const instance = await sdk.deploy(instanceBackendYaml, credentials)
  expect(instance.outputs.Triggers.apigw[0]).toBeDefined()
  const originUrl = instance.outputs.Triggers.apigw[0]
  const teacherUrl = originUrl
    .replace('{user_type}', 'teacher')
    .replace('{action}', 'go')
  const { data: res1 } = await axios.get(teacherUrl)
  expect(res1.result).toEqual('it is student_get action')
  const studentUrl = originUrl
    .replace('{user_type}', 'student')
    .replace('{action}', 'go')
  const { data: res2 } = await axios.get(studentUrl)
  expect(res2.result).toEqual('it is teacher_put action')
})

it('should successfully remove restful api app', async () => {
  await sdk.remove(instanceBackendYaml, credentials)
  result = await sdk.getInstance(
    instanceBackendYaml.org,
    instanceBackendYaml.stage,
    instanceBackendYaml.app,
    instanceBackendYaml.name,
  )
  expect(result.instance.instanceStatus).toEqual('inactive')
})
