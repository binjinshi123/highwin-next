import { ipcMain } from 'electron'
import { URLs } from '@shared/config/url-config'
import { initAuthIpcHandlers } from './handlers/auth-handler'
import { initMenuIpcHandlers } from './handlers/menu-handler'
import { initNavIpcHandlers } from './handlers/nav-handler'
import { initProfileIpcHandlers } from './handlers/profile-handler'
import { initStoreIpcHandlers } from './handlers/store-handler'
import { initTabsIpcHandlers } from './handlers/tabs-handler'
import { initAppIpcHandlers } from './handlers/app-handler'

export function initIpcHandlers() {
  // 兼容多种环境：优先使用全局 fetch，其次尝试 undici/node-fetch
  let fetchFn: any = (globalThis as any).fetch
  if (!fetchFn) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      fetchFn = require('undici').fetch
    } catch {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        fetchFn = require('node-fetch')
      } catch {
        fetchFn = undefined
      }
    }
  }

  ipcMain.handle('upms-get-parent-role', async (_, loginName: string) => {
    if (!fetchFn) throw new Error('No fetch available in main process')
    const url = `${URLs.llm.apiBase}/api/User/getparentuserrole?loginName=${encodeURIComponent(
      loginName
    )}`
    const res = await fetchFn(url)
    // 处理返回值：优先 JSON，否则文本
    const contentType = res.headers?.get?.('content-type') ?? ''
    if (contentType.includes('application/json')) return res.json()
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  })

  initAppIpcHandlers()
  initAuthIpcHandlers()
  initMenuIpcHandlers()
  initNavIpcHandlers()
  initProfileIpcHandlers()
  initStoreIpcHandlers()
  initTabsIpcHandlers()
}
