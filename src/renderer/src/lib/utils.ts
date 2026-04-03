import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export async function openInNewTab(url: string, title?: string): Promise<void> {
  if (window.tabs) {
    await window.tabs.openInNewTab(url, title ?? '')
  } else {
    window.open(url, '_blank')
  }
}

export const getCssVariable = (variable: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
}

export const sleep = (delay?: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, delay))

export const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Returns the ISO week of the date.
 * @param date
 * @returns ISO week
 */
export function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf())
  // ISO 周从周一开始，因此调整到周四
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7))
  const firstThursday = new Date(target.getFullYear(), 0, 4)
  firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7))
  const diff = target.getTime() - firstThursday.getTime()
  const weekNumber = 1 + Math.round(diff / 86400000 / 7)
  return weekNumber
}
