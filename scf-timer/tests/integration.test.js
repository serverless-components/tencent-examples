const { getYamlConfig, getServerlessSdk, getCredentials } = require('./utils')
const path = require('path')
require('dotenv').config()

// set enough timeout for deployment to finish
jest.setTimeout(600000)

const instanceBackendYaml = getYamlConfig(
  path.resolve(__dirname, '../serverless.yml'),
)

// get tencent cloud credentials from env
const credentials = getCredentials()

const sdk = getServerlessSdk()

it('should successfully deploy timer app', async () => {
  const instance = await sdk.deploy(instanceBackendYaml, credentials)
  expect(instance).toBeDefined()
  expect(instance.instanceStatus).toEqual('active')
})

it('should successfully remove timer app', async () => {
  await sdk.remove(instanceBackendYaml, credentials)
  result = await sdk.getInstance(
    instanceBackendYaml.org,
    instanceBackendYaml.stage,
    instanceBackendYaml.app,
    instanceBackendYaml.name,
  )
  expect(result.instance.instanceStatus).toEqual('inactive')
})
