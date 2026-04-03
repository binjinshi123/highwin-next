'use client'

import { ComponentProps, JSX } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>): JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
