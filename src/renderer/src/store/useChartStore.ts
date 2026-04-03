import { create } from 'zustand'
import {
  DepthOfMarketData,
  BasicData,
  StatusLineData,
  MinChartData,
  LineTooltipProps,
  SecurityInfo,
  TooltipProps,
  MinQuote,
  Interval,
  Indicator,
  IndicatorCheckState,
  UpDownFlatData
} from '@renderer/types/chart'
import { CandlestickData, LineData, UTCTimestamp } from 'lightweight-charts'
import { getISOWeek } from '@renderer/lib/utils'

interface ChartDataState {
  securityInfo: SecurityInfo | null
  minChartDataMap: Record<string, MinChartData>
  candleDataMap: Record<string, Record<string, CandlestickData<UTCTimestamp>[]>>
  domDataMap: Record<string, DepthOfMarketData>
  basicDataMap: Record<string, BasicData>
  upDownFlatData: UpDownFlatData
  statusLineDataMap: Record<string, StatusLineData>
  lineTooltipDataMap: Record<string, LineTooltipProps>
  candleTooltipDataMap: Record<string, TooltipProps | null>
  indicatorState: Record<Indicator, IndicatorCheckState>
  setSecurityInfo: (data: Partial<SecurityInfo>) => void
  setMinChartData: (symbol: string, data: Partial<MinChartData>) => void
  updateMinChartData: (symbol: string, data: LineData<UTCTimestamp>) => void
  setCandleData: (symbol: string, interval: Interval, data: CandlestickData<UTCTimestamp>[]) => void
  updateCandleData: (
    symbol: string,
    interval: Interval,
    data: CandlestickData<UTCTimestamp>
  ) => void
  setDomData: (symbol: string, data: DepthOfMarketData) => void
  setBasicData: (symbol: string, data: BasicData) => void
  setUpDownFlat: (data: UpDownFlatData) => void
  setStatusLineData: (id: string, data: StatusLineData) => void
  setLineTooltipData: (id: string, data: LineTooltipProps) => void
  setCandleTooltipData: (id: string, data: TooltipProps | null) => void
  setIndicatorState: (indicator: Indicator, checked: boolean) => void
  clearChartData: (symbol: string) => void
  clearAll: () => void
}

