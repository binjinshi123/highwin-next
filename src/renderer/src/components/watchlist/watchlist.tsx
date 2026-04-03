import { defaultPagination } from '@renderer/components/list/data-table'
import { useEffect, useState, useRef, useCallback, useMemo, JSX } from 'react'
import { itpSocket } from '@renderer/lib/signalrManager'
import { useMarketReset } from '@renderer/hooks/useMarketReset'
import { useAuthHook } from '@renderer/hooks/useAuth'
import { useWatchlist } from '@renderer/hooks/useWatchlist'
import { useTableStore } from '@renderer/store/useTableStore'
import { WatchlistTable } from './watchlist-table'
import { getTabId } from '@renderer/lib/quoteManager'

export default function Watchlist(): JSX.Element {
  document.title = '自选股'

  const { user } = useAuthHook()
  const { symbols } = useWatchlist()

  // L1分笔数据
  const initializeData = useTableStore((s) => s.initialize)
  const patchData = useTableStore((s) => s.patch)
  const clearData = useTableStore((s) => s.clear)
  const setRowCount = useTableStore((s) => s.setRowCount)

  const id = useRef(getTabId()).current
  const subscribeToken = `${user?.id}.${id}`

  const [pagination, setPagination] = useState(defaultPagination)
  const isInitialRender = useRef(true)
  const tranParamRef = useRef('')

  setRowCount(symbols.length)
  const totalPage: number = Math.ceil(symbols.length / pagination.pageSize)
  if (pagination.pageIndex >= totalPage) {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(totalPage - 1, 0)
    }))
  }

  const currentPageSymbols = useMemo(() => {
    return symbols?.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    )
  }, [symbols, pagination])

  const subscribe = useCallback(async (): Promise<void> => {
    if (!user) {
      console.warn('token is empty')
      return
    }

    if (currentPageSymbols.length === 0) {
      console.debug('symbols is empty')
      return
    }

    clearData()
    const tranParam = `${pagination.pageIndex + 1},${pagination.pageSize}`
    tranParamRef.current = tranParam
    await itpSocket.sendMessage('Subscribe', {
      token: subscribeToken,
      QuotationType: 'TickQuotationcs',
      SearchParamData: {
        PageIndex: pagination.pageIndex + 1, // 后台 PageIndex 从 1 开始
        PageSize: pagination.pageSize,
        Symbols: currentPageSymbols.join(',')
      },
      tranParam: tranParam
    })
  }, [user, symbols, pagination])

  const unsubscribe = async (): Promise<void> => {
    if (!user) return
    await itpSocket.sendMessage('UnSubscribe', {
      token: subscribeToken,
      QuotationType: 'TickQuotationcs'
    })
  }

  useEffect(() => {
    const handleSubscribeReturn = (response: any): void => {
      if (response.quotationType !== 'TickQuotationcs') {
        return
      }

      if (response.tranParam !== tranParamRef.current) {
        console.debug(`tranParam not match: ${response.tranParam} != ${tranParamRef.current}`)
        return
      }

      if (response.isInit) {
        const innerData = response.data
        initializeData(innerData.data)
      } else {
        const l1Tick = response.data.data[0]
        patchData(l1Tick)
      }
    }

    itpSocket.connect(() => {
      subscribe()
    })

    itpSocket.onEvent('SubscribeReturn', handleSubscribeReturn)

    return () => {
      const cleanup = async (): Promise<void> => {
        await unsubscribe()
        // await itpSocket.disconnect()
      }
      cleanup()
    }
  }, [])

  const resubscribe = async (): Promise<void> => {
    await unsubscribe()
    await subscribe()
  }

  useEffect(() => {
    if (isInitialRender.current) {
      // 跳过初始化时的执行
      isInitialRender.current = false
      return
    }
    resubscribe()
  }, [pagination, subscribe, unsubscribe])

  useMarketReset(() => {
    console.info('market reset: list page')
    itpSocket.connect(() => {
      subscribe()
    })
  })

  return (
    <div className="h-screen flex flex-col justify-stretch gap-1 overflow-hidden py-1">
      <WatchlistTable pagination={pagination} onPaginationChange={setPagination} />
    </div>
  )
}
