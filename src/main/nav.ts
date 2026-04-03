import { NavigationHistory } from 'electron'
import { getSelectedTab } from './tabs'

export const goBack = (): void => getNavigationHistory()?.goBack()

export const goForward = (): void => getNavigationHistory()?.goForward()

export const canGoBack = (): boolean | undefined => getNavigationHistory()?.canGoBack()

export const canGoForward = (): boolean | undefined => getNavigationHistory()?.canGoForward()

export const getHistory = (): unknown => getNavigationHistory()?.getAllEntries()

export const loadURL = (url: string): void => {
  const tab = getSelectedTab()
  tab?.webContents?.loadURL(url)
}

const getNavigationHistory = (): NavigationHistory | undefined => {
  const tab = getSelectedTab()
  return tab?.webContents?.navigationHistory
}
