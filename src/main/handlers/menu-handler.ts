import { ipcMain, BrowserWindow, BaseWindow } from 'electron'
import { join } from 'node:path'
import { openInNewTab } from '../tabs'
import { getRootUrl } from '../url-helpers'
import { NavigationRoutes } from '../navigation-routes'
import { getUser } from './auth-handler'
import { highwinUrlMap } from '@shared/config/highwin-urls'
import { URLs } from '@shared/config/url-config'
import { getCurrentTheme } from '../main-window'
import { getToolbarHeight } from '../toolbar'

let menuWindow: BrowserWindow | null

export const initMenuIpcHandlers = (): void => {
  ipcMain.handle('menu:show', () => {
    const user = getUser()
    if (!user) return

    if (menuWindow) {
      showMenuWindow()
    } else {
      createMenuWindow()
    }
  })

  ipcMain.handle('menu:onclick', (_: unknown, url: string, title: string) => {
    openInNewTab(url, title)
    setTimeout(() => {
      menuWindow?.hide()
    }, 500)
  })

  ipcMain.on('menu:open-item', (event, module, urlSearchParams) => {
    console.log('open', module, urlSearchParams)
    openMenuItem(event, module, urlSearchParams)
  })
}

export function disposeMenuWindow(): void {
  menuWindow?.close()
  menuWindow = null
}

export function precreateMenuWindow(): void {
  if (!menuWindow) {
    createMenuWindow()
  }
}

function createMenuWindow(): void {
  menuWindow = new BrowserWindow({
    width: 600,
    height: 300,
    alwaysOnTop: true,
    frame: false,
    opacity: 0.95,
    resizable: false,
    roundedCorners: true,
    show: false,
    skipTaskbar: true,
    // useContentSize: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  const url = getRootUrl() + NavigationRoutes.menu
  menuWindow.loadURL(url)

  // 点击窗口外部时关闭
  menuWindow.on('blur', () => {
    menuWindow?.hide()
  })
}

function showMenuWindow(): void {
  const mainWindow = BaseWindow.getFocusedWindow()
  if (!mainWindow) return

  const mainBounds = mainWindow.getContentBounds()
  const menuX = mainBounds.x + 1
  const menuY = mainBounds.y + getToolbarHeight()

  menuWindow?.setPosition(Math.floor(menuX), Math.floor(menuY))

  menuWindow?.show()
}

function toChartParams(urlSearchParams: string): string {
  let symbolParams: string = ''
  if (urlSearchParams) {
    const spObj = new URLSearchParams(urlSearchParams)
    if (spObj.has('symbol')) {
      const symbolString = spObj.get('symbol')!
      const array = symbolString.split('.')
      if (array.length > 1) {
        symbolParams = `?symbol=${array[0]}.${array[1]}.${array.length > 3 ? array[3] : 1}`
      }
    }
  }
  return symbolParams
}

function openMenuItem(event: Electron.IpcMainEvent, module: string, urlSearchParams: string): void {
  if (module === '图表分析') {
    const chartUrl = NavigationRoutes.chart + toChartParams(urlSearchParams)
    openInNewTab(chartUrl)
    return
  }

  if (!highwinUrlMap.has(module)) {
    event.sender.executeJavaScript('alert("不支持的模块")')
    return
  }

  const url = highwinUrlMap.get(module)!
  const fullUrl = URLs.highwin.webBase + url
  const urlObj = new URL(fullUrl)
  const sp = urlObj.searchParams

  // 参数中的 urlSearchParams
  if (urlSearchParams) {
    const outerSp = new URLSearchParams(urlSearchParams)
    for (const [key, value] of outerSp) {
      sp.set(key, value)
    }
  }

  // 设置 token 和 secretId
  const user = getUser()
  sp.set('token', user?.token ?? '')
  sp.set('theme', getCurrentTheme())
  if (sp.has('secretId')) {
    sp.set('secretId', user?.secretId ?? '')
  }

  const finalUrl = urlObj.toString()
  openInNewTab(finalUrl)
}
