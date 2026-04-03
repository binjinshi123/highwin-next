import { getPrecision } from './getters'

/** 数值转为万亿 */
export function toReadable(num: number | undefined): string {
  if (num === null || num === undefined) return '--'
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(2)}万`
  } else {
    return Math.round(num).toString()
  }
}

/**
 * format number to percent
 * @param num 0.123
 * @param digit 2
 * @returns 12.30%
 */
export function toPercent(
  num: number | undefined,
  showPlus: boolean = false,
  digit: number = 2
): string {
  if (num === undefined) {
    return '--'
  }
  const percent = (num * 100).toFixed(digit)
  if (showPlus) {
    return `${num > 0 ? '+' : ''}${percent}%`
  } else {
    return `${percent}%`
  }
}

/** 空值显示 -- */
export function formatPrice(
  price: number | null | undefined,
  tickSize: number = 0.01,
  showPlus: boolean = false
): string {
  return toFixedString(price, tickSize, showPlus, false)
}

/**
 * 格式化浮点数
 * @param price
 * @param tickSize
 * @param showPlus
 * @returns
 */
export function toFixedPrice(
  price: number | null | undefined,
  tickSize: number = 0.01,
  showPlus: boolean = false
): string {
  return toFixedString(price, tickSize, showPlus, true)
}

/**
 * 格式化浮点数
 * @param price
 * @param tickSize
 * @param showPlus
 * @param handleNullValue 是否处理空值: true => 0.0?, false => --
 * @returns
 */
function toFixedString(
  price: number | null | undefined,
  tickSize: number = 0.01,
  showPlus: boolean = false,
  handleNullValue: boolean = false
): string {
  if (price == null || price === undefined) {
    if (handleNullValue) {
      price = 0
    } else {
      return '--'
    }
  }

  const digits = getPrecision(tickSize)
  if (showPlus && price > 0) {
    return `+${price.toFixed(digits)}`
  } else {
    return price.toFixed(digits)
  }
}

/**
 * to short date string YYYY-MM-dd
 * @param time
 * @returns
 */
export function toShortDate(time: number): string {
  const date = new Date(time * 1000)
  // date.setHours(date.getHours() - 8)
  return date
    .toLocaleDateString('zh-CN', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    .replace(/\//g, '-')
}

export function toShortDateTime(time: number): string {
  const date = new Date(time * 1000)
  // date.setHours(date.getHours() - 8)
  return date
    .toLocaleDateString('zh-CN', {
      timeZone: 'UTC',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    .replace(/\//g, '-')
}

/**
 * to short time string HH:mm
 * @param time
 * @returns
 */
export function toShortTime(time: number): string {
  const date = new Date(time * 1000)
  return date.toLocaleTimeString('zh-CN', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit'
  })
}
