import { LineData, UTCTimestamp, WhitespaceData } from 'lightweight-charts'

export type Interval = '1m' | '1D' | '1W' | '1M' | '1Y' | '5m' | '30m' | '60m'
export type Indicator = 'VOL' | 'MACD' | 'KDJ' | 'RSI'

export type MinQuote = LineData<UTCTimestamp> | WhitespaceData<UTCTimestamp>
/** 分时图（基准线类型）数据 */
export interface MinChartData {
  times: number[]
  quotes: MinQuote[]
}

export interface SecurityInfo {
  lcp: number | null
  tickSize: number
  shortName: string
  securityType: number
}

export interface LineTooltipProps extends TooltipProps {
  position: { x: number; y: number }
}

export interface TooltipProps {
  data: CrosshairTooltip
  align: 'left' | 'right'
}

/**
 * Crosshair Tooltip
 */
export interface CrosshairTooltip {
  /** UTC时间戳 */
  utc: number
  open?: number
  high?: number
  low?: number
  /** 收盘价(close price) */
  cp: number
  /** 昨收价 */
  lcp?: number
  /** 涨跌幅(change rate) */
  cr?: number
  /** 涨跌额 */
  cg?: number
  /** 均价(average price) */
  avg?: number
  /** 总额(total amount) */
  ta?: number
  /** 总量(total volume) */
  tv?: number
}

/** 盘口 */
export interface DepthOfMarketData {
  asks: { price: number; volume: number; percent: number }[]
  bids: { price: number; volume: number; percent: number }[]
  preClosePrice: number
  lowerLimit?: number
  upperLimit?: number
}

/** 基础信息 */
export interface BasicData {
  shortName: string
  /** 开盘价 */
  op: number | null
  /** 最高价 */
  hp: number | null
  /** 最低价 */
  lp: number | null
  /** 昨收价 */
  lcp: number | null
  /** 收盘价 */
  cp: number | null
  /** 涨跌幅 */
  cr: number
  /** 涨跌额 */
  cg: number
  /** 均价 */
  ap: number
  /** 换手率 */
  tr: number
  /** 委比 */
  or: number
  /** 总手 */
  tq: number
  /** 总成交额 */
  tm: number
  /** 市盈率 */
  pe: number
  /** 市值 */
  marketCap: number
  /** 最小价格变动档位 */
  tickSize: number
  /**证券类型 */
  securityType: number
  /** 份额 */
  is?: number
  /** 净值 */
  nav?: number
  /** 利息 */
  ai?: number
  /** 利率 */
  pvr?: number
}

export interface UpDownFlatData {
  up: number
  down: number
  flat: number
}

/** 分时图左上角数据 */
export interface StatusLineData {
  avg: number // 均价
  cp: number // 最新
  change: number // 涨跌额
  changePercent: number // 涨跌幅
  tickSize: number // 格式化价格的最小单位
}

export interface IndicatorCheckState {
  label: string
  checked: boolean
  disabled?: boolean
}