export const useChartStore = create<ChartDataState>((set) => ({
  securityInfo: null,
  minChartDataMap: {},
  candleDataMap: {},
  domDataMap: {},
  basicDataMap: {},
  upDownFlatData: { up: 0, down: 0, flat: 0 },
  statusLineDataMap: {},
  lineTooltipDataMap: {},
  candleTooltipDataMap: {},
  indicatorState: {
    VOL: { label: '成交量', checked: true, disabled: true },
    MACD: { label: 'MACD', checked: false },
    KDJ: { label: 'KDJ', checked: false },
    RSI: { label: 'RSI', checked: false }
  },
  setSecurityInfo: (data) =>
    set((state) => {
      const prev = state.securityInfo || ({} as SecurityInfo)
      return {
        securityInfo: { ...prev, ...data } as SecurityInfo
      }
    }),
  setMinChartData: (symbol, minChartData) => {
    set((state) => {
      const prev = state.minChartDataMap[symbol] || ({ times: [], quotes: [] } as MinChartData)

      const times = minChartData.times ?? prev.times

      let quotes = prev.quotes
      if (minChartData.quotes && minChartData.quotes.length > 0) {
        quotes = minChartData.quotes
      }

      // 2.2 snapshot.quotes 或 prev.quotes 有值时，补齐 quotes 的时间
      let mergedQuotes = quotes

      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const isMarketOpen = currentMinutes >= 9 * 60 + 6

      // 09:06 前打开，不使用 times，直接返回 quotes
      if (isMarketOpen && times.length > 0) {
        if (quotes && quotes.length > 0) {
          const quoteMap = new Map<number, MinQuote>()
          quotes.forEach((q) => quoteMap.set(q.time as number, q))
          mergedQuotes = times.map((time) => quoteMap.get(time) || ({ time } as MinQuote))
        } else {
          mergedQuotes = times.map((time) => ({ time }) as MinQuote)
        }
      }

      return {
        minChartDataMap: {
          ...state.minChartDataMap,
          [symbol]: {
            ...prev,
            ...minChartData,
            times,
            quotes: mergedQuotes
          } as MinChartData
        }
      }
    })
  },
  updateMinChartData: (symbol, quote) =>
    set((state) => {
      const prev = state.minChartDataMap[symbol]
      if (!prev) return state // 没有快照时不处理

      // 找到对应 time 的索引
      const idx = prev.quotes.findIndex((q) => q.time === quote.time)
      let quotes = prev.quotes

      if (idx !== -1) {
        // 用新 quote 替换对应时间点
        quotes = [...quotes.slice(0, idx), quote, ...quotes.slice(idx + 1)]
      } else {
        // 如果没找到，说明是新时间点（极少见），可以选择忽略或追加
        quotes = [...quotes, quote]
      }

      return {
        minChartDataMap: {
          ...state.minChartDataMap,
          [symbol]: { ...prev, quotes }
        }
      }
    }),
  setCandleData: (symbol, interval, data) =>
    set((state) => ({
      candleDataMap: {
        ...state.candleDataMap,
        [symbol]: {
          ...(state.candleDataMap[symbol] || {}),
          [interval]: data
        }
      }
    })),
  updateCandleData: (symbol, interval, data) =>
    set((state) => {
      const prev = state.candleDataMap[symbol]?.[interval] || []
      let idx = -1

      if (interval === '1W') {
        // Compare if dates are in the same week
        idx = prev.findIndex((item) => {
          const itemDate = new Date(item.time * 1000)
          const dataDate = new Date(data.time * 1000)
          return (
            itemDate.getFullYear() === dataDate.getFullYear() &&
            getISOWeek(itemDate) === getISOWeek(dataDate)
          )
        })
      } else if (interval === '1M') {
        // Compare if dates are in the same month
        idx = prev.findIndex((item) => {
          const itemDate = new Date(item.time * 1000)
          const dataDate = new Date(data.time * 1000)
          return (
            itemDate.getFullYear() === dataDate.getFullYear() &&
            itemDate.getMonth() === dataDate.getMonth()
          )
        })
      } else {
        // For 1d, 5m, 30m, 60m - exact time match
        idx = prev.findIndex((item) => item.time === data.time)
      }

      let newArr
      if (idx !== -1) {
        // 更新已有数据
        newArr = [...prev.slice(0, idx), data, ...prev.slice(idx + 1)]
      } else {
        // 追加新数据
        newArr = [...prev, data]
      }
      return {
        candleDataMap: {
          ...state.candleDataMap,
          [symbol]: {
            ...(state.candleDataMap[symbol] || {}),
            [interval]: newArr
          }
        }
      }
    }),
  setDomData: (symbol, data) =>
    set((state) => ({
      domDataMap: { ...state.domDataMap, [symbol]: data }
    })),
  setUpDownFlat: (data: UpDownFlatData) => {
    set(() => ({
      upDownFlatData: data
    }))
  },
  setBasicData: (symbol, data) =>
    set((state) => ({
      basicDataMap: { ...state.basicDataMap, [symbol]: data }
    })),
  setStatusLineData: (id, data) =>
    set((state) => ({
      statusLineDataMap: { ...state.statusLineDataMap, [id]: data }
    })),
  setLineTooltipData: (id, data) =>
    set((state) => ({
      lineTooltipDataMap: { ...state.lineTooltipDataMap, [id]: data }
    })),
  setCandleTooltipData: (id, data) =>
    set((state) => ({
      candleTooltipDataMap: { ...state.candleTooltipDataMap, [id]: data }
    })),
  setIndicatorState: (indicator: Indicator, checked: boolean) => {
    set((state) => ({
      indicatorState: {
        ...state.indicatorState,
        [indicator]: { ...state.indicatorState[indicator], checked }
      }
    }))
  },
  clearChartData: (symbol) =>
    set((state) => {
      // Remove symbol from minChartDataMap
      const minChartDataMap = { ...state.minChartDataMap }
      delete minChartDataMap[symbol]
      // Remove symbol from domDataMap
      const domDataMap = { ...state.domDataMap }
      delete domDataMap[symbol]
      // Remove symbol from basicDataMap
      const basicDataMap = { ...state.basicDataMap }
      delete basicDataMap[symbol]
      return { minChartDataMap, domDataMap, basicDataMap }
    }),
  clearAll: () => set({ domDataMap: {}, basicDataMap: {} })
}))
