import { createSyncedStore } from './useSyncedStore'
import { Security } from '@shared/types'

const key = 'recent-securities'

const useRecentSecuritiesStore = createSyncedStore({
  storageKey: key,
  defaultValue: []
})

interface useRecentSecuritiesResult {
  recentSecurities: Security[]
  add: (s: Security) => void
}

export const useRecentSecurities = (): useRecentSecuritiesResult => {
  const recentSecurities: Security[] = useRecentSecuritiesStore()

  const add = (s: Security): void => {
    const filtered = recentSecurities.filter((x) => x.securityid != s.securityid)
    const newArray = [s, ...filtered].slice(0, 10)
    if (window.app) {
      window.app.store.set(key, newArray)
    }
  }

  return {
    recentSecurities,
    add
  }
}
