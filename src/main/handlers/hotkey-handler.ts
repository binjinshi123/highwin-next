import { ipcMain, WebContents } from 'electron'
import { platform } from '@electron-toolkit/utils'
import { openSearchWindowWithKey, hideSearchWindow } from '../global-search'
import { openInNewTab } from '../tabs'
import { Security } from '@shared/types'
import { getUser } from './auth-handler'
import { toTypeId } from '@shared/security-utils'

export function setupHotkey(wc: WebContents): void {
  wc.on('before-input-event', async (event, input) => {
    beforeInputHandler(wc, event, input)
  })
}

const beforeInputHandler = async (
  wc: WebContents,
  event: Electron.Event,
  input: Electron.Input
): Promise<void> => {
  if (input.key === 'F12') {
    console.debug('Pressed F12')
    event.preventDefault()
    wc.toggleDevTools()
    return
  }

  if (input.key === 'F5') {
    event.preventDefault()
    wc.reload()
    return
  }

  if (/^[a-zA-Z0-9]$/.test(input.key) && !input.control && !input.meta && !input.alt && getUser()) {
    const hasFocusedInput = await wc.executeJavaScript(`
            document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA' ||
            document.activeElement.isContentEditable
          `)
    if (!hasFocusedInput) {
      event.preventDefault()
      openSearchWindowWithKey(input.key)
      registerSecuritySelectHandler(wc)
    }
  }

  // Windows/Linux 用户习惯使用 Alt + 方向键 进行导航
  // macOS 用户习惯使用 Command (⌘) + 方向键 进行导航
  if (platform.isWindows || platform.isLinux) {
    if (input.alt && input.key === 'ArrowLeft') {
      event.preventDefault()
      wc.navigationHistory.goBack()
    } else if (input.alt && input.key === 'ArrowRight') {
      event.preventDefault()
      wc.navigationHistory.goForward()
    }
  } else if (platform.isMacOS) {
    if (input.meta && input.key === 'ArrowLeft') {
      event.preventDefault()
      wc.navigationHistory.goBack()
    } else if (input.meta && input.key === 'ArrowRight') {
      event.preventDefault()
      wc.navigationHistory.goForward()
    }
  }
}

export const registerSecuritySelectHandler = (wc: WebContents): void => {
  const channel = 'on-security-select'
  const handler = (_: unknown, s: Security): Promise<void> => onSecuritySelect(wc, s)
  ipcMain.removeAllListeners(channel)
  ipcMain.on(channel, handler)
}

const onSecuritySelect = async (wc: WebContents, s: Security): Promise<void> => {
  if (wc.isDestroyed()) {
    console.log('onSecuritySelect | wc is destroyed')
    return
  }

  const hasSetSecurity = await wc.executeJavaScript(`typeof setSecurity === 'function'`)
  const hasRefSymbol = await wc.executeJavaScript(`typeof RefSymbol === 'function'`)
  const appSymbol = `${s.symbol}.${s.market}.${s.securityType}`

  if (hasSetSecurity) {
    wc.executeJavaScript(`setSecurity(${JSON.stringify(s)})`)
  } else if (hasRefSymbol) {
    const typeId = toTypeId(s.securityType)
    const hwSymbol = `${s.symbol}.${s.market}.${s.shortname}.${typeId}`
    wc.executeJavaScript(`Symbol = '${hwSymbol}';RefSymbol();`)
  } else {
    openInNewTab(`/chart?symbol=${appSymbol}`)
  }

  hideSearchWindow()
  wc.focus()
}
