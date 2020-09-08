const {
  getServerlessSdk,
  getCredentials,
  getVpcYamlConfig,
  getDBConfig,
  getApiConfig,
  getWebConfig,
} = require('./utils')
const path = require('path')

// set enough timeout for deployment to finish
jest.setTimeout(600000)

const instanceVpcYaml = getVpcYamlConfig(
  path.resolve(__dirname, '../vpc/serverless.yml'),
)

const instanceDBYaml = getDBConfig(
  path.resolve(__dirname, '../db/serverless.yml'),
)

const instanceApiYaml = getApiConfig(
  path.resolve(__dirname, '../api/serverless.yml'),
)

const instanceWebYaml = getWebConfig(
  path.resolve(__dirname, '../frontend/serverless.yml'),
)
// get tencent cloud credentials from env
const credentials = getCredentials()

const sdk = getServerlessSdk()

it('should successfully deploy fullstack vpc app', async () => {
  const instance = await sdk.deploy(instanceVpcYaml, credentials)
  expect(instance.outputs).toBeDefined()
  expect(instance.outputs.vpcId).toBeDefined()
  expect(instance.outputs.subnetId).toBeDefined()
  const {
    outputs: { vpcId, subnetId },
  } = instance
  // update db instance config
  instanceDBYaml.inputs.vpcConfig.vpcId = vpcId
  instanceDBYaml.inputs.vpcConfig.subnetId = subnetId
  // update api instance config
  instanceApiYaml.inputs.functionConf.vpcConfig.vpcId = vpcId
  instanceApiYaml.inputs.functionConf.vpcConfig.subnetId = subnetId
})

it('should successfully deploy fullstack db app', async () => {
  const instance = await sdk.deploy(instanceDBYaml, credentials)
  expect(instance.outputs.private.connectionString).toBeDefined()
  const {
    outputs: {
      private: { connectionString },
    },
  } = instance
  // update api instance config
  instanceApiYaml.inputs.functionConf.environment.variables.PG_CONNECT_STRING = connectionString
})

it('should successfully deploy fullstack api app', async () => {
  const instance = await sdk.deploy(instanceApiYaml, credentials)
  expect(instance.outputs.apigw.url).toBeDefined()
  const {
    outputs: {
      apigw: { url },
    },
  } = instance
  // update front end instance config
  instanceWebYaml.inputs.env.apiUrl = url
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

it('should successfully remove fullstack vpc app', async () => {
  await sdk.remove(instanceVpcYaml, credentials)
  result = await sdk.getInstance(
    instanceVpcYaml.org,
    instanceVpcYaml.stage,
    instanceVpcYaml.app,
    instanceVpcYaml.name,
  )
  expect(result.instance.instanceStatus).toEqual('inactive')
})
