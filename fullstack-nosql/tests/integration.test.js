const {
  getServerlessSdk,
  getCredentials,
  getDBConfig,
  getApiConfig,
  getWebConfig,
} = require('./utils')
const path = require('path')

// set enough timeout for deployment to finish
jest.setTimeout(600000)

const instanceDBYaml = getDBConfig(
  path.resolve(__dirname, '../mongodb/serverless.yml'),
)

const instanceApiYaml = getApiConfig(
  path.resolve(__dirname, '../backend/serverless.yml'),
)

const instanceWebYaml = getWebConfig(
  path.resolve(__dirname, '../frontend/serverless.yml'),
)
// get tencent cloud credentials from env
const credentials = getCredentials()

const sdk = getServerlessSdk()

it('should successfully deploy fullstack db app', async () => {
  const instance = await sdk.deploy(instanceDBYaml, credentials)
  expect(instance.outputs.EnvId).toBeDefined()
  const {
    outputs: { EnvId },
  } = instance
  // update api instance config
  instanceApiYaml.inputs.environment.variables.MongoId = EnvId
})

it('should successfully deploy fullstack api app', async () => {
  const instance = await sdk.deploy(instanceApiYaml, credentials)
  expect(instance.outputs.Triggers.apigw).toBeDefined()
  const {
    outputs: {
      Triggers: { apigw },
    },
  } = instance
  // update front end instance config
  instanceWebYaml.inputs.env.apiUrl = apigw[0]
})

it('should successfully deploy fullstack website app', async () => {
  const instance = await sdk.deploy(instanceWebYaml, credentials)
  expect(instance.outputs.website).toBeDefined()
})
// --------- remove all deployed instance -------------- //
it('should successfully remove fullstack website app', async () => {
  await sdk.remove(instanceWebYaml, credentials)
  result = await sdk.getInstance(
    instanceWebYaml.org,
    instanceWebYaml.stage,
    instanceWebYaml.app,
    instanceWebYaml.name,
  )
  expect(result.instance.instanceStatus).toEqual('inactive')
})
it('should successfully remove fullstack api app', async () => {
  await sdk.remove(instanceApiYaml, credentials)
  result = await sdk.getInstance(
    instanceApiYaml.org,
    instanceApiYaml.stage,
    instanceApiYaml.app,
    instanceApiYaml.name,
  )
  expect(result.instance.instanceStatus).toEqual('inactive')
})

it('should successfully remove fullstack db app', async () => {
  await sdk.remove(instanceDBYaml, credentials)
  result = await sdk.getInstance(
    instanceDBYaml.org,
    instanceDBYaml.stage,
    instanceDBYaml.app,
    instanceDBYaml.name,
  )
  expect(result.instance.instanceStatus).toEqual('inactive')
})
