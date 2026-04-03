import { cn } from '@renderer/lib/utils'
import { toFixedPrice, toPercent } from '@renderer/lib/fmt'
import { getPriceForeground } from '@renderer/lib/getters'
import { useChartStore } from '@renderer/store/useChartStore'
import { StatusLineData } from '@renderer/types/chart'

interface StatusLineProps {
  id: string
}

const StatusLine = ({ id }: StatusLineProps) => {
  const data = useChartStore((s) => s.statusLineDataMap[id]) as StatusLineData
  return (
    data && (
      <div className="absolute left-2 top-0 z-10 flex items-center space-x-1 text-[13px]">
        {data.avg > 0 && (
          <div className="text-orange-400 space-x-[2px]">
            <span>均价:</span>
            <span>{toFixedPrice(data.avg, data.tickSize)}</span>
          </div>
        )}
        <div className={cn('flex items-center space-x-1', getPriceForeground(data.change))}>
          <div className="space-x-[2px]">
            <span>最新:</span>
            <span>{toFixedPrice(data.cp, data.tickSize)}</span>
          </div>
          <span>{toFixedPrice(data.change, data.tickSize, true)}</span>
          <span>{toPercent(data.changePercent, true)}</span>
        </div>
      </div>
    )
  )
}

export default StatusLine
