import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@renderer/components/LoginForm'
import wavyLines from '@renderer/assets/wavy-lines.svg'
import highwinLogo from '@renderer/assets/hongying_denglu.png'
import * as z from 'zod/v4'
import { JSX } from 'react'

const fallback = '/' as const

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch('')
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.user && window.app?.store?.get('user')) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: LoginComponent
})

function LoginComponent(): JSX.Element {
  document.title = '登录'

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={wavyLines}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-4 p-6 md:p-10 min-h-svh">
        <div className="flex flex-col items-center justify-center w-full">
          <img alt="Highwin Logo" className="w-24 mx-auto mb-[60px]" src={highwinLogo} />
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
