import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { tabsAPI } from './tabs'
import { navAPI } from './nav'
import { appAPI } from './app'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('tabs', tabsAPI)
    contextBridge.exposeInMainWorld('nav', navAPI)
    contextBridge.exposeInMainWorld('app', appAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
}
