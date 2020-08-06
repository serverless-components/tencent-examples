const { getServerlessSdk, getCredentials } = require('./utils')
const path = require('path')
require('dotenv').config()

// set enough timeout for deployment to finish
jest.setTimeout(600000)

const instanceBucketYaml = {
  component: 'cos',
  name: 'ocr-bucket-test',
  stage: 'dev',
  org: 'orgDemo',
  app: 'appDemo',
  inputs: {
    bucket: 'ocr-bucket',
    region: process.env.REGION,
    protocol: 'https',
    acl: { permissions: 'public-read' },
    cors: [
      {
        maxAgeSeconds: 0,
        allowedMethods: ['GET', 'PUT', 'POST'],
        allowedOrigins: '*',
        allowedHeaders: '*',
      },
    ],
  },
}
// the yaml file we're testing against
const instanceBackendYaml = {
  org: 'orgDemo',
  app: 'appDemo',
  component: 'express',
  name: 'ocr-backend-integration-tests',
  stage: 'dev',
  inputs: {
    src: path.resolve(__dirname, '../server/'),
    functionName: 'ocr-backend-integration-tests',
    runtime: 'Nodejs10.15',
    region: 'ap-guangzhou',
    functionConf: {
      timeout: 10,
      environment: {
        variabbles: {
          TENCENT_APP_ID: process.env.TENCENT_APP_ID,
          TENCENT_SECRET_ID: process.env.TENCENT_SECRET_ID,
          TENCENT_SECRET_KEY: process.env.TENCENT_SECRET_KEY,
        },
      },
    },
    apigatewayConf: {
      enableCORS: true,
      protocols: ['http', 'https'],
    },
  },
}

const instanceFrontendYaml = {
  org: 'orgDemo',
  app: 'appDemo',
  component: 'website',
  name: 'ocr-frontend-integration-tests',
  stage: 'dev',
  inputs: {
    protocol: 'https',
    src: {
      src: path.resolve(__dirname, '../frontend/'),
      hook: 'SKIP_PREFLIGHT_CHECK=true npm run build',
      envPath: './',
      dist: path.resolve(__dirname, '../frontend/build'),
      index: 'index.html',
      error: 'index.html',
    },
    env: { apiUrl: '' },
  },
}
// get aws credentials from env
const credentials = getCredentials()

const sdk = getServerlessSdk(instanceBackendYaml.org)

it('should successfully deploy ocr bucket app', async () => {
  const instance = await sdk.deploy(instanceBucketYaml, credentials)
  instanceBackendYaml.region = instance.outputs.region
  instanceBackendYaml.inputs.REGION = instance.outputs.region
  instanceBackendYaml.inputs.BUCKET = instance.outputs.bucket
  instanceFrontendYaml.inputs.region = instance.outputs.region
  instanceFrontendYaml.inputs.bucketName = instance.outputs.bucket
})

it('should successfully deploy ocr backend app', async () => {
  const instance = await sdk.deploy(instanceBackendYaml, credentials)
  expect(instance).toBeDefined()
  expect(instance.instanceName).toEqual(instanceBackendYaml.name)
  // get src from template by default
  expect(instance.outputs.scf.runtime).toBeDefined()
  expect(instance.outputs.apigw).toBeDefined()
  expect(instance.outputs.region).toEqual(instanceBackendYaml.inputs.region)
  instanceFrontendYaml.inputs.env.apiUrl = instance.outputs.apigw.url
})

it('should successfully deploy ocr frontend app', async () => {
  const instance = await sdk.deploy(instanceFrontendYaml, credentials)
  expect(instance.outputs.website).toBeDefined()
})

it('should successfully remove ocr backend app', async () => {
  await sdk.remove(instanceBackendYaml, credentials)
  result = await sdk.getInstance(
    instanceBackendYaml.org,
    instanceBackendYaml.stage,
    instanceBackendYaml.app,
    instanceBackendYaml.name,
  )
  expect(result.instance.instanceStatus).toEqual('inactive')
})

it('should successfully remove ocr frontend app', async () => {
  await sdk.remove(instanceFrontendYaml, credentials)
  result = await sdk.getInstance(
    instanceBackendYaml.org,
    instanceBackendYaml.stage,
    instanceBackendYaml.app,
    instanceBackendYaml.name,
  )
  expect(result.instance.instanceStatus).toEqual('inactive')
})

it('should successfully remove ocr bucket app', async () => {
  await sdk.remove(instanceBucketYaml, credentials)
  result = await sdk.getInstance(
    instanceBackendYaml.org,
    instanceBackendYaml.stage,
    instanceBackendYaml.app,
    instanceBackendYaml.name,
  )
  expect(result.instance.instanceStatus).toEqual('inactive')
})
