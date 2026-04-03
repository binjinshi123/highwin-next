import {
  BaselineSeries,
  HistogramSeries,
  createChart,
  SingleValueData,
  UTCTimestamp,
  IChartApi,
  MouseEventParams,
  Time,
  ISeriesApi
} from 'lightweight-charts'
import LineTooltip from './LineTooltip'
import StatusLine from './StatusLine'
import { JSX, useEffect, useId, useRef } from 'react'

import { L1Min } from '@renderer/types/quote'
import { LineTooltipProps, StatusLineData } from '@renderer/types/chart'
import { baselineChartOptions, toolbarHeight } from '@renderer/config/chart-config'
import { getLastBar, validCrosshairPoint } from '@renderer/lib/chart-helper'
import { useChartStore } from '@renderer/store/useChartStore'
import { LineDataUpdater } from './LineDataUpdater'
import { getPrecision } from '@renderer/lib/getters'
import { useMarketReset } from '@renderer/hooks/useMarketReset'

interface ChartProps {
  symbol: string
}

const BaselineChartComponent = ({ symbol }: ChartProps): JSX.Element => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi>(null)
  const priceSeriesRef = useRef<ISeriesApi<'Baseline', Time>>(null)
  const volumeSeriesRef = useRef<unknown>(null)

  const baselineId = useId()
  console.debug('BaselineChartComponent render', symbol)

  const tickSize = useChartStore((s) => s.securityInfo?.tickSize ?? 0.01)
  const lcp = useChartStore((s) => s.securityInfo?.lcp ?? 0)
  const setStatusLineData = useChartStore((s) => s.setStatusLineData)
  const setLineTooltipData = useChartStore((s) => s.setLineTooltipData)

  const updateLegend = (param: MouseEventParams<Time>): void => {
    if (priceSeriesRef?.current === null) return

    let currentOrLast
    if (validCrosshairPoint(param)) {
      const pointData = param.seriesData.get(priceSeriesRef.current)
      if (pointData) {
        currentOrLast = pointData
      }
    }

    if (!currentOrLast) {
      currentOrLast = getLastBar(priceSeriesRef.current)
    }

    if (currentOrLast) {
      const quote = currentOrLast.customValues?.original as L1Min
      if (quote) {
        setStatusLineData(baselineId, {
          avg: quote.avg,
          cp: quote.cp,
          change: quote.pc,
          changePercent: quote.cr,
          tickSize: tickSize
        })
      }
    }
  }

  useEffect(() => {
    let chart: IChartApi

    function initChart(): void {
      if (!chartContainerRef.current) return

      const containerWidth = chartContainerRef.current.clientWidth
      const chartOptions = {
        ...baselineChartOptions(),
        width: containerWidth
      }
      chart = createChart(chartContainerRef.current, chartOptions)
      chartRef.current = chart

      // The first series added will appear at the bottom of the stack
      // and each series added will be placed on top of the stack.
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: '' // set as an overlay by setting a blank priceScaleId
      })
      volumeSeriesRef.current = volumeSeries

      const priceSeries = chart.addSeries(BaselineSeries, {
        priceScaleId: 'right',
        topLineColor: 'rgba( 239, 83, 80, 1)',
        topFillColor1: 'rgba( 239, 83, 80, 0.28)',
        topFillColor2: 'rgba( 239, 83, 80, 0.05)',
        bottomLineColor: 'rgba( 38, 166, 154, 1)',
        bottomFillColor1: 'rgba( 38, 166, 154, 0.05)',
        bottomFillColor2: 'rgba( 38, 166, 154, 0.28)',
        lineWidth: 2
      })
      priceSeriesRef.current = priceSeries

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0
        }
      })

      const updateTooltip = (param: MouseEventParams<Time>): void => {
        if (!param || !param.seriesData) {
          setLineTooltipData(baselineId, {} as LineTooltipProps)
          return
        }

        const point = param.point
        if (!point) {
          setLineTooltipData(baselineId, {} as LineTooltipProps)
          return
        }

        const priceData = param.seriesData.get(priceSeries) as SingleValueData<UTCTimestamp>

        if (priceData && priceData.value > 0) {
          const quote = priceData.customValues?.original as L1Min
          const containerWidth = chartContainerRef.current!.clientWidth
          const centerX = containerWidth / 2

          setLineTooltipData(baselineId, {
            data: {
              utc: priceData.time,
              cp: priceData.value,
              lcp: lcp,
              cg: quote.pc,
              cr: quote.cr,
              tv: quote.tv,
              ta: quote.ta
            },
            align: point.x > centerX ? 'left' : 'right',
            position: point
          })
        } else {
          setLineTooltipData(baselineId, {} as LineTooltipProps)
        }
      }

      chart.subscribeCrosshairMove((param: MouseEventParams<Time>): void => {
        updateLegend(param)
        updateTooltip(param)
      })
    }

    const rafId = requestAnimationFrame(initChart)

    const handleResize = (): void => {
      if (chartRef.current && chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.clientWidth
        const newWidth = Math.min(containerWidth - 4, window.innerWidth - 256 - 4)
        const newHeight = window.innerHeight - toolbarHeight
        chartRef.current.applyOptions({
          height: newHeight,
          width: newWidth
        })
        chartRef.current.timeScale().fitContent()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      chartRef.current = null
      priceSeriesRef.current = null
      volumeSeriesRef.current = null
      chart?.remove?.()
    }
  }, [symbol])

  useEffect(() => {
    priceSeriesRef.current?.applyOptions({
      baseValue: {
        price: lcp || 0
      },
      priceFormat: {
        type: 'price',
        precision: getPrecision(tickSize),
        minMove: tickSize
      }
    })
  }, [tickSize, lcp])

  useMarketReset((): void => {
    setStatusLineData(baselineId, {} as StatusLineData)
    setLineTooltipData(baselineId, {} as LineTooltipProps)
  })

  return (
    <div className="relative overflow-hidden">
      <div ref={chartContainerRef} />
      <LineDataUpdater
        symbol={symbol}
        priceSeriesRef={priceSeriesRef}
        volumeSeriesRef={volumeSeriesRef}
        chartRef={chartRef}
        updateLegend={updateLegend}
      />
      <StatusLine id={baselineId} />
      <LineTooltip id={baselineId} />
    </div>
  )
}

const BaselineChart = ({ symbol, ...props }: ChartProps): JSX.Element => {
  console.debug('BaselineChart render')
  return <BaselineChartComponent symbol={symbol} {...props} />
}

export default BaselineChart
