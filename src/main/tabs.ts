import { WebContentsView } from 'electron'
import { join } from 'path'
import { getBaseWindow } from './main-window'
import { NavigationRoutes } from './navigation-routes'
import { getSelected, getTabs, setSelected, setTabs } from './tabs-store'
import { getToolbarHeight, resizeToolbar, sendToTabBar } from './toolbar'
import { getRootUrl } from './url-helpers'
import { setupHotkey } from './handlers/hotkey-handler'
import { getFooterHeight, resizeFooter } from './footer'

const tabs: WebContentsView[] = []
let selectedTab: WebContentsView | null = null

/**
 * Creates and loads a new tab with the root URL.
 * @returns The ID of the new tab's web contents, or -1 if creation failed
 */
export async function addNewTab(): Promise<number> {
  const mainWindow = getBaseWindow()
  if (mainWindow === null) {
    return -1
  }

  // load new content here
  const address = NavigationRoutes.root
  const newTab = await loadTabContent(address, { bringToFront: true })
  if (newTab === null) return -1
  return newTab.webContents.id
}

export async function openInNewTab(url: string, title?: string): Promise<WebContentsView | null> {
  const mainWindow = getBaseWindow()
  if (mainWindow === null) {
    return null
  }

  // load new content here
  const address = url ?? NavigationRoutes.root
  const webContentView = newWebContentsView()
  const id = webContentView.webContents.id

  sendToTabBar('tabs:on-open-in-new-tab', id, url, title)

  await loadTabContent(address, { bringToFront: true }, webContentView)
  return webContentView
}

/**
 * Creates a new tab and loads the specified path asynchronously.
 * @param path The application route path to load
 * @returns Promise resolving to the WebContentView or null if loading failed
 */
export function loadTabContent(
  path: string,
  { bringToFront = false }: { bringToFront?: boolean } = {},
  wcv: WebContentsView | null = null
): Promise<WebContentsView | null> {
  return new Promise((resolve) => {
    // let url = getRootUrl() + path
    // const url = path.startsWith('http') ? path : getRootUrl() + path
    // const url = path === '/' ? getRootUrl() + path : path
    const url = isLocalPage(path) ? getLocalUrl(path) : path
    const baseWindow = getBaseWindow()
    if (baseWindow === null) return resolve(null)

    const newContentView = wcv ?? newWebContentsView()
    const wc = newContentView.webContents

    wc.on('did-finish-load', () => {
      saveTabs()
      resolve(newContentView)
    })

    wc.on('did-fail-load', () => {
      resolve(null)
    })

    wc.on('page-title-updated', (_, title) => {
      if (title === 'Index' || title === '红楹数据终端') return
      console.debug('page-title-updated:', title)
      sendToTabBar('tabs:on-update-title', wc.id, title)
    })

    wc.setWindowOpenHandler((details) => {
      openInNewTab(details.url)
      return { action: 'deny' }
    })

    setupHotkey(wc)

    wc.on('did-navigate', (_, url) => {
      console.debug('did-navigate', url)
      sendToTabBar('nav:updated')
    })

    wc.on('did-navigate-in-page', (_, url) => {
      console.debug('did-navigate-in-page', url)
      sendToTabBar('nav:updated')
    })

    tabs.push(newContentView)

    if (bringToFront) {
      showContent(newContentView)
    }

    wc.loadURL(url)
    console.debug('loadTabContent from', url)
  })
}

