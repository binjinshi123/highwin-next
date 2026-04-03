'use client'

declare global {
  interface Window {
    setSecurity: (security: Security) => void
  }
}

import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef, JSX } from 'react'

import BaselineChart from '@renderer/components/charts/BaselineChart'
import CandlestickChart from '@renderer/components/charts/CandlestickChart'
import IntervalSwitcher from '@renderer/components/charts/IntervalSwitcher'
import IndicatorButton from '@renderer/components/charts/IndicatorButton'
import DepthOfMarket from '@renderer/components/charts/DepthOfMarket'
import BasicInfo from '@renderer/components/charts/BasicInfo'
import { Indicator, Interval } from '@renderer/types/chart'
import {
  getSubscribeMessage,
  getQuotationType,
  toBasicData,
  toDOMData,
  toLineDataArray,
  getTradeTimes,
  toLineData,
  isKLineType,
  isMinuteType,
  toCandlestickDataArray,
  toCandlestickData,
  getTabId
} from '@renderer/lib/quoteManager'
import { itpSocket } from '@renderer/lib/signalrManager'
import { useAuthHook } from '@renderer/hooks/useAuth'
import { toFixedPrice, toPercent } from '@renderer/lib/fmt'
import * as z from 'zod/v4'
import { useMarketReset } from '@renderer/hooks/useMarketReset'
import { useChartStore } from '@renderer/store/useChartStore'
import { Security } from '@shared/types'
import { Button } from '@renderer/components/ui/button'
import { useModuleLinks } from '@renderer/hooks/useModuleLinks'
import { openInNewTab } from '@renderer/lib/utils'
import { TitleBar } from '@renderer/components/charts/TitleBar'
import { getF9Url } from '@renderer/lib/url-helper'
import { UpDownFlatBar } from '@renderer/components/up-down-flat-bar'

const symbolSearchSchema = z.object({
  symbol: z.string().default('000001.SZSE.1')
})

export const Route = createFileRoute('/_layouts/chart')({
  component: ChartComponent,
  validateSearch: (search) => symbolSearchSchema.parse(search)
})

