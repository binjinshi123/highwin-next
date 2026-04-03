import { createSyncedStore } from './useSyncedStore'
import { getSecretId } from '@renderer/api/llm-client'
import { useEffect, useState } from 'react'
import { JSend, UserInfo } from '@shared/types'
import { getExpireDate, loginUpms } from '@renderer/api/upms-client'

const key = 'user'

const useAuthStore = createSyncedStore({
  storageKey: key,
  defaultValue: null
})

export const useAuthHook = () => {
  const storeUser = useAuthStore()
  const [user, setUser] = useState<UserInfo | null>(storeUser)

  useEffect(() => {
    setUser(storeUser)
  }, [storeUser])

  const isAuthed = user != null

  const login = async (username: string, password: string): Promise<JSend> => {
    const [response, secretId, expireDate] = await Promise.all([
      loginUpms(username, password),
      getSecretId(username),
      getExpireDate(username)
    ])

    // 登录失败
    if (response.status !== 'success') {
      return {
        status: response.status,
        message: response.message
      }
    }

    const jsend: JSend = {
      status: response.status,
      message: response.message
    }
    let isExpired = false

    if (expireDate) {
      const dt = new Date(expireDate)
      const now = new Date()
      dt.setHours(0, 0, 0, 0)
      now.setHours(0, 0, 0, 0)

      if (dt < now) {
        isExpired = true
      } else {
        const diffTime = dt.getTime() - now.getTime()
        const diffInDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
        // 登录成功，但账号有效期小于30天
        if (diffInDays < 30) {
          jsend.message = `您的账号将于${dt.toLocaleDateString()}到期，请及时联系销售或客服进行账号续期。`
        }
      }
    } else {
      // 未获取到角色到期日
      isExpired = true
    }

    if (isExpired) {
      jsend.status = 'error'
      jsend.message = '无终端权限或权限已到期'
    } else {
      const retUser = { ...response.data, secretId, expireDate }
      jsend.data = retUser
      setUser(retUser)
      setSafely(key, retUser)
      window.electron.ipcRenderer.send('auth:login-success', retUser)
    }

    return jsend
  }

  const setSafely = (key: string, value: any): Promise<void> => {
    return new Promise<void>((resolve) => {
      window.app?.store?.set(key, value)
      // 监听 store 更新完成
      const unsubscribe = window.app?.store?.subscribe(key, () => {
        unsubscribe()
        resolve()
      })
    })
  }

  return {
    user,
    isAuthed,
    login
  }
}
