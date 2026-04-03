import { createLazyFileRoute } from '@tanstack/react-router'
import { JSX } from 'react'

export const Route = createLazyFileRoute('/_layouts/about')({
  component: About
})

function About(): JSX.Element {
  document.title = '关于'
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">红楹金融终端</h1>
      <div className="bg-muted p-6 rounded-lg">
        <p>
          This is a demo application showcasing Electron with React, TypeScript, TanStack Router and
          TradingView Lightweight Charts.
        </p>
      </div>
    </main>
  )
}
