import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function ThemeSyncToMain() {
  const { resolvedTheme } = useTheme()
  useEffect(() => {
    if (window.electron?.ipcRenderer && resolvedTheme) {
      window.electron.ipcRenderer.send('theme-changed', resolvedTheme)
    }
  }, [resolvedTheme])
  return null
}
