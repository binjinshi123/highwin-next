import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'
import { getBaseWindow, initializeMainWindow } from './main-window'
import path from 'node:path'
import { openInNewTab } from './tabs'
import { convertDeeplink } from './url-helpers'
import { initIpcHandlers } from './handler'
import log from 'electron-log/main'

// If you build your own menu or use a frameless window without native menu,
// you should tell Electron early enough to not setup the default menu.
// https://www.electronjs.org/docs/latest/tutorial/performance#8-call-menusetapplicationmenunull-when-you-do-not-need-a-default-menu
Menu.setApplicationMenu(null)

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('highwin', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('highwin')
}

// 如果有其他实例在运行，则退出当前实例
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_, commandLine) => {
    // 当第二个实例试图打开时，聚焦到第一个实例的窗口
    const mainWindow = getBaseWindow()
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    // the commandLine is array of strings in which last element is deep link url
    const deepLinkUrl = commandLine.pop()
    if (deepLinkUrl) {
      const localUrl = convertDeeplink(deepLinkUrl)
      if (localUrl) {
        openInNewTab(localUrl)
      }
    }
  })

  app.commandLine.appendSwitch('lang', 'zh-CN')

  app.whenReady().then(() => {
    autoUpdater.checkForUpdatesAndNotify()
    electronApp.setAppUserModelId('com.highwin')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    initIpcHandlers()
    initializeMainWindow()
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  log.initialize()
}
