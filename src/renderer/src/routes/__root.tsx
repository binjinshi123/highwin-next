import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { AuthState } from '@renderer/auth'

export interface MyRouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />
})
