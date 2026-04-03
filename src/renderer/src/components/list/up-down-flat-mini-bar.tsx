import { motion } from 'framer-motion'
import clsx from 'clsx'
import { UpDownFlatData } from '@renderer/types/chart'

const getPercentage = (value: number, total: number): number =>
  total === 0 ? 0 : (value / total) * 100

export function UpDownFlatMiniBar({ up, down, flat }: UpDownFlatData): React.ReactNode {
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

  const titleAll = segments
    .map((seg) => {
      return `${seg.label}家数: ${seg.value} (${getPercentage(seg.value, total).toFixed(1)}%)`
    })
    .join('\r\n')

  return (
    <div className="w-full flex flex-col gap-1 py-1">
      {/* 进度条容器 */}
      <div className="relative h-4 w-full rounded bg-muted overflow-hidden flex">
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
              title={titleAll}
            >
              {/* 仅当比例足够大时显示数字 */}
              {percent > 20 && <span className="px-1">{segment.value}</span>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
