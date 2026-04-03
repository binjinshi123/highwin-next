import { ipcMain } from 'electron'
import { goBack, goForward, canGoBack, canGoForward, getHistory, loadURL } from '../nav'

export const initNavIpcHandlers = (): void => {
  ipcMain.handle('nav:back', () => goBack())
  ipcMain.handle('nav:forward', () => goForward())
  ipcMain.handle('nav:canGoBack', () => canGoBack())
  ipcMain.handle('nav:canGoForward', () => canGoForward())
  ipcMain.handle('nav:getHistory', () => getHistory())
  ipcMain.handle('nav:loadURL', (_, url) => loadURL(url))
}
