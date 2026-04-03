import { is } from '@electron-toolkit/utils'
import path from 'path'
import url from 'url'
import { NavigationRoutes } from './navigation-routes'

export function getRootUrl(): string {
  // Must add a # because we are using hash routing.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    return process.env['ELECTRON_RENDERER_URL']! + '/#'
  } else {
    return (
      url.format({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file:',
        slashes: true
      }) + '#'
    )
  }
}

export function getBaseUrl(): string {
  const rootUrl = getRootUrl()
  const idx = rootUrl.indexOf('#')
  return idx === -1 ? rootUrl : rootUrl.substring(0, idx)
}

export function isLocalPage(url: string): boolean {
  const baseUrl = getBaseUrl()
  return url.startsWith('/') || url.startsWith(baseUrl)
}

export function getLocalUrl(path: string): string {
  const rootUrl = getRootUrl()
  return path.startsWith('/') ? rootUrl + path : path
}

export function convertDeeplink(url: string): string | null {
  // 将 highwin://chart/ 转为 /chart
  // 将 highwin://chart?symbol=000002.SZSE 转为 /chart?symbol=000002.SZSE
  // 将 highwin://list/ 转为 /list
  // 其他情况返回空字符串
  try {
    const u = new URL(url)
    if (u.protocol !== 'highwin:') return null

    // 兼容 highwin://chart/ highwin://chart?symbol=xxx highwin://list/
    if ((u.host === 'chart' || u.host === 'list') && (u.pathname === '/' || u.pathname === '')) {
      return `/${u.host}${u.search}`
    }

    // 兼容 highwin://chart highwin://list
    if (
      (u.pathname === NavigationRoutes.chart || u.pathname === NavigationRoutes.list) &&
      !u.host
    ) {
      return `${u.pathname}${u.search}`
    }

    return null
  } catch (err) {
    console.error(err)
    return null
  }
}
