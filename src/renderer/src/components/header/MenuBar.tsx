import { useAuthHook } from '@renderer/hooks/useAuth'
import { cn } from '@renderer/lib/utils'
import { Menu } from 'lucide-react'
import { JSX } from 'react'

function MenuBar(): JSX.Element {
  const { user } = useAuthHook()
  const isLogin = user != null
  const openMenu = (): void => {
    window.app.showMenu()
  }

  return (
    <div
      className={cn(
        'h-full flex items-center px-2',
        isLogin ? 'cursor-pointer' : 'cursor-not-allowed'
      )}
    >
      <Menu onClick={openMenu} strokeWidth={1}></Menu>
    </div>
  )
}

export default MenuBar
