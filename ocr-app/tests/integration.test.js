const {
  getServerlessSdk,
  getCredentials,
  getFrontendYamlConfig,
  getBackendYamlConfig,
} = require('./utils')
const path = require('path')
require('dotenv').config()

// set enough timeout for deployment to finish
jest.setTimeout(600000)

const instanceBackendYaml = getBackendYamlConfig(
  path.resolve(__dirname, '../server/serverless.yml'),
)

const instanceFrontendYaml = getFrontendYamlConfig(
  path.resolve(__dirname, '../frontend/serverless.yml'),
)

// get aws credentials from env
const credentials = getCredentials()

const sdk = getServerlessSdk()

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
