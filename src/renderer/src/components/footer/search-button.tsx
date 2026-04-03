import { useAuthHook } from '@renderer/hooks/useAuth'
import { cn } from '@renderer/lib/utils'
import { Search } from 'lucide-react'

export function SearchButton({ className }: { className?: string }): React.ReactNode {
  const { user } = useAuthHook()

  if (!user) {
    return null
  }

  const openSearchWindow = (): void => {
    if (window.app) window.app.showSearch()
  }

  return (
    <button className={cn('px-1 flex', className)} onClick={openSearchWindow}>
      <Search size={18} />
    </button>
  )
}
