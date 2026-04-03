import { cacheStore } from './handlers/store-handler'

/**
 * Updates stored tabs
 * @param tabs Array of tab urls
 */
export function setTabs(tabs: string[]) {
  cacheStore.set('tabs', tabs)
}

/**
 * Retrieves stored tabs
 */
export function getTabs(): string[] | null {
  const data = cacheStore.get('tabs', null) as string[] | null
  if (!data) return null
  return data
}

/**
 * Updates selected tab index
 * @param index Index of selected tab
 */
export function setSelected(index: number) {
  cacheStore.set('selectedTabIndex', index)
}

/**
 * Retrieves selected tab index
 */
export function getSelected(): number {
  const data = cacheStore.get('selectedTabIndex', null) as number | null
  if (data == null) return -1
  return data
}
