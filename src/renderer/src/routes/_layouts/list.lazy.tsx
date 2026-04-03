'use client'

import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layouts/list')({
  component: QuoteList
})

import { defaultPagination } from '@renderer/components/list/data-table'
import { useEffect, useState, useRef, useCallback, JSX } from 'react'
import { itpSocket } from '@renderer/lib/signalrManager'
import { PlateTabs } from '@renderer/components/list/data-table-tabs'
import { defaultPlate } from '@renderer/config/plate-config'
import { SortingState, Updater } from '@tanstack/react-table'
import { useMarketReset } from '@renderer/hooks/useMarketReset'
import { useAuthHook } from '@renderer/hooks/useAuth'
import { useTableStore } from '@renderer/store/useTableStore'
import { QuotelistTable } from '@renderer/components/list/data-table-wrapper'
import { getTabId } from '@renderer/lib/quoteManager'
import { getColumnsByType } from '@renderer/components/list/columns'
import { Plate, Security } from '@shared/types'

document.title = '行情列表'

export default function QuoteList(): JSX.Element {
  const { user } = useAuthHook()
  const id = useRef(getTabId()).current
  const subscribeToken = `${user?.id}.${id}`
  const [plate, setPlate] = useState<Plate>(defaultPlate)
  const [pagination, setPagination] = useState(defaultPagination)
  const [sorting, setSorting] = useState<SortingState>([])
  const [industryId, setIndustryId] = useState<number | undefined>(undefined)
  const [filterSecurity, setFilterSecurity] = useState<Security | undefined>(undefined)

  const initializeData = useTableStore((s) => s.initialize)
  const patchData = useTableStore((s) => s.patch)
  const clearData = useTableStore((s) => s.clear)
  const setRowCount = useTableStore((s) => s.setRowCount)

  const isInitialRender = useRef(true)
  const tranParamRef = useRef('')

  const getSortParam = (sorting: SortingState): { orderBy: string; sort: number } => {
    if (!sorting || sorting.length === 0) {
      return { orderBy: '', sort: 0 } // 默认值：无排序
    }

    const { id, desc } = sorting[0]

    return {
      orderBy: id, // 排序字段
      sort: desc ? 1 : 2 // 1: 降序, 2: 升序
    }
  }

  const subscribe = useCallback(() => {
    clearData()
    const { orderBy, sort } = getSortParam(sorting)
    const tranParam = `${plate.id},${pagination.pageIndex + 1},${pagination.pageSize},${orderBy},${sort}`
    tranParamRef.current = tranParam
    const message = {
      token: subscribeToken,
      QuotationType: 'TickQuotationcs',
      SearchParamData: {
        PageIndex: pagination.pageIndex + 1, // 后台 PageIndex 从 1 开始
        PageSize: pagination.pageSize,
        OrderBy: orderBy,
        Sortord: sort,
        PlateId: plate.id,
        IndustryId: industryId ?? null,
        SecurityId: filterSecurity?.securityid ?? 0
      },
      tranParam: tranParam
    }
    itpSocket.sendMessage('Subscribe', message)
  }, [subscribeToken, plate.id, pagination, sorting, industryId, filterSecurity])

  const unsubscribe = useCallback(async () => {
    await itpSocket.sendMessage('UnSubscribe', {
      token: subscribeToken,
      QuotationType: 'TickQuotationcs'
    })
  }, [subscribeToken])

  useEffect(() => {
    const handleSubscribeReturn = (response: any): void => {
      if (response.quotationType !== 'TickQuotationcs') {
        return
      }

      if (response.tranParam !== tranParamRef.current) {
        console.debug('tranParam not match', response.tranParam, tranParamRef.current)
        return
      }

      if (response.isInit) {
        const innerData = response.data
        initializeData(innerData.data)
        setRowCount(innerData.totalItemsCount)
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
  }, [plate, pagination, sorting, subscribe, unsubscribe, industryId, filterSecurity])

  useMarketReset(() => {
    console.info('market reset: list page')
    itpSocket.connect(() => {
      subscribe()
    })
  })

  const onPlateChanged = (newPlate: Plate): void => {
    // 清空标的过滤条件
    setFilterSecurity(undefined)

    // 非股票板块清空行业过滤条件
    if (newPlate.type !== 'stock') {
      setIndustryId(undefined)
    }

    // 如果新板块不显示排序列，移除排序
    const newColumns = getColumnsByType(newPlate.type)
    if (sorting.length > 0) {
      const sortId = sorting[0].id
      const index = newColumns.findIndex((col) => col.id === sortId)
      if (index === -1) {
        setSorting([])
      }
    }

    setPlate(newPlate)
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0
    }))
  }

  const onIndustryChange = (newValue: number | undefined): void => {
    setIndustryId(newValue)
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0
    }))
  }

  const onSortingChange = (updater: Updater<SortingState>): void => {
    setSorting(updater)
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0
    }))
  }

  return (
    <div className="h-screen flex flex-col justify-stretch gap-1 overflow-hidden py-1">
      <PlateTabs
        selectedPlate={plate}
        industryId={industryId}
        onIndustryChange={onIndustryChange}
        onPlateChange={onPlateChanged}
        security={filterSecurity}
        onSecurityChange={setFilterSecurity}
      />
      <QuotelistTable
        plate={plate}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSortingChange={onSortingChange}
        className="flex-1"
      />
    </div>
  )
}
