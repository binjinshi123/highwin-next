import { ipcMain } from 'electron'
import {
  addNewTab,
  closeTab,
  getAllTabIds,
  reloadSelectedTab,
  getSelectedTabId,
  openInNewTab,
  reorderTabs,
  setSelectedTab
} from '../tabs'

export const initTabsIpcHandlers = (): void => {
  ipcMain.handle('tabs:new', () => addNewTab())
  ipcMain.on('tabs:open-in-new-tab', (_, url: string, title?: string) => openInNewTab(url, title))
  ipcMain.handle('tabs:select', (_, id: number) => setSelectedTab(id))
  ipcMain.handle('tabs:getAllTabIds', () => getAllTabIds())
  ipcMain.handle('tabs:getSelectedTabId', () => getSelectedTabId())
  ipcMain.handle('tabs:reload-selected', () => reloadSelectedTab())
  ipcMain.handle('tabs:close', (_, id: number) => closeTab(id))
  ipcMain.handle('tabs:reorder', (_, tabIds: number[]) => reorderTabs(tabIds))
}
