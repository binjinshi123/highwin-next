import { HwSecurity, PlateType } from '@shared/types'
import { ipcRenderer } from 'electron'

export const appAPI = {
  showMenu: () => ipcRenderer.invoke('menu:show'),
  showProfile: () => ipcRenderer.invoke('show-profile'),
  reloadCurrentPage: () => ipcRenderer.invoke('tabs:reload-selected'),
  logout: () => ipcRenderer.invoke('user:logout'),
  getWebContentsId: (): number => ipcRenderer.sendSync('get-webcontents-id'),
  showSearch: () => ipcRenderer.send('show-search'),
  getVersion: () => ipcRenderer.invoke('get-version'),
  store: {
    get(key: string): unknown {
      return ipcRenderer.sendSync('get-store', key)
    },
    set(property: string, val: unknown): void {
      ipcRenderer.send('set-store', property, val)
    },
    subscribe(key: string, func: (...args: unknown[]) => void): () => void {
      ipcRenderer.send('subscribe-store', key)
      const subscription = (_event: unknown, ...args: unknown[]): void => func(...args)
      const channelName = `onChange:${key}`
      ipcRenderer.on(channelName, subscription)

      return (): void => {
        ipcRenderer.removeListener(channelName, subscription)
      }
    },
    unsubscribe(key: string): void {
      ipcRenderer.send('unsubscribe-store', key)
    }
  },
  open: (module: string, urlSearchParams?: string): void =>
    ipcRenderer.send('menu:open-item', module, urlSearchParams),
  search: (query: string, types: PlateType[]): Promise<HwSecurity[]> =>
    ipcRenderer.invoke('search-securities', query, types),
  onToast: (callback: (message: string, type?: string) => void): void => {
    ipcRenderer.on('toast', (_: unknown, message: string, title?: string) =>
      callback(message, title)
    )
  }
}
