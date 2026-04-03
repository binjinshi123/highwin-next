import { createFileRoute } from '@tanstack/react-router'
import { useAuthHook } from '@renderer/hooks/useAuth'
import { useTheme } from 'next-themes'
import ThemeToggle from '@renderer/components/theme-selector'
import { LogOut, RefreshCw } from 'lucide-react'
import { Separator } from '@renderer/components/ui/separator'

export const Route = createFileRoute('/_layouts/profile')({
  component: Profile
})

export function Profile(): React.ReactNode {
  const { user } = useAuthHook()
  const { theme, setTheme } = useTheme()

  if (!user) {
    return null
  }

  let expireDateString = ''
  if (user.expireDate) {
    const dt = new Date(user.expireDate)
    expireDateString = dt.toLocaleDateString()
  }

  const logout = (): void => {
    window.app.logout()
  }

  const refreshCurrentPage = (): void => {
    void window.app.reloadCurrentPage()
  }

  return (
    <div className="pt-2 flex flex-col overflow-y-hidden">
      <div className="p-2 text-base font-semibold text-center">
        {user ? user.name : 'My Account'}
      </div>
      <div id="profile-content" className="text-sm">
        <div className="px-4 py-2 flex items-center justify-between hover:bg-accent">
          <span>有效期至</span>
          <span>{expireDateString}</span>
        </div>
        <div className="px-4 py-2 flex items-center justify-between hover:bg-accent">
          <span>主题</span>
          <ThemeToggle value={theme} onChange={setTheme} />
        </div>
        <div className="px-4 py-2 flex items-center justify-between hover:bg-accent">
          <span>版本</span>
          <span>{window.app.getVersion()}</span>
        </div>
        <div className="px-4 py-2 flex items-center justify-between hover:bg-accent">
          <span>刷新</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">F5</span>
            <button
              className="rounded-full transition-all duration-200 text-muted-foreground hover:text-accent-foreground"
              onClick={refreshCurrentPage}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2 flex items-center justify-between hover:bg-accent">
          <span>登出</span>
          <button
            className="rounded-full transition-all duration-200 text-muted-foreground hover:text-accent-foreground"
            onClick={logout}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
