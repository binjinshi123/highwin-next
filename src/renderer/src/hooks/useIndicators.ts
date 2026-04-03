import {
  IChartApi,
  LineSeries,
  HistogramSeries,
  CandlestickData,
  LineData,
  MouseEventParams,
  Time
} from 'lightweight-charts'
import { KLineData } from '@renderer/types/quote'
import { Indicator, Interval } from '@renderer/types/chart'
import { upColor, downColor, lineSeriesWidth } from '@renderer/config/chart-config'
import { validCrosshairPoint, getLastBar, getRandomChartColors } from '@renderer/lib/chart-helper'
import { toCandleVolume, toCandleVolumeArray } from '@renderer/lib/quoteManager'
import { RefObject } from 'react'

export const useIndicators = (
  interval: Interval,
  chartRef: RefObject<IChartApi>,
  candleSeriesRef: RefObject<any>,
  indicatorsRef: RefObject<Record<Indicator, any>>
) => {
  const addIndicator = (indicator: Indicator) => {
    const chart = chartRef.current as IChartApi
    if (!chart) return

    const paneIndex = chart.panes().length
    let series: any = null

    switch (indicator) {
      case 'VOL':
        series = initializeVOL(chart, interval)
        break
      case 'MACD':
        series = initializeMACD(chart, paneIndex)
        break
      case 'KDJ':
        series = initializeKDJ(chart, paneIndex)
        break
      case 'RSI':
        series = initializeRSI(chart, paneIndex)
        break
    }

    indicatorsRef.current[indicator] = series
  }

  const initializeVOL = (chart: IChartApi, interval: Interval) => {
    // The first series added will appear at the bottom of the stack
    // and each series added will be placed on top of the stack.
    const series = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume'
      },
      priceScaleId: '' // set as an overlay by setting a blank priceScaleId
    })

    series.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // highest point of the series will be 70% away from the top
        bottom: 0
      }
    })

    if (candleSeriesRef.current) {
      const seriesData = candleSeriesRef.current.data() || []
      const volumeData = toCandleVolumeArray(seriesData, interval)
      series.setData(volumeData)
    }

    return series
  }

  const initializeMACD = (chart: IChartApi, paneIndex: number) => {
    const colors = getRandomChartColors(2)
    const macdHistogram = addHistogramSeries(chart, paneIndex, 'MACD')
    const deaLineSeries = addLineSeries(chart, paneIndex, 'DEA', colors[0])
    const difLineSeries = addLineSeries(chart, paneIndex, 'DIF', colors[1])

    if (candleSeriesRef.current) {
      const seriesData = candleSeriesRef.current.data() || []
      const macdData = getMACD(seriesData)

      macdHistogram.setData(macdData.histogram)
      deaLineSeries.setData(macdData.lineDEA)
      difLineSeries.setData(macdData.lineDIF)
    }

    return [macdHistogram, deaLineSeries, difLineSeries]
  }

  const initializeKDJ = (chart: IChartApi, paneIndex: number) => {
    const colors = getRandomChartColors(3)
    const seriesK = addLineSeries(chart, paneIndex, 'K', colors[0])
    const seriesD = addLineSeries(chart, paneIndex, 'D', colors[1])
    const seriesJ = addLineSeries(chart, paneIndex, 'J', colors[2])

    if (candleSeriesRef.current) {
      const seriesData = candleSeriesRef.current.data() || []
      const { lineDataK, lineDataD, lineDataJ } = getKDJ(seriesData)

      seriesK.setData(lineDataK)
      seriesD.setData(lineDataD)
      seriesJ.setData(lineDataJ)
    }

    return [seriesK, seriesD, seriesJ]
  }

  const initializeRSI = (chart: IChartApi, paneIndex: number) => {
    const colors = getRandomChartColors(3)
    const lineRSI6 = addLineSeries(chart, paneIndex, 'RSI6', colors[0])
    const lineRSI12 = addLineSeries(chart, paneIndex, 'RSI12', colors[1])
    const lineRSI24 = addLineSeries(chart, paneIndex, 'RSI24', colors[2])

    if (candleSeriesRef.current) {
      const seriesData = candleSeriesRef.current.data() || []
      const { rsi6Data, rsi12Data, rsi24Data } = getRSI(seriesData)

      lineRSI6.setData(rsi6Data)
      lineRSI12.setData(rsi12Data)
      lineRSI24.setData(rsi24Data)
    }

    return [lineRSI6, lineRSI12, lineRSI24]
  }

  const removeIndicator = (indicator: Indicator) => {
    const series = indicatorsRef.current[indicator]
    if (!series) return

    const chart = chartRef.current
    if (!chart) return

    if (Array.isArray(series)) {
      series.forEach((s) => chart.removeSeries(s))
    } else {
      chart.removeSeries(series)
    }

    indicatorsRef.current[indicator] = null
  }

  const setIndicatorsData = (quotes: CandlestickData[]) => {
    if (!indicatorsRef.current) return
    Object.keys(indicatorsRef.current).forEach((indicator) => {
      setIndicatorData(quotes, indicator as Indicator)
    })
  }

  const setIndicatorData = (quotes: CandlestickData[], indicator: Indicator) => {
    if (!indicatorsRef.current) return
    const series = indicatorsRef.current[indicator]
    if (!series) return

    switch (indicator) {
      case 'VOL': {
        const volumeData = toCandleVolumeArray(quotes, interval)
        series.setData(volumeData)
        break
      }
      case 'MACD': {
        const macdData = getMACD(quotes)
        const [macdHistogram, deaLineSeries, difLineSeries] = series
        macdHistogram.setData(macdData.histogram)
        deaLineSeries.setData(macdData.lineDEA)
        difLineSeries.setData(macdData.lineDIF)
        break
      }
      case 'KDJ': {
        const [seriesK, seriesD, seriesJ] = series
        const { lineDataK, lineDataD, lineDataJ } = getKDJ(quotes)
        seriesK.setData(lineDataK)
        seriesD.setData(lineDataD)
        seriesJ.setData(lineDataJ)
        break
      }
      case 'RSI': {
        const [lineRSI6, lineRSI12, lineRSI24] = series
        const { rsi6Data, rsi12Data, rsi24Data } = getRSI(quotes)
        lineRSI6.setData(rsi6Data)
        lineRSI12.setData(rsi12Data)
        lineRSI24.setData(rsi24Data)
        break
      }
    }
  }

  const updateIndicatorsData = (quote: CandlestickData, prevPrice?: number) => {
    Object.keys(indicatorsRef.current).forEach((indicator) => {
      const series = indicatorsRef.current[indicator]
      if (!series) return

      switch (indicator) {
        case 'VOL': {
          const volumeData = toCandleVolume(quote, interval, prevPrice)
          series.update(volumeData)
          break
        }
        case 'MACD': {
          const [macdHistogram, deaLineSeries, difLineSeries] = series
          const { macd, dea, dif } = getMACDSingle(quote)
          macdHistogram.update(macd)
          deaLineSeries.update(dea)
          difLineSeries.update(dif)
          break
        }
        case 'KDJ': {
          const [seriesK, seriesD, seriesJ] = series
          const { k, d, j } = getKDJSingle(quote)
          seriesK.update(k)
          seriesD.update(d)
          seriesJ.update(j)
          break
        }
        case 'RSI': {
          const [lineRSI6, lineRSI12, lineRSI24] = series
          const { rsi6, rsi12, rsi24 } = getRSISingle(quote)
          lineRSI6.update(rsi6)
          lineRSI12.update(rsi12)
          lineRSI24.update(rsi24)
          break
        }
      }
    })

    updateLegends(null)
  }

  const updateLegends = (param: MouseEventParams<Time> | null) => {
    const getSeriesValue = (series: any) => {
      return param && validCrosshairPoint(param) ? param.seriesData.get(series) : getLastBar(series)
    }

    const getSeriesLegendHTML = (series: any): string => {
      let innerHtml = ''
      const options = series.options()
      const seriesValue = getSeriesValue(series)

      if (seriesValue) {
        const { value, color = options.color } = seriesValue
        if (options.color) {
          innerHtml += `<span>${options.title}: <span style="color: ${color};">${value}</span></span>`
        } else {
          innerHtml += `<span>${options.title}: ${value}</span>`
        }
      }

      return innerHtml
    }

    // 遍历所有指标，更新 legend
    Object.keys(indicatorsRef.current).forEach((indicator) => {
      const series = indicatorsRef.current[indicator]
      if (!series) return
      // VOL 在浮窗显示
      if (indicator === 'VOL') return

      let innerHtml = ''
      let firstSeries: any = null

      if (Array.isArray(series)) {
        // 如果是多个 series
        firstSeries = series[0]
        series.forEach((s) => {
          innerHtml += getSeriesLegendHTML(s)
        })
      } else {
        // 如果是单个 series
        firstSeries = series
        innerHtml = getSeriesLegendHTML(series)
      }

      // 更新 legend 内容
      const paneEl = firstSeries.getPane()?.getHTMLElement()
      if (paneEl && paneEl.childNodes.length > 1) {
        const td = paneEl.childNodes[1]
        if (td.childNodes.length > 1) {
          td.childNodes[1].innerHTML = innerHtml
        } else {
          const legend = document.createElement('div')
          legend.className = 'absolute left-2 top-1 z-10 text-[13px] flex gap-2'
          td.appendChild(legend)
        }
      }
    })
  }

  const addLineSeries = (chart: IChartApi, paneIndex: number, title: string, color?: string) =>
    chart.addSeries(
      LineSeries,
      {
        title,
        color,
        lineWidth: lineSeriesWidth
      },
      paneIndex
    )

  const addHistogramSeries = (chart: IChartApi, paneIndex: number, title: string) =>
    chart.addSeries(
      HistogramSeries,
      {
        title
      },
      paneIndex
    )

  const getMACD = (quotes: CandlestickData[]) => {
    // 假设 quotes 包含收盘价等数据
    const histogram: any[] = []
    const lineDEA: any[] = []
    const lineDIF: any[] = []

    // 计算 MACD 的逻辑
    quotes.forEach((quote) => {
      const { macd, dea, dif } = getMACDSingle(quote)
      histogram.push(macd)
      lineDEA.push(dea)
      lineDIF.push(dif)
    })

    return { histogram, lineDEA, lineDIF }
  }

  const getMACDSingle = (quote: CandlestickData) => {
    const originalData = quote.customValues?.original as KLineData
    return {
      macd: {
        time: quote.time,
        value: originalData.kIndex.MACD,
        color: originalData.kIndex.MACD >= 0 ? upColor : downColor
      },
      dea: { time: quote.time, value: originalData.kIndex.DEA },
      dif: { time: quote.time, value: originalData.kIndex.DIF }
    }
  }

  const getKDJ = (quotes: CandlestickData[]) => {
    const lineDataK: LineData[] = []
    const lineDataD: LineData[] = []
    const lineDataJ: LineData[] = []

    quotes.forEach((quote) => {
      const { k, d, j } = getKDJSingle(quote)
      lineDataK.push(k)
      lineDataD.push(d)
      lineDataJ.push(j)
    })

    return { lineDataK, lineDataD, lineDataJ }
  }

  const getKDJSingle = (quote: CandlestickData) => {
    const originalData = quote.customValues?.original as KLineData
    return {
      k: {
        time: quote.time,
        value: originalData.kIndex.K
      },
      d: {
        time: quote.time,
        value: originalData.kIndex.D
      },
      j: {
        time: quote.time,
        value: originalData.kIndex.J
      }
    }
  }

  const getRSI = (quotes: CandlestickData[]) => {
    const rsi6Data: LineData[] = []
    const rsi12Data: LineData[] = []
    const rsi24Data: LineData[] = []

    quotes.forEach((quote) => {
      const { rsi6, rsi12, rsi24 } = getRSISingle(quote)
      rsi6Data.push(rsi6)
      rsi12Data.push(rsi12)
      rsi24Data.push(rsi24)
    })
    return { rsi6Data, rsi12Data, rsi24Data }
  }

  const getRSISingle = (quote: CandlestickData) => {
    const originalData = quote.customValues?.original as KLineData
    return {
      rsi6: {
        time: quote.time,
        value: originalData.kIndex.RSI6
      },
      rsi12: {
        time: quote.time,
        value: originalData.kIndex.RSI12
      },
      rsi24: {
        time: quote.time,
        value: originalData.kIndex.RSI24
      }
    }
  }

  return { addIndicator, removeIndicator, setIndicatorsData, updateIndicatorsData, updateLegends }
}
