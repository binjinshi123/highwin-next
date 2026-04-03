import { URLs } from '@shared/config/url-config'
import { JSend } from '@shared/types'

export const fetchWatchlist = async (token: string): Promise<JSend> => {
  const api = `${URLs.highwin.apiBase}/api/Watchlist/GetSymbols?token=${token}`
  try {
    const response = await fetch(api)
    if (response.ok) {
      const symbols = await response.json()
      return { status: 'success', data: symbols }
    } else {
      const result = await response.text()
      console.error(result)
      return { status: 'error', message: result }
    }
  } catch (error) {
    console.error(error)
    return {
      status: 'error',
      message: error instanceof Error ? error.message : '获取自选股异常'
    }
  }
}
