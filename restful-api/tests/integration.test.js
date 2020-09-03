const { getYamlConfig, getServerlessSdk, getCredentials } = require('./utils')
const path = require('path')
const axios = require('axios')
require('dotenv').config()

// set enough timeout for deployment to finish
jest.setTimeout(600000)

const instanceBackendYaml = getYamlConfig(
  path.resolve(__dirname, '../src/serverless.yml'),
)

// get tencent cloud credentials from env
const credentials = getCredentials()

const sdk = getServerlessSdk()

it('should successfully deploy restful api app', async () => {
  const instance = await sdk.deploy(instanceBackendYaml, credentials)
  expect(instance.outputs.triggers.apigw[0]).toBeDefined()
  const originUrl = instance.outputs.triggers.apigw[0]
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
