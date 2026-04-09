import { BrowserWindow, screen } from 'electron'
import path from 'path'
import { getRootUrl } from './url-helpers'
import { NavigationRoutes } from './navigation-routes'
import { isLiveWindow } from './is-live-window'

let searchWindow: BrowserWindow | null = null

export function openSearchWindowWithKey(key: string): void {
  if (/^[a-zA-Z0-9]$/.test(key)) {
    openSearchWindow(key)
  }
}

export function openSearchWindow(key: string = ''): void {
  if (isLiveWindow(searchWindow)) {
    if (searchWindow.webContents) {
      searchWindow.show()
      searchWindow.webContents.send('set-initial-query', key)
    } else {
      console.error('searchWindow.webContents is empty')
    }
  } else {
    createSearchWindow(key)
  }
}

export function hideSearchWindow(): void {
  if (isLiveWindow(searchWindow)) {
    searchWindow.hide()
  }
}

export function disposeSearchWindow(): void {
  if (isLiveWindow(searchWindow)) {
    searchWindow.close()
  }
  searchWindow = null
}

export function precreateSearchWindow(): void {
  if (!isLiveWindow(searchWindow)) {
    createSearchWindow(undefined)
  }
}

function createSearchWindow(initialQuery?: string): void {
  // 创建搜索窗口
  searchWindow = new BrowserWindow({
    width: 400,
    height: 500,
    center: true,
    alwaysOnTop: true,
    frame: false,
    opacity: 0.95,
    resizable: false,
    roundedCorners: true,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  const url = getRootUrl() + NavigationRoutes.search
  searchWindow.loadURL(url)

  // 设置窗口位置（居中）
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  searchWindow.setPosition(Math.floor((width - 400) / 2), Math.floor((height - 500) / 2))

  // 发送初始查询
  searchWindow.webContents.on('did-finish-load', (): void => {
    if (initialQuery !== undefined) {
      searchWindow?.webContents.send('set-initial-query', initialQuery)
    }
  })

  // 监听窗口失焦事件
  searchWindow.on('blur', (): void => {
    hideSearchWindow()
  })

  // searchWindow.on('closed', () => {
  //   searchWindow = null
  // })
}
