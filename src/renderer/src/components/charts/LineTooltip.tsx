import { Card, CardContent } from '@renderer/components/ui/card'
import { motion, AnimatePresence } from 'motion/react'
import { toShortTime, toReadable, toPercent, toFixedPrice } from '@renderer/lib/fmt'
import { getPriceForeground } from '@renderer/lib/getters'
import { useChartStore } from '@renderer/store/useChartStore'
import { LineTooltipProps } from '@renderer/types/chart'

const LineTooltip = ({ id }): React.ReactNode => {
  const props = useChartStore((s) => s.lineTooltipDataMap[id])
  const tickSize = useChartStore((s) => s.securityInfo?.tickSize ?? 0.01)
  if (!props) return
  const { data, position, align } = props as LineTooltipProps
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute pointer-events-none"
          style={{
            top: position.y + 10,
            left: align === 'left' ? position.x - 160 : position.x + 10,
            zIndex: 1000
          }}
        >
          <Card className="w-[135px] py-0 shadow-xl backdrop-blur-xs bg-background/60 border border-border/50">
            <CardContent className="p-2 tabular-nums">
              <div className="text-[13px] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">时间</span>
                  <span className="text-foreground/60">{toShortTime(data.utc)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">价格</span>
                  <span className={getPriceForeground(data.cg)}>
                    {toFixedPrice(data.cp, tickSize)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">涨跌幅</span>
                  <span className={getPriceForeground(data.cg)}>{toPercent(data.cr)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">成交量</span>
                  <span className="text-foreground/60">{toReadable(data.tv)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">成交额</span>
                  <span className="text-foreground/60">{toReadable(data.ta)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LineTooltip
