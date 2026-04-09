import { ipcMain, BrowserWindow, BaseWindow } from 'electron'
import { join } from 'node:path'
import { getRootUrl } from '../url-helpers'
import { NavigationRoutes } from '../navigation-routes'
import { getUser, logout } from './auth-handler'
import { getToolbarHeight } from '../toolbar'

let profileWindow: BrowserWindow | null

function hasLiveProfileWindow(): boolean {
  return !!profileWindow && !profileWindow.isDestroyed()
}

export const initProfileIpcHandlers = (): void => {
  ipcMain.handle('show-profile', () => {
    const user = getUser()
    if (!user) return
    if (hasLiveProfileWindow()) {
      showWindow()
      return
    }
    createWindow()
  })
  ipcMain.handle('user:logout', () => {
    disposeWindow()
    logout()
  })
}

export function disposeWindow(): void {
  if (hasLiveProfileWindow()) {
    profileWindow!.close()
  }
  profileWindow = null
}

function createWindow(): void {
  profileWindow = new BrowserWindow({
    width: 200,
    height: 230,
    alwaysOnTop: true,
    frame: false,
    opacity: 0.95,
    resizable: false,
    roundedCorners: true,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  const url = getRootUrl() + NavigationRoutes.profile
  profileWindow.loadURL(url)

  // 点击窗口外部时关闭
  profileWindow.on('blur', () => {
    disposeWindow()
  })

  showWindow()
}

function showWindow(): void {
  const mainWindow = BaseWindow.getFocusedWindow()
  if (!mainWindow) return

  const mainBounds = mainWindow.getContentBounds()
  const profileWidth = 200
  const menuX = mainBounds.x + mainBounds.width - profileWidth - 100
  const menuY = mainBounds.y + getToolbarHeight() + 2

  profileWindow?.setPosition(Math.floor(menuX), Math.floor(menuY))

  profileWindow?.show()
}
