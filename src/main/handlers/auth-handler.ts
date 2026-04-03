import { ipcMain } from 'electron'
import { cacheStore } from './store-handler'
import { logoutUpms, tokenValidate } from '../api/upms-client'
import { UserInfo } from '@shared/types'
import { NavigationRoutes } from '../navigation-routes'
import { fetchWatchlist } from '../api/highwin-client'
import { closeAllTabs, openInNewTab } from '../tabs'

let tokenCheckInterval: NodeJS.Timeout | null = null

export function initAuthIpcHandlers(): void {
  // 当用户登录成功时，重新启动定时检查
  ipcMain.on('auth:login-success', (_, user: UserInfo) => {
    startTokenCheck()
    getWatchlist(user.token)
    import('../global-search').then(({ precreateSearchWindow }) => precreateSearchWindow())
    import('./menu-handler').then(({ precreateMenuWindow }) => precreateMenuWindow())
  })
}

export function getUser(): UserInfo | null {
  const user = cacheStore.get('user')
  if (!user) return null
  return user as UserInfo
}

export async function logoutApp(): Promise<void> {
  stopTokenCheck()
  const user = getUser()
  if (!user) return

  const token = user.token
  cacheStore.delete('user')
  await logoutUpms(token)
}

export async function logout(): Promise<void> {
  cacheStore.delete('user')
  stopTokenCheck()
  await logoutAllPages()
}

function startTokenCheck(): void {
  // 如果已经有定时器在运行，先清除它
  stopTokenCheck()

  // 每分钟检查一次 token
  tokenCheckInterval = setInterval(async () => {
    const user = getUser()
    if (!user) return

    const result = await tokenValidate(user.token)
    if (result.status === 'error') {
      // token 失效，清空用户信息
      cacheStore.delete('user')

      await logoutAllPages(true)
      stopTokenCheck()
    }
  }, 60000) // 60000ms = 60s
}

async function getWatchlist(token: string): Promise<void> {
  const result = await fetchWatchlist(token)
  if (result.status === 'success') {
    cacheStore.set('watchlist', result.data)
  }
}

async function logoutAllPages(kicked = false): Promise<void> {
  closeAllTabs()
  const wcv = await openInNewTab(NavigationRoutes.login)
  if (kicked) {
    wcv?.webContents.send(
      'toast',
      '您的账号异常或已在其它地点登录！为保证功能正常，请重新登录!',
      'warning'
    )
  }
}

function stopTokenCheck(): void {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval)
    tokenCheckInterval = null
  }
}
