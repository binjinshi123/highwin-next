import {
  loginResponseSchema,
  RoleResponse,
  roleResponseSchema,
  UserResponse
} from '@renderer/schemas/upms-schema'
import { URLs } from '@shared/config/url-config'
import { JSend } from '@shared/types'
import log from 'electron-log/renderer'
import ky from 'ky'

export const loginUpms = async (username: string, password: string): Promise<JSend> => {
  try {
    const json = await ky('api/User/login', {
      prefixUrl: URLs.upms.apiBase,
      searchParams: {
        name: username,
        password: password,
        applicationMark: '20'
      }
    }).json()
    const parsed = loginResponseSchema.safeParse(json)

    if (!parsed.success) {
      return { status: 'error', message: '返回数据格式错误: ' + parsed.error.message }
    }

    const rsp: UserResponse = parsed.data

    if (rsp.status === 1 && rsp.result) {
      return { status: 'success', data: rsp.result }
    } else {
      return { status: 'error', message: rsp.message || '未知错误' }
    }
  } catch (error) {
    return { status: 'error', message: `登录异常: ${error}` }
  }
}

export const getExpireDate = async (username: string): Promise<string | undefined> => {
  try {
    const json = await ky('api/User/getparentuserrole', {
      prefixUrl: URLs.upms.apiBase,
      searchParams: {
        loginName: username
      }
    }).json()
    const parsed = roleResponseSchema.safeParse(json)

    if (!parsed.success) {
      log.error('获取账号有效期失败，返回数据格式错误: ' + parsed.error.message)
      return undefined
    }

    const rsp: RoleResponse = parsed.data

    if (rsp.status === 1) {
      const targetRole = rsp.result?.find((x) => x.RoleName === '红楹金融终端-基础用户')
      return targetRole?.EndTime
    } else {
      log.error('获取账号有效期失败，错误: ' + rsp.message)
      return undefined
    }
  } catch (error) {
    log.error('获取账号有效期异常，异常: ' + error)
    return undefined
  }
}
