const { ServerlessSDK } = require('@serverless/platform-client-china')
require('dotenv').config()

/*
 * Generate random id
 */
const generateId = () => Math.random().toString(36).substring(6)

/*
 * Initializes and returns an instance of the serverless sdk
 * @param ${string} orgName - the serverless org name.
 */
const getServerlessSdk = (orgName) => {
  const sdk = new ServerlessSDK({
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
module.exports = { generateId, getServerlessSdk, getCredentials }
