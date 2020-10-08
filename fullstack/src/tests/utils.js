const { ServerlessSDK } = require('@serverless/platform-client-china')
require('dotenv').config()
const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
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

const getVpcYamlConfig = (filePath) => {
  try {
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'))
    config.inputs.zone = process.env.ZONE
    config.inputs.region = process.env.REGION
    return config
  } catch (e) {
    throw new Error(`read ${filePath} config file error: ${e}`)
  }
}

const getDBConfig = (filePath) => {
  try {
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'))
    config.inputs.zone = process.env.ZONE
    config.inputs.region = process.env.REGION
    config.inputs.dBInstanceName = config.name
    return config
  } catch (e) {
    throw new Error(`read ${filePath} config file error: ${e}`)
  }
}

const getApiConfig = (filePath) => {
  try {
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'))
    config.inputs.functionName = config.name
    config.inputs.region = process.env.REGION
    return config
  } catch (e) {
    throw new Error(`read ${filePath} config file error: ${e}`)
  }
}

const getWebConfig = (filePath) => {
  try {
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'))
    config.inputs.region = process.env.REGION
    config.inputs.src.src = path.resolve(__dirname, '../frontend/')
    config.inputs.src.dist = path.resolve(__dirname, '../frontend/dist')
    return config
  } catch (e) {
    throw new Error(`read ${filePath} config file error: ${e}`)
  }
}

module.exports = {
  getServerlessSdk,
  getCredentials,
  getVpcYamlConfig,
  getDBConfig,
  getApiConfig,
  getWebConfig,
}
