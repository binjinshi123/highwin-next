import { MouseEventParams, Time } from 'lightweight-charts'
import { getCssVariable } from './utils'

export function validCrosshairPoint(param: MouseEventParams<Time>): boolean {
  return !(
    param === undefined ||
    param.time === undefined ||
    param.point!.x < 0 ||
    param.point!.y < 0
  )
}

export const getLastBar = (series) => series.dataByIndex(Number.MAX_SAFE_INTEGER, -1)

export const getRandomChartColors = (count: number): string[] => {
  const chartSeriesColors = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5']
  const shuffledColors = [...chartSeriesColors].sort(() => Math.random() - 0.5)

  // 确保 count 不超过可用颜色数量
  const selectedColors = shuffledColors.slice(0, Math.min(count, chartSeriesColors.length))

  // 将 CSS 变量转换为实际颜色值
  return selectedColors.map((color) => getCssVariable(color))
}
