import {
  CandlestickData,
  CandlestickSeries,
  UTCTimestamp,
  createChart,
  IChartApi
} from 'lightweight-charts'
import CandleTooltip from './CandleTooltip'
import { useEffect, useRef, useId, JSX } from 'react'
import { Interval } from '@renderer/types/chart'
import { KLineData } from '@renderer/types/quote'
import { Indicator } from '@renderer/types/chart'
import {
  candlestickChartOptions,
  upColor,
  downColor,
  toolbarHeight
} from '@renderer/config/chart-config'
import { useIndicators } from '@renderer/hooks/useIndicators'
import { throttle } from 'lodash'
import { useChartStore } from '@renderer/store/useChartStore'
import { CandleDataUpdater } from './CandleDataUpdater'
import { getPrecision } from '@renderer/lib/getters'

interface CandlestickChartProps {
  symbol: string
  interval: Interval
  onIndicatorUpdate?: (callback: (indicator: Indicator, checked: boolean) => void) => void
}

function CandlestickChart({
  symbol,
  interval,
  onIndicatorUpdate,
  ...props
}: CandlestickChartProps): JSX.Element {
  return (
    <CandlestickChartComponent
      symbol={symbol}
      interval={interval}
      onIndicatorUpdate={onIndicatorUpdate}
      {...props}
    />
  )
}

const CandlestickChartComponent = (props: CandlestickChartProps): JSX.Element => {
  const { symbol, interval, onIndicatorUpdate } = props

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const candleSeriesRef = useRef<any>(null)
  const barSpacingRef = useRef<number>(10) // 保存 zoom level

  const indicatorsRef = useRef<Record<Indicator, any>>({
    VOL: null,
    MACD: null,
    KDJ: null,
    RSI: null
  })
  const { addIndicator, removeIndicator, updateLegends } = useIndicators(
    interval,
    chartRef,
    candleSeriesRef,
    indicatorsRef
  )

  const candleId = useId()
  const tickSize = useChartStore((s) => s.securityInfo?.tickSize ?? 0.01)
  const setCandleTooltipData = useChartStore((s) => s.setCandleTooltipData)
  const indicatorState = useChartStore((x) => x.indicatorState)

  useEffect(() => {
    const handleResize = (): void => {
      if (getChartApi()) {
        const newWidth = Math.min(
          chartContainerRef.current!.clientWidth - 4,
          window.innerWidth - 256 - 4
        )
        getChartApi().applyOptions({
          height: window.innerHeight - toolbarHeight,
          width: newWidth
        })
      }
    }

    const baseOptions = candlestickChartOptions()
    const chartOptions = {
      ...baseOptions,
      width: chartContainerRef.current!.clientWidth,
      timeScale: {
        ...baseOptions.timeScale,
        timeVisible: interval === '5m' || interval === '30m' || interval === '60m'
      }
    }

    const chart = createChart(chartContainerRef.current!, chartOptions)
    chartRef.current = chart

    // 恢复保存的 zoom level
    if (barSpacingRef.current) {
      chart.timeScale().applyOptions({
        barSpacing: barSpacingRef.current
      })
    }

    // add indicators
    Object.entries(indicatorState).map(([key, item]) => {
      if (item.checked) {
        addIndicator(key as Indicator)
      }
    })

    // add candleSeries
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: upColor,
      downColor: downColor,
      wickUpColor: upColor,
      wickDownColor: downColor,
      borderVisible: false
    })
    candleSeriesRef.current = candleSeries

    const updateTooltip = (param): void => {
      if (!param || !param.seriesData) {
        setCandleTooltipData(candleId, null)
        return
      }

      const point = param.point
      if (!point) {
        setCandleTooltipData(candleId, null)
        return
      }

      const priceData = param.seriesData.get(candleSeries) as CandlestickData<UTCTimestamp>

      if (priceData) {
        const quote = priceData.customValues?.original as KLineData
        const containerWidth = chartContainerRef.current!.clientWidth
        const centerX = containerWidth / 2

        setCandleTooltipData(candleId, {
          data: {
            utc: priceData.time,
            open: priceData.open,
            high: priceData.high,
            low: priceData.low,
            cp: priceData.close,
            cr: quote.kData.cr,
            cg: quote.kData.cg,
            tv: quote.kData.tv,
            ta: quote.kData.ta
          },
          align: point.x > centerX ? 'left' : 'right'
        })
      } else {
        setCandleTooltipData(candleId, null)
      }
    }

    const throttledUpdate = throttle((param: any) => {
      updateTooltip(param)
      updateLegends(param)
      chartContainerRef.current?.focus()
    }, 50)

    chart.subscribeCrosshairMove(throttledUpdate)

    window.addEventListener('resize', handleResize)

    return () => {
      const bs = chart.timeScale().options().barSpacing
      if (bs) {
        barSpacingRef.current = bs
      }
      window.removeEventListener('resize', handleResize)
      Object.keys(indicatorsRef.current).forEach((indicator) => {
        removeIndicator(indicator as Indicator)
      })
      chartRef.current = null
      candleSeriesRef.current = null
      chart.remove()
    }
  }, [symbol, interval])

  useEffect(() => {
    candleSeriesRef.current.applyOptions({
      priceFormat: {
        type: 'price',
        precision: getPrecision(tickSize),
        minMove: tickSize
      }
    })
  }, [tickSize])

  const getChartApi = (): IChartApi => chartRef.current as IChartApi

  useEffect(() => {
    if (onIndicatorUpdate) {
      const handleIndicatorUpdate = (indicator: Indicator, checked: boolean): void => {
        if (checked) {
          addIndicator(indicator)
        } else {
          removeIndicator(indicator)
        }
      }
      onIndicatorUpdate(handleIndicatorUpdate)
    }
  }, [onIndicatorUpdate])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!chartRef.current) return

      const timeScale = getChartApi().timeScale()
      const currentPos = timeScale.scrollPosition()!

      switch (event.key) {
        case 'ArrowLeft':
          timeScale.scrollToPosition(currentPos - 1, false)
          break
        case 'ArrowRight':
          timeScale.scrollToPosition(currentPos + 1, false)
          break
      }
    }

    const chartContainer = chartContainerRef.current
    if (chartContainer) {
      chartContainer.tabIndex = 0 // Make the container focusable
      chartContainer.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (chartContainer) {
        chartContainer.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [chartRef])

  return (
    <div className="relative">
      <div className="outline-hidden" ref={chartContainerRef} />
      <CandleDataUpdater
        symbol={symbol}
        interval={interval}
        chartRef={chartRef}
        priceSeriesRef={candleSeriesRef}
        indicatorsRef={indicatorsRef}
      />
      <CandleTooltip id={candleId} interval={interval} />
    </div>
  )
}

export default CandlestickChart
