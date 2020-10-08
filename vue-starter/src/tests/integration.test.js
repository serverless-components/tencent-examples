const { generateId, getServerlessSdk, getCredentials } = require('./utils')
const axios = require('axios')

// set enough timeout for deployment to finish
jest.setTimeout(600000)

// the yaml file we're testing against
const instanceYaml = {
  org: 'orgDemo',
  app: 'appDemo',
  component: 'vue-starter',
  name: `vue-integration-tests-${generateId()}`,
  stage: 'dev',
  inputs: {
    region: 'ap-guangzhou',
    runtime: 'Nodejs10.15',
    apigatewayConf: { environment: 'test' },
  },
}

// get aws credentials from env
const credentials = getCredentials()

const sdk = getServerlessSdk(instanceYaml.org)
it('should successfully deploy vue app', async () => {
  const credentials = getCredentials()
  const instance = await sdk.deploy(instanceYaml, credentials)

  expect(instance).toBeDefined()
  expect(instance.instanceName).toEqual(instanceYaml.name)
  // get src from template by default
  expect(instance.outputs.templateUrl).toBeDefined()
  expect(instance.outputs.region).toEqual(instanceYaml.inputs.region)
  expect(instance.outputs.apigw).toBeDefined()
  expect(instance.outputs.apigw.environment).toEqual(
    instanceYaml.inputs.apigatewayConf.environment,
  )
  expect(instance.outputs.scf).toBeDefined()
  expect(instance.outputs.scf.runtime).toEqual(instanceYaml.inputs.runtime)

  const response = await axios.get(instance.outputs.website)
  expect(
    response.data.includes(
      'a website built on serverless components via the serverless framework',
    ),
  ).toBeTruthy()
})

it('should successfully remove vue app', async () => {
  await sdk.remove(instanceYaml, credentials)
  result = await sdk.getInstance(
    instanceYaml.org,
    instanceYaml.stage,
    instanceYaml.app,
    instanceYaml.name,
  )

  expect(result.instance.instanceStatus).toEqual('inactive')
})
