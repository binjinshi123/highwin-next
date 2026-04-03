import { createContext, JSX, ReactNode, useContext } from 'react'
import { useAuthHook } from './hooks/useAuth'
import { UserInfo } from '@shared/types'

export interface AuthState {
  user: UserInfo | null
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const { user } = useAuthHook()
  return <AuthContext value={{ user }}>{children}</AuthContext>
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
