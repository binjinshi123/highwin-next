// import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router'
import { ThemeProvider } from '@renderer/components/ThemeProvider'
import { ThemeSyncToMain } from '@renderer/components/ThemeSyncToMain'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { AuthProvider, useAuth } from './auth'
import './assets/base.css'
import { JSX, lazy, Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/** 工具栏/页脚/浮层等独立 WebContentsView 与主内容共用入口，不应重复加载 Sonner（会多次注入全局样式）。 */
function isAuxiliaryRenderer(): boolean {
  const raw = window.location.hash.replace(/^#/, '')
  const path = (raw.split('?')[0] ?? '').replace(/\/$/, '') || '/'
  return (
    path.startsWith('/toolbar') ||
    path.startsWith('/footer') ||
    path.startsWith('/nav-menu') ||
    path.startsWith('/profile') ||
    path.startsWith('/global-search')
  )
}

const Toaster = lazy(async () => {
  const m = await import('@renderer/components/ui/sonner')
  return { default: m.Toaster }
})

// Create a new router instance
const hashHistory = createHashHistory()
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  history: hashHistory,
  context: {
    auth: undefined! // This will be set after we wrap the app in an AuthProvider
  }
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp(): JSX.Element {
  const auth = useAuth()
  const queryClient = new QueryClient()

  useEffect(() => {
    if (isAuxiliaryRenderer()) return

    let cancelled = false
    void import('sonner').then(({ toast }) => {
      if (cancelled) return
      const showToast = (message: string, type?: string): void => {
        switch (type) {
          case 'success':
            toast.success(message)
            break
          case 'warning':
            toast.warning(message)
            break
          default:
            toast(message)
            break
        }
      }
      window.app?.onToast(showToast)
    })

    return () => {
      cancelled = true
      window.app?.onToast(() => {})
    }
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ auth }} />
      </QueryClientProvider>
      {!isAuxiliaryRenderer() && (
        <Suspense fallback={null}>
          <Toaster richColors position="top-center" />
        </Suspense>
      )}
    </>
  )
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    // <StrictMode>
    <ThemeProvider attribute="class">
      <ThemeSyncToMain />
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </ThemeProvider>
    // </StrictMode>
  )
}
