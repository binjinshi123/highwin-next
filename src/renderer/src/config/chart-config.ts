import { getCssVariable } from '@renderer/lib/utils'
import { Interval } from '@renderer/types/chart'
import { ChartOptions, ColorType, CrosshairMode, DeepPartial } from 'lightweight-charts'

export const upColor = '#ef5350'
export const downColor = '#26a69a'
export const upColorVOL = '#f7a8a7'
export const downColorVOL = '#92d2cc'
export const lineSeriesWidth = 1
export const toolbarHeight = 38

/** 基准线图表配置 */
export const baselineChartOptions = (): DeepPartial<ChartOptions> => ({
  layout: {
    textColor: getCssVariable('--foreground'),
    background: {
      type: ColorType.Solid,
      color: getCssVariable('--background')
    },
    attributionLogo: false
  },
  height: window.innerHeight - toolbarHeight,
  localization: {
    locale: 'zh-Hans-CN',
    dateFormat: 'yyyy-MM-dd'
  },
  rightPriceScale: {
    borderVisible: false
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    fixLeftEdge: true,
    lockVisibleTimeRangeOnResize: true,
    rightBarStaysOnScroll: true,
    borderVisible: false
  },
  handleScale: false,
  handleScroll: false,
  grid: {
    vertLines: { color: getCssVariable('--muted') },
    horzLines: { color: getCssVariable('--muted') }
  },
  crosshair: {
    mode: CrosshairMode.Normal
  }
})

/** 日周月年K线图表配置 */
export const candlestickChartOptions = (): DeepPartial<ChartOptions> => ({
  layout: {
    textColor: getCssVariable('--foreground'),
    background: {
      type: ColorType.Solid,
      color: getCssVariable('--background')
    },
    attributionLogo: false
  },
  height: window.innerHeight - toolbarHeight,
  localization: {
    locale: 'zh-Hans-CN',
    dateFormat: 'yyyy-MM-dd'
  },
  rightPriceScale: {
    borderVisible: false
  },
  timeScale: {
    rightOffset: 2,
    barSpacing: 10,
    fixLeftEdge: true,
    // fixRightEdge: true,
    lockVisibleTimeRangeOnResize: true,
    rightBarStaysOnScroll: true,
    secondsVisible: false,
    borderVisible: false
  },
  grid: {
    vertLines: { color: getCssVariable('--muted') },
    horzLines: { color: getCssVariable('--muted') }
  },
  crosshair: {
    mode: CrosshairMode.Normal
  }
})

export const intervalToggles: { interval: Interval; label: string }[] = [
  {
    interval: '1m',
    label: '分时'
  },
  {
    interval: '1D',
    label: '日K'
  },
  {
    interval: '1W',
    label: '周K'
  },
  {
    interval: '1M',
    label: '月K'
  },
  {
    interval: '5m',
    label: '5分'
  },
  {
    interval: '30m',
    label: '30分'
  },
  {
    interval: '60m',
    label: '60分'
  }
]
