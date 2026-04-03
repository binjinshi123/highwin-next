import { Interval, MinQuote } from '@renderer/types/chart'
import { L1Min, KLineData } from '@renderer/types/quote'
import { LineData, CandlestickData, HistogramData, UTCTimestamp } from 'lightweight-charts'
import { getTradeMinutes } from '../api/itp-client'
import { upColor, downColor, upColorVOL, downColorVOL } from '../config/chart-config'
import { BasicData, DepthOfMarketData } from '@renderer/types/chart'
import Big from 'big.js'
import { nanoid } from 'nanoid'
import { SubscribeMsg } from '@renderer/types/quote'

export function getTabId(): string {
  return window.app?.getWebContentsId().toString() ?? nanoid()
}

export function getSubscribeMessage(
  symbol: string,
  interval: Interval,
  token: string
): SubscribeMsg {
  return {
    QuotationType: getQuotationType(interval),
    token: token,
    SearchParamData: [
      {
        Symbol: symbol
      }
    ],
    tranParam: `${symbol},${interval}`,
    Limit: 1000
  }
}

export const getIntervalText = (interval: Interval): string => {
  switch (interval) {
    case '1m':
      return '分时'
    case '1D':
      return '日K'
    case '1W':
      return '周K'
    case '1M':
      return '月K'
    case '1Y':
      return '年K'
    case '5m':
      return '5分'
    case '30m':
      return '30分'
    case '60m':
      return '60分'
    default:
      throw new Error(`Unsupported interval: ${interval}`)
  }
}

/** 分时图行情 */
export function isMinuteType(type: string): boolean {
  return type === 'L1MinQuotation'
}

/** K线图行情 */
export function isKLineType(type: string): boolean {
  return (
    type === 'DayKlineQuotation' ||
    type === 'WeekKlineQuotation' ||
    type === 'MonthKlineQuotation' ||
    type === 'YearKlineQuotation' ||
    type === 'KLineMin5Quotation' ||
    type === 'KLineMin30Quotation' ||
    type === 'KLineMin60Quotation'
  )
}

export function getQuotationType(interval: Interval): string {
  switch (interval) {
    case '1m':
      return 'L1MinQuotation'
    case '1D':
      return 'DayKlineQuotation'
    case '1W':
      return 'WeekKlineQuotation'
    case '1M':
      return 'MonthKlineQuotation'
    case '1Y':
      return 'YearKlineQuotation'
    case '5m':
      return 'KLineMin5Quotation'
    case '30m':
      return 'KLineMin30Quotation'
    case '60m':
      return 'KLineMin60Quotation'
    default:
      throw new Error(`Unsupported interval: ${interval}`)
  }
}

function toUTCTimestamp(utcDateString: string): UTCTimestamp {
  const utcDate = new Date(utcDateString)
  utcDate.setHours(utcDate.getHours() + 8)
  return (utcDate.getTime() / 1000) as UTCTimestamp
}

export const toLineDataArray = (quotes: L1Min[]): LineData<UTCTimestamp>[] =>
  quotes.map((quote) => toLineData(quote)).filter((x) => x.time >= 631152000) // 过滤1990年以前的数据

export const toLineData = (quote: L1Min): LineData<UTCTimestamp> => ({
  time: toUTCTimestamp(quote.utc),
  value: quote.cp,
  customValues: {
    original: quote
  }
})

export const toLineVolumeArray = (quotes: MinQuote[]): HistogramData<UTCTimestamp>[] => {
  if (quotes === null || quotes.length === 0) {
    console.debug('quotes is null or empty')
    return []
  }
  let prevPrice = (quotes[0].customValues?.original as L1Min)?.pp
  return quotes.map((quote) => {
    const original = quote.customValues?.original as L1Min
    if (!original) {
      return { time: quote.time } as HistogramData<UTCTimestamp>
    } else {
      const volumeData = toLineVolume(original, prevPrice)
      prevPrice = original.cp
      return volumeData
    }
  })
}

export const toLineVolume = (quote: L1Min, prevPrice: number): HistogramData<UTCTimestamp> => ({
  time: toUTCTimestamp(quote.utc),
  value: quote.tv,
  color: quote.cp >= prevPrice ? upColorVOL : downColorVOL
})

export const toCandleVolumeArray = (
  quotes: CandlestickData[],
  interval: Interval
): HistogramData[] => {
  if (isLowFreq(interval)) {
    return quotes.map((quote) => {
      const original = quote.customValues?.original as KLineData
      const color = getCandleVolumeColor(original)
      return {
        time: quote.time,
        value: original.kData.tv,
        color: color
      }
    })
  } else {
    let prevPrice: number = 0
    const array: HistogramData[] = []
    for (const [index, quote] of quotes.entries()) {
      const original = quote.customValues?.original as KLineData

      if (index === 0) {
        prevPrice = original.kData.op
      }

      array.push({
        time: quote.time,
        value: original.kData.tv,
        color: original.kData.cp >= prevPrice ? upColorVOL : downColorVOL
      })
      prevPrice = original.kData.cp
    }
    return array
  }
}

