/**
 * get number of digits after the decimal point
 * @param num 0.123
 * @returns 3
 */
export function getPrecision(num: number): number {
  return (num && num.toString().split('.')[1]?.length) || 0
}

export function getPriceFg(
  price: number | null | undefined,
  lcp: number | null | undefined
): string {
  if (price && lcp) {
    if (price > lcp) {
      return 'text-chart-up'
    } else if (price < lcp) {
      return 'text-chart-down'
    }
  }
  return 'text-chart-equal'
}

export function getPriceForeground(diff: number | undefined): string {
  return diff ? (diff > 0 ? 'text-chart-up' : 'text-chart-down') : 'text-chart-equal'
}
