// import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router'
import { ThemeProvider } from '@renderer/components/ThemeProvider'
import { ThemeSyncToMain } from '@renderer/components/ThemeSyncToMain'
import { Toaster } from '@renderer/components/ui/sonner'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { AuthProvider, useAuth } from './auth'
import './assets/base.css'
import { JSX, useEffect } from 'react'
import { toast } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

    return () => {
      window.app?.onToast(() => {})
    }
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ auth }} />
      </QueryClientProvider>
      <Toaster richColors position="top-center" />
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