const getCandleVolumeColor = (klineData: KLineData): string => {
  let color: string
  const quote = klineData.kData
  if (quote.cg > 0) {
    color = upColorVOL
  } else if (quote.cg < 0) {
    color = downColorVOL
  } else {
    color = quote.cp >= new Big(quote.cp).minus(quote.cg).toNumber() ? upColorVOL : downColorVOL
  }
  return color
}

export const toCandleVolume = (
  quote: CandlestickData,
  interval: Interval,
  prevPrice?: number
): HistogramData<UTCTimestamp> => {
  let color: string
  const original = quote.customValues?.original as KLineData
  if (isLowFreq(interval)) {
    color = getCandleVolumeColor(original)
  } else {
    color = prevPrice && original.kData.cp >= prevPrice ? upColorVOL : downColorVOL
  }
  return {
    time: toUTCTimestamp(original.kData.utc),
    value: original.kData.tv,
    color: color
  }
}

export function isLowFreq(interval: Interval): boolean {
  return interval === '1D' || interval === '1W' || interval === '1M' || interval === '1Y'
}

export const toCandlestickDataArray = (quotes: KLineData[]): CandlestickData<UTCTimestamp>[] => {
  const arr: CandlestickData<UTCTimestamp>[] = []
  for (const quote of quotes) {
    const candlestickData = toCandlestickData(quote)
    if (candlestickData) {
      arr.push(candlestickData)
    }
  }
  return arr
}

function getCandleColor(klineData: KLineData): string {
  const kData = klineData.kData
  if (kData.cp > kData.op) {
    return upColor
  } else if (kData.cp < kData.op) {
    return downColor
  } else {
    return kData.cp >= new Big(kData.cp).minus(kData.cg).toNumber() ? upColor : downColor
  }
}

export function toCandlestickData(quote: KLineData): CandlestickData<UTCTimestamp> | null {
  const kData = quote.kData

  // 过滤异常数据
  if (kData.op === 0 || kData.cp === 0) {
    return null
  }

  const color = getCandleColor(quote)

  return {
    time: toUTCTimestamp(kData.utc),
    open: kData.op,
    high: kData.hp,
    low: kData.lp,
    close: kData.cp,
    color: color,
    wickColor: color,
    customValues: {
      original: quote
    }
  }
}

export const getTradeTimes = async (symbol: string): Promise<UTCTimestamp[]> => {
  const arr = symbol.split('.')
  const timestamps = await getTradeMinutes(arr[0], arr[1])
  return timestamps.map(toUTCTimestamp)
}

export const toBasicData = (newData: any): BasicData => {
  const innerData = newData.data
  return {
    shortName: innerData.sn,
    ap: innerData.ap,
    op: innerData.op,
    hp: innerData.hp,
    lp: innerData.lp,
    lcp: innerData.lcp,
    cp: innerData.cp,
    cr: innerData.cr,
    cg: innerData.cg,
    tr: innerData.tr,
    pe: innerData.pE1,
    tq: innerData.tq,
    tm: innerData.tm,
    or: innerData.or,
    marketCap: innerData.tmv,
    tickSize: innerData.minTickSize ?? 0.01,
    securityType: innerData.securityType,
    is: innerData.is,
    nav: innerData.nav,
    ai: innerData.ai,
    pvr: innerData.pvr
  }
}

export const toDOMData = (newData: any): DepthOfMarketData => {
  const innerData = newData.data
  let asks = []

  if (innerData.sellLevels) {
    const totalAsksVolume = innerData.sellLevels.reduce((acc, ask) => acc + ask.volume, 0)
    asks = innerData.sellLevels.map((x) => ({
      price: x.price,
      volume: x.volume,
      percent: Math.round((100 * x.volume) / totalAsksVolume)
    }))
  }

  let bids = []
  if (innerData.buyLevels) {
    const totalBidsVolume = innerData.buyLevels.reduce((acc, bid) => acc + bid.volume, 0)
    bids = innerData.buyLevels.map((x) => ({
      price: x.price,
      volume: x.volume,
      percent: Math.round((100 * x.volume) / totalBidsVolume)
    }))
  }

  const showLimit = isStock(innerData.securityType) || isFund(innerData.securityType)
  const domData: DepthOfMarketData = {
    lowerLimit: showLimit ? innerData.lowerLimit : undefined,
    upperLimit: showLimit ? innerData.upperLimit : undefined,
    preClosePrice: innerData.preClosePrice,
    asks: asks,
    bids: bids
  }
  return domData
}

export const isStock = (securityType: number): boolean =>
  securityType === 1 || securityType === 19 || securityType === 21
export const isFund = (securityType: number): boolean => securityType === 2
export const isBond = (securityType: number): boolean => securityType === 3
export const isIndex = (securityType: number): boolean => securityType === 4