function newWebContentsView(): WebContentsView {
  return new WebContentsView({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
}

/**
 * Displays a WebContentView in the main window and sets it as the active tab.
 * @param webContentsView The WebContentView to display
 */
export function showContent(webContentsView: WebContentsView): void {
  const baseWindow = getBaseWindow()
  if (!baseWindow) {
    return
  }

  setBounds(webContentsView)

  baseWindow.removeAllListeners('resize')

  baseWindow.on('resize', () => {
    const tabs = getAllTabs()
    for (const tab of tabs) {
      setBounds(tab)
    }
    resizeToolbar()
    resizeFooter()
  })

  selectedTab = webContentsView

  baseWindow.contentView.addChildView(webContentsView)
}

const setBounds = (wcv: WebContentsView): void => {
  const baseWindow = getBaseWindow()
  if (!baseWindow) {
    return
  }
  const newBounds = baseWindow.getContentBounds()
  wcv.setBounds({
    x: 0,
    y: getToolbarHeight(),
    width: newBounds.width,
    height: newBounds.height - getToolbarHeight() - getFooterHeight()
  })
}

/**
 * Closes a specific tab and removes it from the application.
 * @param id The ID of the tab to close
 */
export function closeTab(id: number): void {
  const idx = tabs.findIndex((tab) => tab.webContents.id === id)
  if (idx === -1) {
    return
  }
  const baseWindow = getBaseWindow()
  if (baseWindow) {
    baseWindow.contentView.removeChildView(tabs[idx])
  }
  tabs[idx].webContents.close()
  tabs.splice(idx, 1)
  saveTabs()
}

/**
 * Temporarily hides a tab from view without destroying it.
 * @param id The ID of the tab to hide
 */
export function hideTab(id: number): void {
  const tab = tabs.find((tab) => tab.webContents.id === id)
  if (tab == null) {
    return
  }
  const baseWindow = getBaseWindow()
  if (baseWindow === null) {
    return
  }
  baseWindow.contentView.removeChildView(tab)
}

/**
 * Closes all open tabs.
 * @param options Optional configuration object
 * @param options.save Whether to save the tabs state before closing (default: true)
 */
export function closeAllTabs(): void {
  for (const tab of tabs) {
    tab.webContents.close()
  }

  tabs.splice(0, tabs.length)
  saveTabs()

  sendToTabBar('tabs:on-close-all')
}

/**
 * Retrieves a tab by its ID.
 * @param id The ID of the tab to find
 * @returns The WebContentView if found, undefined otherwise
 */
export function getTab(id: number): WebContentsView | undefined {
  return tabs.find((tab) => tab.webContents.id === id)
}

/**
 * Gets all currently open tabs.
 * @returns Array of all WebContentsViews
 */
export function getAllTabs(): WebContentsView[] {
  return tabs
}

/**
 * Gets the IDs of all open tabs.
 * @returns Array of tab IDs
 */
export function getAllTabIds(): number[] {
  if (tabs.length === 0) {
    return []
  }
  const ids = tabs.map((tab) => tab.webContents.id)
  return ids
}

/**
 * Gets the currently selected tab.
 * @returns The active WebContentsView or null if none selected
 */
export function getSelectedTab(): WebContentsView | null {
  return selectedTab
}

export function resetTabsState(): void {
  for (const tab of tabs) {
    try {
      if (!tab.webContents.isDestroyed()) {
        tab.webContents.close()
      }
    } catch {
      // ignore cleanup errors during window teardown
    }
  }
  tabs.splice(0, tabs.length)
  selectedTab = null
}

/**
 * Reloads the currently selected tab.
 */
export function reloadSelectedTab(): void {
  selectedTab?.webContents?.reload()
}

/**
 * Changes the selected tab.
 * @param id The ID of the tab to select
 */
export function setSelectedTab(id: number): void {
  if (selectedTab) {
    if (selectedTab.webContents === undefined || id === selectedTab.webContents.id) {
      return
    }
  }
  const idx = tabs.findIndex((tab) => tab.webContents.id === id)
  if (idx === -1) {
    return
  }
  showContent(tabs[idx])
  saveSelectedTab({ tabIndex: idx })
}

/**
 * Saves the currently selected tab index to storage.
 * @param options Optional configuration object
 * @param options.tabIndex Specific tab index to save as selected
 */
function saveSelectedTab({ tabIndex = -1 }: { tabIndex?: number } = {}): void {
  if (tabIndex !== -1) {
    setSelected(tabIndex)
    return
  }

  if (selectedTab === null) {
    return
  }
  const idx = tabs.findIndex((tab) => {
    if (selectedTab === null) return false
    return tab.webContents.id === selectedTab!.webContents.id
  })
  if (idx === -1) {
    return
  }
  setSelected(idx)
}

/**
 * Gets the ID of the currently selected tab.
 * @returns The ID of the selected tab, or -1 if none selected
 */
export function getSelectedTabId(): number {
  if (selectedTab === null) return -1
  return selectedTab.webContents.id
}

/**
 * Reorders tabs based on an array of tab IDs.
 * @param ids Array of tab IDs in the desired order
 */
export function reorderTabs(ids: number[]): void {
  const newTabs = ids
    .map((id) => tabs.find((tab) => tab.webContents.id === id))
    .filter((tab): tab is WebContentsView => tab !== undefined)
  if (newTabs.length === 0) return
  tabs.splice(0, tabs.length, ...newTabs)
  saveTabs()
  saveSelectedTab()
}

/**
 * Saves the current tabs state to storage.
 */
export function saveTabs(): void {
  const mainWindow = getBaseWindow()
  if (mainWindow === null) {
    return
  }
  const tabUrls = tabs.map((tab) => {
    const url = tab.webContents.getURL()
    const rootUrl = getBaseUrl()

    if (url.startsWith(rootUrl)) {
      const idx = url.indexOf('#')
      return idx === -1 ? '/' : url.substring(idx + 1)
    } else {
      return url
    }
  })

  setTabs(tabUrls)
}

function getBaseUrl(): string {
  const rootUrl = getRootUrl()
  const idx = rootUrl.indexOf('#')
  return idx === -1 ? rootUrl : rootUrl.substring(0, idx)
}

function isLocalPage(url: string): boolean {
  const baseUrl = getBaseUrl()
  return url.startsWith('/') || url.startsWith(baseUrl)
}

function getLocalUrl(path: string): string {
  const rootUrl = getRootUrl()
  return path.startsWith('/') ? rootUrl + path : path
}

/**
 * Restores tabs from the previous session.
 * @param options Optional configuration object
 * @param options.restore Whether to restore previous session tabs (default: true)
 * @returns Promise resolving to the selected tab's WebContentsView or null
 */
export async function restoreTabs({
  restore = true
}: {
  restore?: boolean
} = {}): Promise<WebContentsView | null> {
  if (!restore) {
    return loadTabContent(NavigationRoutes.login)
  }

  const lastSessionTabs = getTabs()
  let selectedTabIndex = getSelected()

  if (lastSessionTabs !== null && lastSessionTabs.length > 0) {
    if (selectedTabIndex < 0 || selectedTabIndex >= lastSessionTabs.length) {
      selectedTabIndex = 0
    }

    for (let i = 0; i < lastSessionTabs.length; i++) {
      if (i === selectedTabIndex) {
        selectedTab = await loadTabContent(lastSessionTabs[i])
        continue
      }
      loadTabContent(lastSessionTabs[i])
    }
  }

  if (selectedTab === null) {
    selectedTab = await loadTabContent(NavigationRoutes.root)
  }

  return selectedTab
}