function ChartComponent(): JSX.Element {
  const { symbol: searchSymbol } = Route.useSearch()
  console.debug(`chart render ${searchSymbol}`)

  const arr = searchSymbol.split('.')
  const symk = `${arr[0]}.${arr[1]}`
  const securityType = arr.length > 2 ? (/^\d+$/.test(arr[2]) ? Number(arr[2]) : arr[2]) : 1
  const [interval, setInterval] = useState<Interval>('1m')
  const [symbolMarket, setSymbolMarket] = useState<string>(symk)

  const setMinChartData = useChartStore((s) => s.setMinChartData)
  const updateMinChartData = useChartStore((s) => s.updateMinChartData)
  const setCandleData = useChartStore((s) => s.setCandleData)
  const updateCandleData = useChartStore((s) => s.updateCandleData)
  const setSecurityInfo = useChartStore((s) => s.setSecurityInfo)
  const setDomData = useChartStore((s) => s.setDomData)
  const setBasicData = useChartStore((s) => s.setBasicData)
  const setUpDownFlat = useChartStore((s) => s.setUpDownFlat)
  const clearChartData = useChartStore((s) => s.clearChartData)

  const onUpdateIndicatorsRef = useRef<(indicator: Indicator, checked: boolean) => void>(null)
  const symbolRef = useRef<string>(symk)
  const shortNameRef = useRef('')
  const intervalRef = useRef<Interval>('1m')
  const tickSizeRef = useRef(0.01)
  const securityTypeRef = useRef(securityType)
  const { user } = useAuthHook()
  const id = useRef(getTabId()).current
  const subscribeToken = `${user?.id}.${id}`

  const modules = useModuleLinks()

  const initIntradayTimes = async (symbol: string): Promise<void> => {
    getTradeTimes(symbol).then((tradeTimes) => {
      setMinChartData(symbol, {
        times: tradeTimes
      })
    })
  }

  useEffect(() => {
    symbolRef.current = symbolMarket
    updateTitle()
    initIntradayTimes(symbolMarket)
  }, [symbolMarket])

  useEffect(() => {
    const handleWebSocketMessage = (newData: any): void => {
      if (newData.token !== subscribeToken) {
        return
      }

      const type = newData.quotationType

      if (type === 'TickQuotationInfo') {
        const basicInfo = toBasicData(newData)

        tickSizeRef.current = basicInfo.tickSize
        setSecurityInfo({
          lcp: basicInfo.lcp,
          tickSize: basicInfo.tickSize,
          securityType: basicInfo.securityType
        })

        if (basicInfo.shortName) {
          shortNameRef.current = basicInfo.shortName
          setSecurityInfo({
            shortName: basicInfo.shortName
          })
        }

        if (basicInfo.securityType === 4) {
          setUpDownFlat({
            up: newData.data.un,
            down: newData.data.dn,
            flat: newData.data.fn
          })
        }

        setBasicData(symbolRef.current, basicInfo)
        updateTitle(basicInfo.cp, basicInfo.cr)
      } else if (type === 'FiveGearQuoteInfo') {
        setDomData(symbolRef.current, toDOMData(newData))
      } else if (isMinuteType(type)) {
        if (newData.tranParam !== `${symbolRef.current},${intervalRef.current}`) {
          console.debug(
            `tranParam: ${newData.tranParam}, current: ${symbolRef.current},${intervalRef.current}`
          )
          return
        }

        if (newData.isInit) {
          const lineDataArray = toLineDataArray(newData.data)
          setMinChartData(symbolRef.current, {
            quotes: lineDataArray
          })
        } else {
          const quote = newData.data[0]
          if (!quote) {
            console.warn(`quote is null`, quote)
          }

          const lineData = toLineData(quote)
          updateMinChartData(symbolRef.current, lineData)
        }
      } else if (isKLineType(type)) {
        if (newData.tranParam !== `${symbolRef.current},${intervalRef.current}`) {
          return
        }

        if (newData.isInit) {
          const candles = toCandlestickDataArray(newData.data)
          setCandleData(symbolRef.current, intervalRef.current, candles)
        } else {
          const quote = newData.data[0]
          if (!quote.kData) {
            console.warn(`quote.kData is null`, quote)
          }

          const candleData = toCandlestickData(quote)
          if (candleData) {
            updateCandleData(symbolRef.current, intervalRef.current, candleData)
          }
        }
      }
    }

    itpSocket.connect(() => {
      subscribeAll(symbolRef.current, interval, subscribeToken)
    })

    itpSocket.onEvent('SubscribeReturn', handleWebSocketMessage)

    return () => {
      const cleanup = async (): Promise<void> => {
        await unsubscribeAll(interval, subscribeToken)
        // await itpSocket.disconnect()
      }
      cleanup()
    }
  }, [])

  const updateTitle = (price?: number | null, cp?: number | null): void => {
    let title = shortNameRef.current || symbolRef.current.split('.')[0]
    if (price) {
      title += ` ${toFixedPrice(price, tickSizeRef.current)}`
    }
    if (cp !== null && cp !== undefined) {
      title += ` ${cp >= 0 ? '▲' : '▼'} ${toPercent(cp, true)}`
    }
    document.title = title
  }

  const subscribeAll = async (symbol: string, interval: Interval, token: string): Promise<void> => {
    const tranParam = `${symbol},${interval}`
    const p1 = itpSocket.sendMessage('Subscribe', getSubscribeMessage(symbol, interval, token))
    const p2 = itpSocket.sendMessage('Subscribe', {
      QuotationType: 'TickQuotationInfo',
      SearchParamData: {
        Symbols: symbol
      },
      token: token,
      tranParam: tranParam
    })
    const p3 = itpSocket.sendMessage('Subscribe', {
      QuotationType: 'FiveGearQuoteInfo',
      SearchParamData: {
        Symbols: symbol
      },
      token: token,
      tranParam: tranParam
    })

    await Promise.all([p1, p2, p3])
  }

  const unsubscribeAll = async (interval: Interval, token: string): Promise<void> => {
    const p1 = itpSocket.sendMessage('Unsubscribe', {
      QuotationType: getQuotationType(interval),
      token: token
    })
    const p2 = itpSocket.sendMessage('Unsubscribe', {
      QuotationType: 'TickQuotationInfo',
      token: token
    })
    const p3 = itpSocket.sendMessage('Unsubscribe', {
      QuotationType: 'FiveGearQuoteInfo',
      token: token
    })
    await Promise.all([p1, p2, p3])
  }

  window.setSecurity = async (security: Security): Promise<void> => {
    if (!security) return
    const newValue = `${security.symbol}.${security.market}`
    if (symbolRef.current === newValue) return

    setSymbolMarket(newValue)
    securityTypeRef.current = security.securityType
    shortNameRef.current = security.shortname

    await unsubscribeAll(interval, subscribeToken)
    await subscribeAll(newValue, interval, subscribeToken)
  }

  const onIntervalChanged = async (oldValue: Interval, newValue: Interval): Promise<void> => {
    if (oldValue === newValue) {
      return
    }

    setInterval(newValue)
    intervalRef.current = newValue
    await itpSocket.sendMessage('Unsubscribe', {
      QuotationType: getQuotationType(oldValue),
      token: subscribeToken
    })
    await itpSocket.sendMessage(
      'Subscribe',
      getSubscribeMessage(symbolMarket, newValue, subscribeToken)
    )
  }

  const onUpdateIndicator = (callback: (indicator: Indicator, checked: boolean) => void): void => {
    onUpdateIndicatorsRef.current = callback
  }

  function onCheckStateChange(indicator: Indicator, checked: boolean): void {
    if (onUpdateIndicatorsRef.current) {
      onUpdateIndicatorsRef.current(indicator, checked)
    }
  }

  function openF9(): void {
    const f9Url = getF9Url(
      modules.F9.url,
      symbolRef.current,
      shortNameRef.current,
      securityTypeRef.current
    )
    openInNewTab(f9Url)
  }

  useMarketReset(() => {
    console.info('market reset: chart page')
    setSecurityInfo({ lcp: null })
    clearChartData(symbolRef.current)
    setCandleData(symbolRef.current, intervalRef.current, [])
    initIntradayTimes(symbolRef.current)
    itpSocket.connect(() => {
      subscribeAll(symbolRef.current, intervalRef.current, subscribeToken)
    })
  })

  useMarketReset(
    () => {
      const interval = intervalRef.current
      if (interval === '1W' || interval === '1M') {
        itpSocket.sendMessage(
          'Subscribe',
          getSubscribeMessage(symbolRef.current, interval, subscribeToken)
        )
      }
    },
    9,
    25
  )

  return (
    <main className="h-screen flex flex-col overflow-y-hidden">
      <div className="h-[38px] flex items-center text-sm gap-1 ps-2">
        <IntervalSwitcher interval={interval} onChanged={onIntervalChanged} />
        {interval !== '1m' && <IndicatorButton onCheckStateChange={onCheckStateChange} />}
        <Button variant="link" onClick={openF9}>
          F9
        </Button>
      </div>
      <div className="flex-auto flex px-1">
        <div className="flex-auto">
          {interval === '1m' ? (
            <BaselineChart symbol={symbolMarket} />
          ) : (
            <CandlestickChart
              symbol={symbolMarket}
              interval={interval}
              onIndicatorUpdate={onUpdateIndicator}
            />
          )}
        </div>
        {/* 盘口、基本信息  */}
        <div className="w-64 flex-none">
          <div className="flex flex-col gap-1">
            <TitleBar symbol={symbolMarket} />
            <UpDownFlatBar />
            <DepthOfMarket symbol={symbolMarket} />
            <BasicInfo symbol={symbolMarket} />
          </div>
        </div>
      </div>
    </main>
  )
}
