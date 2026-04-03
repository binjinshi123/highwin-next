export class SyncedStore {
  snapshot
  defaultValue
  storageKey
  listeners = new Set<() => void>()
  constructor(defaultValue = '', storageKey) {
    this.defaultValue = defaultValue
    this.snapshot = window.app?.store.get(storageKey) ?? defaultValue
    this.storageKey = storageKey
  }
  getSnapshot = () => this.snapshot

  onChange = (newValue) => {
    if (JSON.stringify(newValue) === JSON.stringify(this.snapshot)) return
    this.snapshot = newValue ?? this.defaultValue
    this.listeners.forEach((listener) => listener())
  }

  subscribe = (callback: () => void) => {
    this.listeners.add(callback)
    if (this.listeners.size === 1) {
      window.app?.store?.subscribe(this.storageKey, this.onChange)
    }
    return () => {
      this.listeners.delete(callback)
      if (this.listeners.size !== 0) return
      window.app?.store?.unsubscribe(this.storageKey)
    }
  }
}
