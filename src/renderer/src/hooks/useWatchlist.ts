import { useAuthHook } from './useAuth'
import { addSymbol, delSymbol } from '@renderer/api/highwin-client'
import { createSyncedStore } from './useSyncedStore'
import { JSend } from '@shared/types'

const maxCount = 200

export const useWatchlistStore = createSyncedStore({
  storageKey: 'watchlist',
  defaultValue: []
})

interface UseWatchlistResult {
  symbols: string[]
  exists: (symbol: string) => boolean
  canAdd: () => boolean
  maxCount: number
  add: (symbol: string) => Promise<JSend>
  del: (symbol: string) => Promise<JSend>
}

export const useWatchlist = (): UseWatchlistResult => {
  const { user } = useAuthHook()
  const symbols = useWatchlistStore()

  const exists = (symbol: string): boolean => {
    return symbols.includes(symbol)
  }

  const canAdd = (): boolean => {
    return symbols.length < maxCount
  }

  const add = async (symbol: string): Promise<JSend> => {
    if (!user?.token) return { status: 'fail', message: '请先登录' }
    try {
      const result = await addSymbol(symbol, user.token)
      if (result.status === 'success') {
        window.app.store.set('watchlist', result.data)
      }
      return result
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    }
  }

  const del = async (symbol: string): Promise<JSend> => {
    if (!user?.token) return { status: 'fail', message: '请先登录' }

    try {
      const result = await delSymbol(symbol, user.token)
      if (result.status === 'success') {
        window.app.store.set('watchlist', result.data)
      }
      return result
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    }
  }

  return {
    symbols,
    exists,
    canAdd,
    maxCount,
    add,
    del
  }
}
