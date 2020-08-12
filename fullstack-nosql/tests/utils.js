const { ServerlessSDK } = require('@serverless/platform-client-china')
require('dotenv').config()
const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
/*
 * Initializes and returns an instance of the serverless sdk
 * @param ${string} orgName - the serverless org name.
 */
const getServerlessSdk = (orgName) => {
  const sdk = new ServerlessSDK({
    skipRoleBinding: true,
    context: {
      orgName,
    },
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

const getDBConfig = (filePath) => {
  try {
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'))
    return config
  } catch (e) {
    throw new Error(`read ${filePath} config file error: ${e}`)
  }
}

const getApiConfig = (filePath) => {
  try {
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'))
    config.inputs.name = config.name
    config.inputs.src = path.resolve(__dirname, '../backend/src/')
    config.inputs.region = process.env.REGION
    config.inputs.environment.variables.SecretId = process.env.SecretId
    config.inputs.environment.variables.SecretKey = process.env.SecretKey
    return config
  } catch (e) {
    throw new Error(`read ${filePath} config file error: ${e}`)
  }
}

const getWebConfig = (filePath) => {
  try {
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'))
    config.inputs.region = process.env.REGION
    config.inputs.src.src = path.resolve(__dirname, '../frontend/src/')
    return config
  } catch (e) {
    throw new Error(`read ${filePath} config file error: ${e}`)
  }
}

module.exports = {
  getServerlessSdk,
  getCredentials,
  getDBConfig,
  getApiConfig,
  getWebConfig,
}
