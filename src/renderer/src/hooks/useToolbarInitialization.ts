import { useBoundStore } from '@renderer/store/useBoundStore'
import { useEffect, useState } from 'react'

export function useToolbarInitialization(): boolean {
  const initTab = useBoundStore((state) => state.tabs.initialize)
  const [isInit, setInit] = useState(false)

  useEffect(() => {
    const init = async (): Promise<void> => {
      await initTab()
      setInit(true)
    }
    init()
  }, [])

  return isInit
}
