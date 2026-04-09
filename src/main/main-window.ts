import { is } from '@electron-toolkit/utils'
import { app, BaseWindow, ipcMain } from 'electron'
import icon from '../../resources/icon.ico?asset'
import { resetTabsState, restoreTabs, showContent } from './tabs'
import { createToolbar, resetToolbar, toolbarHeight } from './toolbar'
import { disposeSearchWindow } from './global-search'
import { disposeMenuWindow } from './handlers/menu-handler'
import { logoutApp } from './handlers/auth-handler'
import { createFooter, resetFooter } from './footer'

let baseWindow: BaseWindow | null = null
let currentTheme = 'light'
let appHandlersRegistered = false

function hasLiveWindow(): boolean {
  return !!baseWindow && !baseWindow.isDestroyed()
}

function updateTitleBarOverlay(theme: 'light' | 'dark'): void {
  if (process.platform !== 'win32') return
  if (!hasLiveWindow()) return
  const hasTitleBarOverlay =
    typeof (baseWindow as unknown as { setTitleBarOverlay?: unknown }).setTitleBarOverlay === 'function'

  if (!hasTitleBarOverlay) return

  ;(baseWindow as unknown as {
    setTitleBarOverlay: (options: { color: string; symbolColor: string }) => void
  }).setTitleBarOverlay({
    color: theme === 'dark' ? '#171717' : '#f9fafb',
    symbolColor: theme === 'dark' ? '#e5e5e5' : '#333'
  })
}

/**
 * Initializes the main application window with a splash screen.
 * Creates the window, configures settings, loads toolbar and content,
 * checks for updates, handles authentication, and restores previous window state.
 * Must only be called once during application startup.
 */
export async function initializeMainWindow(): Promise<void> {
  const isMac = process.platform === 'darwin'
  const isWindows = process.platform === 'win32'

  baseWindow = new BaseWindow({
    width: 1200,
    minWidth: 600,
    height: 800,
    minHeight: 400,
    show: false,
    frame: !isMac,
    ...(isMac
      ? {
          titleBarStyle: 'hiddenInset' as const,
          trafficLightPosition: {
            x: 20,
            y: 9
          }
        }
      : {
          titleBarStyle: 'hidden' as const,
          ...(isWindows
            ? {
                titleBarOverlay: {
                  color: '#f9fafb',
                  height: toolbarHeight
                }
              }
            : {})
        }),
    backgroundColor: '#fff',
    icon: icon
  })

  // Set the main window, Must be called here before any other functions.
  setupMainWindowEventHandlers()

  const [toolbar, mainContent, footer] = await Promise.all([
    createToolbar(),
    restoreTabs({ restore: false }), // 红楹前端页面跳转后丢失 token，所以暂时不保存
    createFooter()
  ])

  if (mainContent === null || toolbar === null) {
    console.error('Failed to load toolbar or mainContent')
    return
  }

  baseWindow.contentView.addChildView(toolbar!)
  baseWindow.contentView.addChildView(mainContent)
  baseWindow.contentView.addChildView(footer!)

  showContent(mainContent)
  mainContent.webContents.focus()

  showWindow()
}

/**
 * Configures event handlers for window resizing, movement, and application lifecycle events.
 * Handles window state persistence and platform-specific behaviors (Mac/Windows).
 * @param baseWindow - The main application window instance
 */
function setupMainWindowEventHandlers(): void {
  if (!appHandlersRegistered) {
    appHandlersRegistered = true
    app.on('activate', async () => {
      if (!hasLiveWindow()) {
        await initializeMainWindow()
        return
      }
      showWindow()
    })

    let isLoggingOut = false

    app.on('before-quit', async (event: Electron.Event) => {
      if (!isLoggingOut) {
        event.preventDefault()
        isLoggingOut = true
        // saveTabs()
        await logoutApp()
        app.quit()
      }
    })

    app.on('will-quit', () => {
      console.log('app will-quit')
    })

    app.on('quit', () => {
      console.log('app quit')
    })

    ipcMain.on('theme-changed', (_event, theme: 'light' | 'dark') => {
      if (!hasLiveWindow()) return
      const win = baseWindow!
      currentTheme = theme
      const isDarkTheme = theme === 'dark'
      win.setBackgroundColor(isDarkTheme ? '#171717' : '#fff')
      updateTitleBarOverlay(theme)
    })
  }

  baseWindow?.on('closed', () => {
    disposeSearchWindow()
    disposeMenuWindow()
    resetTabsState()
    resetToolbar()
    resetFooter()
    baseWindow = null
  })
}

/**
 * Returns the main application window instance.
 * @returns The main BaseWindow instance or null if not initialized
 */
export function getBaseWindow(): BaseWindow | null {
  return baseWindow
}

export function getCurrentTheme(): string {
  return currentTheme
}

/**
 * Shows the main application window.
 * Handles different behavior for development and production environments.
 */
export function showWindow(): void {
  if (!hasLiveWindow()) {
    return
  }
  const win = baseWindow!

  //? This is to prevent the window from gaining focus everytime we make a change in code.
  if (!is.dev && !process.env['ELECTRON_RENDERER_URL']) {
    win.show()
    return
  }

  if (!win.isVisible()) {
    win.show()
  }
}
