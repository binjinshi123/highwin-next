import { ipcRenderer } from 'electron'

export const tabsAPI = {
  new: (): Promise<number> => ipcRenderer.invoke('tabs:new'),
  close: (id: number): Promise<void> => ipcRenderer.invoke('tabs:close', id),
  select: (id: number): Promise<void> => ipcRenderer.invoke('tabs:select', id),
  getAllTabIds: (): Promise<number[]> => ipcRenderer.invoke('tabs:getAllTabIds'),
  getSelectedTabId: (): Promise<number> => ipcRenderer.invoke('tabs:getSelectedTabId'),
  reorder: (tabIds: number[]): Promise<void> => ipcRenderer.invoke('tabs:reorder', tabIds),
  onTitleUpdated: (callback: (tabId: number, title: string) => void): void => {
    ipcRenderer.on('tabs:on-update-title', (_event: unknown, tabId: number, title: string) =>
      callback(tabId, title)
    )
  },
  openInNewTab: (url: string, title?: string): void =>
    ipcRenderer.send('tabs:open-in-new-tab', url, title),
  onOpenInNewTab: (callback: (id: number, url: string, title?: string) => void): void => {
    ipcRenderer.on(
      'tabs:on-open-in-new-tab',
      (_event: unknown, id: number, url: string, title?: string) => callback(id, url, title)
    )
  },
  onCloseAll: (callback: () => void): void => {
    ipcRenderer.on('tabs:on-close-all', () => callback())
  }
}
