import { URLs } from '@shared/config/url-config'
import { JSend } from '@shared/types'
import ky from 'ky'

export const addSymbol = async (symbol: string, token: string): Promise<JSend> => {
  try {
    const response = await ky
      .patch('api/Watchlist/AddSymbol', {
        prefixUrl: URLs.highwin.apiBase,
        searchParams: {
          token: token,
          symbol: symbol
        }
      })
      .json()

    return response as JSend
  } catch (error) {
    return { status: 'error', message: `操作异常: ${error}` }
  }
}

export const delSymbol = async (symbol: string, token: string): Promise<JSend> => {
  try {
    const response = await ky
      .patch('api/Watchlist/DelSymbol', {
        prefixUrl: URLs.highwin.apiBase,
        searchParams: {
          token: token,
          symbol: symbol
        }
      })
      .json()

    return response as JSend
  } catch (error) {
    return { status: 'error', message: `操作异常: ${error}` }
  }
}
