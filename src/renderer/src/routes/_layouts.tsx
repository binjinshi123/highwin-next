import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { JSX } from 'react'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createFileRoute('/_layouts')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.user) {
      const storeUser = window.app?.store?.get('user')
      if (!storeUser) {
        throw redirect({
          to: '/login',
          search: {
            redirect: location.href
          }
        })
      }
    }
  },
  component: LayoutComponent
})

/**
 * LayoutComponent is a functional component that provides a layout for the application.
 * It includes a navigation bar with links to "Home" and "About" pages and renders the
 * child components using the <Outlet /> component from react-router.
 *
 * @returns {JSX.Element} The layout component with navigation and outlet for child components.
 */
export default function LayoutComponent(): JSX.Element {
  return (
    <div className="min-h-screen">
      <Outlet />
      {/* <TanStackRouterDevtools position="top-right" initialIsOpen={false} /> */}
    </div>
  )
}
