import { shell, WebContentsView, WindowOpenHandlerResponse } from 'electron'
import { join } from 'path'
import { getBaseWindow } from './main-window'
import { NavigationRoutes } from './navigation-routes'
import { getRootUrl } from './url-helpers'

export const toolbarHeight = 35
let toolbarView: WebContentsView | null = null

/**
 * Creates and initializes the toolbar view for the main window.
 * When toolbar is done initializing, it will show the main window.
 * @returns Promise that resolves to the toolbar WebContentsView or null if creation fails
 */
export function createToolbar(): Promise<WebContentsView | null> {
  return new Promise((resolve) => {
    if (toolbarView !== null) {
      return resolve(toolbarView)
    }
    const baseWindow = getBaseWindow()
    if (baseWindow === null) {
      return resolve(null)
    }

    toolbarView = new WebContentsView({
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    toolbarView.webContents.setWindowOpenHandler((details): WindowOpenHandlerResponse => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    resizeToolbar()

    baseWindow.on('resize', (): void => {
      resizeToolbar()
    })

    toolbarView.webContents.loadURL(getRootUrl() + NavigationRoutes.toolbar)
    // toolbarView.webContents.openDevTools()

    toolbarView.webContents.on('did-finish-load', (): void => {
      return resolve(toolbarView)
    })

    toolbarView.webContents.on('did-fail-load', (): void => {
      return resolve(null)
    })
  })
}

/**
 * Returns the fixed height of the toolbar in pixels.
 * @returns number representing toolbar height
 */
export function getToolbarHeight(): number {
  return toolbarHeight
}

/**
 * Returns the current toolbar view instance.
 * @returns WebContentsView | null - The toolbar view or null if not initialized
 */
export function getToolbar(): WebContentsView | null {
  return toolbarView
}

export function resetToolbar(): void {
  toolbarView = null
}

/**
 * Resizes the toolbar to match the window width while maintaining fixed height.
 * Should be called when the window is resized to ensure toolbar fills the width.
 */
export function resizeToolbar(): void {
  const baseWindow = getBaseWindow()
  if (!baseWindow) {
    return
  }

  const newBounds = baseWindow.getContentBounds()
  if (toolbarView === null) {
    return
  }
  toolbarView.setBounds({
    x: 0,
    y: 0,
    width: newBounds.width,
    height: toolbarHeight
  })
}

export function sendToTabBar(message: string, ...args: unknown[]): void {
  toolbarView?.webContents.send(message, ...args)
}
