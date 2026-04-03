import { useChartStore } from '@renderer/store/useChartStore'
import { AddToWatchlist } from './add-to-watchlist'
import { SecurityInfo } from '@renderer/types/chart'

interface TitleBarProps {
  symbol: string
}

export function TitleBar({ symbol }: TitleBarProps) {
  const securityInfo = useChartStore((s) => s.securityInfo) as SecurityInfo
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg font-semibold">{symbol.split('.')[0]}</span>
      <span className="text-lg font-semibold">{securityInfo?.shortName}</span>
      <AddToWatchlist symbol={symbol} />
    </div>
  )
}
