import { ipcRenderer } from 'electron'

export const navAPI = {
  goBack: (): Promise<unknown> => ipcRenderer.invoke('nav:back'),
  goForward: (): Promise<unknown> => ipcRenderer.invoke('nav:forward'),
  canGoBack: (): Promise<boolean> => ipcRenderer.invoke('nav:canGoBack'),
  canGoForward: (): Promise<boolean> => ipcRenderer.invoke('nav:canGoForward'),
  getCurrentURL: (): Promise<string> => ipcRenderer.invoke('nav:getCurrentURL'),
  getHistory: (): Promise<unknown> => ipcRenderer.invoke('nav:getHistory'),
  onNavigationUpdate: (callback: () => void): void => {
    ipcRenderer.on('nav:updated', callback)
  }
}
