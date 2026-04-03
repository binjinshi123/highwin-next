import { URLs } from '@shared/config/url-config'
import { JSend } from '@shared/types'
import log from 'electron-log'
import { upmsResponseSchema } from '@shared/schemas/upms-schema'

export const tokenValidate = async (token: string): Promise<JSend> => {
  const endpoint = `${URLs.upms.apiBase}/api/user/tokenvalidity?token=${token}`
  try {
    const res = await fetch(endpoint)
    const json = await res.json()
    const parsed = upmsResponseSchema.safeParse(json)
    if (!parsed.success) {
      return { status: 'error', message: '返回数据格式错误: ' + parsed.error.message }
    }

    const rsp = parsed.data

    if (rsp.status === 1) {
      log.debug('tokenvalidity success.')
      return { status: 'success' }
    } else {
      log.warn('tokenvalidity fail', endpoint, rsp)
      return { status: 'error', message: rsp.message || '未知错误' }
    }
  } catch (error) {
    log.error('tokenvalidity error', error)
    return { status: 'error', message: `验证 token 时发生异常: ${error}` }
  }
}

export const logoutUpms = async (token: string): Promise<JSend> => {
  const endpoint = `${URLs.upms.apiBase}/api/User/logout?token=${token}`
  try {
    const res = await fetch(endpoint)
    const json = await res.json()
    const parsed = upmsResponseSchema.safeParse(json)
    if (!parsed.success) {
      return { status: 'error', message: '返回数据格式错误: ' + parsed.error.message }
    }

    const rsp = parsed.data

    if (rsp.status === 1) {
      log.info('logout successfully')
      return { status: 'success' }
    } else {
      log.warn('logout fail', rsp.message)
      return { status: 'error', message: rsp.message || '未知错误' }
    }
  } catch (error) {
    log.error('logout error', error)
    return { status: 'error', message: `登出异常: ${error}` }
  }
}
