import { useEffect } from 'react'
import { useChartStore } from '@renderer/store/useChartStore'
import { useIndicators } from '@renderer/hooks/useIndicators'

export function CandleDataUpdater({ symbol, interval, chartRef, priceSeriesRef, indicatorsRef }) {
  const quotes = useChartStore((s) => s.candleDataMap[symbol]?.[interval])
  const { setIndicatorsData } = useIndicators(interval, chartRef, priceSeriesRef, indicatorsRef)

  useEffect(() => {
    if (quotes && quotes.length > 0) {
      priceSeriesRef.current?.setData(quotes)
      setIndicatorsData(quotes)
    } else {
      priceSeriesRef.current?.setData([])
      setIndicatorsData([])
    }
  }, [quotes])
  return null
}
