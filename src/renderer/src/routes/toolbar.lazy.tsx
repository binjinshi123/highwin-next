import TabBar from '@renderer/components/header/TabBar'
// import NavBar from '@renderer/components/header/NavBar'
import MenuBar from '@renderer/components/header/MenuBar'
import { useToolbarInitialization } from '@renderer/hooks/useToolbarInitialization'
import { createLazyFileRoute } from '@tanstack/react-router'
import { cn } from '@renderer/lib/utils'
import { JSX } from 'react'
import Profile from '@renderer/components/header/Profile'

export const Route = createLazyFileRoute('/toolbar')({
  component: Toolbar
})

// warning: any child of this component cannot use anything outside of the tab-slice state.
function Toolbar(): JSX.Element {
  const isInitialized = useToolbarInitialization()
  const isMac = window.electron.process.platform === 'darwin'

  const PlatformToolbar = (): JSX.Element => {
    return (
      <div className="flex flex-row items-center w-full overflow-hidden">
        <MenuBar />
        {/* <NavBar /> */}
        <div className="w-full h-full titlebar">{isInitialized && <TabBar />}</div>
        <Profile />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'h-[35px] w-full flex flex-row justify-end bg-sidebar text-sidebar-foreground',
        isMac ? 'pl-[90px]' : 'pr-[140px]'
      )}
    >
      <PlatformToolbar />
    </div>
  )
}
