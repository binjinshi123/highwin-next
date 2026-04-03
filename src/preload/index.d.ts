import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    tabs: ITabsAPI
    nav: INavAPI
    app: IAppAPI
  }
}

export interface ITabsAPI {
  new: () => Promise<number>
  close: (id: number) => Promise<void>
  select: (id: number) => Promise<void>
  reorder: (tabIds: number[]) => Promise<void>
  getAllTabIds: () => Promise<number[]>
  getSelectedTabId: () => Promise<number>
  onTitleUpdated: (callback: (tabId: number, title: string) => void) => void
  openInNewTab: (url: string, title?: string) => Promise<number>
  onOpenInNewTab: (callback: (id: number, url: string, title?: string) => void) => void
  onCloseAll: (callback: () => void) => Promise<void>
}

export interface INavAPI {
  goBack: () => Promise<void>
  goForward: () => Promise<void>
  canGoBack: () => Promise<boolean>
  canGoForward: () => Promise<boolean>
  getHistory: () => Promise<void>
  onNavigationUpdate: (callback) => void
}

export interface IStoreAPI {
  get: (key: string) => any
  set: (property: string, val: any) => void
  subscribe: (key: string, func: (...args: any[]) => void) => () => void
  unsubscribe: (key: string) => void
}

export interface IAppAPI {
  showMenu: () => Promise<void>
  showProfile: () => Promise<void>
  reloadCurrentPage: () => Promise<void>
  showSearch: () => void
  logout: () => Promise<void>
  onToast: (callback: (message: string, type?: string) => void) => void
  getWebContentsId: () => number
  getVersion: () => Promise<string>
  open: (module: string, urlSearchParams?: string) => void
  search: (query: string, type: PlateType[]) => Promise<HwSecurity[]>
  store: IStoreAPI
}
