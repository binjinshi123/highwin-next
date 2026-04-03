import { URLs } from '@shared/config/url-config'

const useTo = 'HIGHWIN'

/**
 * 获取大模型调用 SecretId
 * @param userId
 * @param userName
 * @returns
 */
export async function getSecretId(userName: string): Promise<string> {
  const endpoint = `${URLs.llm.apiBase}/api/GraphService/querysecret?loginName=${userName}&Userto=${useTo}`
  try {
    const response = await fetch(endpoint)
    const result = await response.json()

    if (result.status === '200') {
      const secrets = result.result.userSecrets
      const secretId = secrets.find((secret: any) => secret.Useto === useTo)?.SecretValue
      return secretId
    } else {
      console.info('error get secretId', result)
      return createSecretId(userName)
    }
  } catch (error) {
    console.error(error)
    return ''
  }
}

async function createSecretId(userName: string): Promise<string> {
  const endpoint = `${URLs.llm.apiBase}/api/GraphService/createsecretbyloginname?loginName=${userName}&Userto=${useTo}`

  try {
    const response = await fetch(endpoint)
    const result = await response.json()
    return result.result
  } catch (error) {
    console.error(error)
    return ''
  }
}
