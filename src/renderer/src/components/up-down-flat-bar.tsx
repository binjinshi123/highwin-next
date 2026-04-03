import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useChartStore } from '@renderer/store/useChartStore'

const getPercentage = (value: number, total: number): number =>
  total === 0 ? 0 : (value / total) * 100

export function UpDownFlatBar(): React.ReactNode {
  const securityType = useChartStore((x) => x.securityInfo?.securityType)
  const { up, down, flat } = useChartStore((x) => x.upDownFlatData)

  if (securityType !== 4) {
    return null
  }

  const total = up + down + flat
  const segments = [
    {
      label: '上涨',
      value: up,
      color: 'bg-chart-up'
    },
    {
      label: '平盘',
      value: flat,
      color: 'bg-chart-equal'
    },
    {
      label: '下跌',
      value: down,
      color: 'bg-chart-down'
    }
  ]

  return (
    <div className="w-full flex flex-col gap-1 py-1">
      {/* 进度条容器 */}
      <div className="relative h-4 w-full rounded-full bg-muted overflow-hidden flex">
        {segments.map((segment) => {
          const percent = getPercentage(segment.value, total)

          return (
            <motion.div
              key={segment.label}
              className={clsx(
                'h-full text-xs text-white flex items-center justify-center whitespace-nowrap transition-all duration-150',
                segment.color
              )}
              style={{
                width: `${percent}%`,
                minWidth: percent > 5 ? undefined : 0
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              title={`${segment.label}家数: ${segment.value} (${percent.toFixed(1)}%)`}
            >
              {/* 仅当比例足够大时显示数字 */}
              {percent > 10 && <span className="px-1 text-[11px] sm:text-xs">{segment.value}</span>}
            </motion.div>
          )
        })}
      </div>
      {/* 小屏幕下方显示文字说明 */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {segments.map((s) => (
          <div key={s.label} className="flex gap-1 items-center">
            <span className={clsx('inline-block size-2 rounded-full', s.color)} />
            <span className="hidden sm:inline">{s.label}</span>
            <span>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
