import { HwSecurity, PlateType } from '@shared/types'
import { app, ipcMain, IpcMainEvent } from 'electron'
import { searchSecurities } from '../api/itp-client'
import { openSearchWindow } from '../global-search'
import { registerSecuritySelectHandler } from './hotkey-handler'

export const initAppIpcHandlers = (): void => {
  ipcMain.on('get-webcontents-id', (event) => {
    event.returnValue = event.sender.id
  })

  ipcMain.handle(
    'search-securities',
    (_event, query: string, types: PlateType[]): Promise<HwSecurity[]> => {
      return searchSecurities(query, types)
    }
  )

  ipcMain.on('show-search', (event: IpcMainEvent) => {
    openSearchWindow()
    const wc = event.sender
    registerSecuritySelectHandler(wc)
  })

  ipcMain.handle('get-version', (): string => {
    return app.getVersion()
  })
}
