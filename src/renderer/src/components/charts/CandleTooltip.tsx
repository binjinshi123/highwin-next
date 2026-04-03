import { Card, CardContent } from '@renderer/components/ui/card'
import {
  toShortDate,
  toReadable,
  toPercent,
  toFixedPrice,
  toShortDateTime
} from '@renderer/lib/fmt'
import { getPriceForeground } from '@renderer/lib/getters'
import { Interval, TooltipProps } from '@renderer/types/chart'
import { useChartStore } from '@renderer/store/useChartStore'
import Big from 'big.js'

const CandleTooltip = ({ id, interval }: { id: string; interval: Interval }) => {
  const props = useChartStore((s) => s.candleTooltipDataMap[id])
  const tickSize = useChartStore((s) => s.securityInfo?.tickSize ?? 0.01)
  if (!props) return null
  const { data, align } = props as TooltipProps

  if (!data) return null // <-- 加这一行

  const getForeground = (price: number): string => {
    const diff = price
      ? new Big(price)
          .minus(data.cp)
          .plus(data.cg || 0)
          .toNumber()
      : 0
    return getPriceForeground(diff)
  }

  const formatDateTime = (utc: number, interval: Interval) => {
    if (interval === '5m' || interval === '30m' || interval === '60m') {
      return toShortDateTime(utc)
    } else {
      return toShortDate(utc)
    }
  }

  return (
    data && (
      <div
        className="absolute pointer-events-none"
        style={{
          top: 10,
          zIndex: 1000,
          ...(align === 'left' ? { left: 10 } : { right: 70 })
        }}
      >
        <Card className="py-0 w-[135px] shadow-xl backdrop-blur-xs bg-background/60 border border-border/50">
          <CardContent className="p-2 tabular-nums">
            <div className="text-[13px] space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">时间</span>
                <span className="text-foreground/60">{formatDateTime(data.utc, interval)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">开盘价</span>
                <span className={getForeground(data.open!)}>
                  {toFixedPrice(data.open!, tickSize)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">最高价</span>
                <span className={getForeground(data.high!)}>
                  {toFixedPrice(data.high!, tickSize)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">最低价</span>
                <span className={getForeground(data.low!)}>
                  {toFixedPrice(data.low!, tickSize)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">收盘价</span>
                <span className={getPriceForeground(data.cg!)}>
                  {toFixedPrice(data.cp, tickSize)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">涨跌额</span>
                <span className={getPriceForeground(data.cg!)}>
                  {toFixedPrice(data.cg!, tickSize)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">涨跌幅</span>
                <span className={getPriceForeground(data.cg!)}>{toPercent(data.cr!)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">成交量</span>
                <span className=" text-foreground/60">{toReadable(data.tv!)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">成交额</span>
                <span className=" text-foreground/60">{toReadable(data.ta!)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  )
}

export default CandleTooltip
