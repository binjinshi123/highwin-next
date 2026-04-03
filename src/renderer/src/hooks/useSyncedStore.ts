import { useSyncExternalStore } from 'react'
import { SyncedStore } from '@renderer/store/SyncedStore'

interface SyncedStoreOptions {
  defaultValue: any
  storageKey: string
}

export const createSyncedStore = ({ defaultValue, storageKey }: SyncedStoreOptions) => {
  const store = new SyncedStore(defaultValue, storageKey)
  return () => useSyncExternalStore(store.subscribe, store.getSnapshot)
}
