import { Progress } from '@renderer/components/ui/progress'
import { Separator } from '@renderer/components/ui/separator'

import { cn } from '@renderer/lib/utils'
import { toReadable, toFixedPrice } from '@renderer/lib/fmt'
import { getPriceFg, getPriceForeground } from '@renderer/lib/getters'
import { useChartStore } from '@renderer/store/useChartStore'
import { DepthOfMarketData, SecurityInfo } from '@renderer/types/chart'

interface DepthOfMarketProps {
  symbol: string
}

const DepthOfMarket: React.FC<DepthOfMarketProps> = ({ symbol }) => {
  const data = useChartStore((s) => s.domDataMap[symbol]) as DepthOfMarketData
  const securityInfo = useChartStore((s) => s.securityInfo) as SecurityInfo

  if (securityInfo?.securityType === 4) {
    return null
  }

  const level = 5 // 档位，股债基5档
  const formatPrice = (price: number | null | undefined) => {
    if (!price) {
      return '--'
    } else {
      return toFixedPrice(price, securityInfo?.tickSize ?? 0.01)
    }
  }

  const formatVolume = (volume: number) => {
    if (volume === 0) {
      return '--'
    } else {
      return toReadable(volume)
    }
  }

  return (
    <div className="flex flex-col p-2 border rounded min-h-fit h-[500px]">
      <div className="flex-1 flex flex-col gap-2 text-sm text-nowrap">
        <div className="flex items-center gap-2">
          <span className="w-8 flex-none">涨停</span>
          <span className={cn('w-12 text-right', getPriceForeground(1))}>
            {formatPrice(data?.upperLimit)}
          </span>
        </div>
        {[...Array(level)].map((_, index) => {
          const ask = data?.asks?.[data?.asks.length - 1 - index]
          return (
            <div
              key={`ask-${index}`}
              className="flex-1 flex justify-between items-center gap-2 flex-nowrap"
            >
              <span className="w-8 flex-none">卖{level - index}</span>
              <span
                className={cn(
                  'w-12 flex-none text-right text-nowrap',
                  getPriceFg(ask?.price, data?.preClosePrice)
                )}
              >
                {formatPrice(ask?.price)}
              </span>
              <Progress className="w-64 h-1 flex-2" value={ask?.percent} />
              <span className="w-12 flex-none text-right">{formatVolume(ask?.volume)}</span>
            </div>
          )
        })}
        <Separator />
        {[...Array(level)].map((_, index) => {
          const bid = data?.bids?.[index]
          return (
            <div
              key={`bid-${index}`}
              className="flex-1 flex justify-between items-center gap-2 flex-nowrap"
            >
              <span className="w-8 flex-none">买{index + 1}</span>
              <span
                className={cn(
                  'w-12 flex-none text-right text-nowrap',
                  getPriceFg(bid?.price, data?.preClosePrice)
                )}
              >
                {formatPrice(bid?.price)}
              </span>
              <Progress className="w-64 h-1 flex-2" value={bid?.percent} />
              <span className="w-12 flex-none text-right">{formatVolume(bid?.volume)}</span>
            </div>
          )
        })}
        <div className="flex-1 flex items-center gap-2">
          <span className="w-8 flex-none">跌停</span>
          <span className={cn('w-12 text-right', getPriceForeground(-1))}>
            {formatPrice(data?.lowerLimit)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DepthOfMarket
