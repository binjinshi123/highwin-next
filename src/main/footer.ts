import { shell, WebContentsView, WindowOpenHandlerResponse } from 'electron'
import { join } from 'path'
import { getBaseWindow } from './main-window'
import { NavigationRoutes } from './navigation-routes'
import { getRootUrl } from './url-helpers'

export const footerHeight = 40
let footerView: WebContentsView | null = null

/**
 * Creates and initializes the footer view for the main window.
 * When footer is done initializing, it will show the main window.
 * @returns Promise that resolves to the footer WebContentsView or null if creation fails
 */
export function createFooter(): Promise<WebContentsView | null> {
  return new Promise((resolve) => {
    if (footerView !== null) {
      return resolve(footerView)
    }
    const baseWindow = getBaseWindow()
    if (baseWindow === null) {
      return resolve(null)
    }

    footerView = new WebContentsView({
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    footerView.webContents.setWindowOpenHandler((details): WindowOpenHandlerResponse => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    resizeFooter()

    baseWindow.on('resize', (): void => {
      resizeFooter()
    })

    footerView.webContents.loadURL(getRootUrl() + NavigationRoutes.footer)
    // footerView.webContents.openDevTools()

    footerView.webContents.on('did-finish-load', (): void => {
      return resolve(footerView)
    })

    footerView.webContents.on('did-fail-load', (): void => {
      return resolve(null)
    })
  })
}

/**
 * Returns the fixed height of the footer in pixels.
 * @returns number representing footer height
 */
export function getFooterHeight(): number {
  return footerHeight
}

/**
 * Returns the current footer view instance.
 * @returns WebContentsView | null - The footer view or null if not initialized
 */
export function getFooter(): WebContentsView | null {
  return footerView
}

export function resetFooter(): void {
  footerView = null
}

/**
 * Resizes the footer to match the window width while maintaining fixed height.
 * Should be called when the window is resized to ensure footer fills the width.
 */
export function resizeFooter(): void {
  const baseWindow = getBaseWindow()
  if (!baseWindow) {
    return
  }

  const newBounds = baseWindow.getContentBounds()
  if (footerView === null) {
    return
  }
  footerView.setBounds({
    x: 0,
    y: newBounds.height - footerHeight,
    width: newBounds.width,
    height: footerHeight
  })
}

export function sendToFooter(message: string, ...args: unknown[]): void {
  footerView?.webContents.send(message, ...args)
}
