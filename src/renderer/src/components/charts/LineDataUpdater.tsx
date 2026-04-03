import { useEffect } from 'react'
import { useChartStore } from '@renderer/store/useChartStore'
import { toLineVolumeArray } from '@renderer/lib/quoteManager'

export function LineDataUpdater({
  symbol,
  priceSeriesRef,
  volumeSeriesRef,
  chartRef,
  updateLegend
}: {
  symbol: string
  priceSeriesRef: any
  volumeSeriesRef: any
  chartRef: any
  updateLegend?: (param: any) => void
}) {
  const quotes = useChartStore((s) => s.minChartDataMap[symbol]?.quotes)

  useEffect(() => {
    if (!quotes || quotes.length === 0) {
      priceSeriesRef.current?.setData([])
      volumeSeriesRef.current?.setData([])
      return
    }

    priceSeriesRef.current?.setData(quotes)

    if (volumeSeriesRef.current) {
      const volumeData = toLineVolumeArray(quotes)
      volumeSeriesRef.current.setData(volumeData)
    }

    chartRef.current?.timeScale().fitContent()

    if (updateLegend) updateLegend(undefined)
  }, [quotes])
  return null
}
