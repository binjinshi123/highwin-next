import { ipcMain, webContents } from 'electron'
import Store from 'electron-store'
import { NavigationRoutes } from '../navigation-routes'

export const cacheStore = new Store({ name: 'cache' })
const subscriptions = new Map()

export function initStoreIpcHandlers(): void {
  ipcMain.on('get-store', async (event, val) => {
    event.returnValue = cacheStore.get(val)
  })
  ipcMain.on('set-store', async (_, key, val) => {
    cacheStore.set(key, val)
  })

  ipcMain.on('subscribe-store', async (_, key) => {
    const unsubscribeFn = cacheStore.onDidChange(key, (newValue: unknown) => {
      sendToAll(`onChange:${key}`, newValue)
    })
    subscriptions.set(key, unsubscribeFn)
  })

  ipcMain.on('unsubscribe-store', async (_, key) => {
    subscriptions.get(key)?.()
  })
}

export const sendToAll = (channel: string, msg?: unknown): void => {
  const wcs = webContents.getAllWebContents()
  wcs.forEach((wc) => {
    const currentUrl = wc.getURL()
    if (currentUrl != NavigationRoutes.toolbar) {
      wc.send(channel, msg)
    }
  })
}
