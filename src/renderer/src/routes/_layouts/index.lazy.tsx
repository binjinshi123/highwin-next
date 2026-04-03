import { MainMenu } from '@renderer/components/MainMenu'
import { ModeToggle } from '@renderer/components/ModeToggle'
import { createLazyFileRoute } from '@tanstack/react-router'
import { JSX } from 'react'
import highwinLogo from '@renderer/assets/icon.ico'
import { ModuleNavigation } from '@renderer/components/Module'
import { QuestionBox } from '@renderer/components/QuestionBox'

export const Route = createLazyFileRoute('/_layouts/')({
  component: Index
})

function Index(): JSX.Element {
  document.title = '新标签页'
  return (
    <main className="h-screen container mx-auto py-3 space-y-8">
      <div className="flex justify-end gap-1">
        <MainMenu />
        <ModeToggle />
      </div>
      <img alt="Highwin Logo" className="w-24 mx-auto animate-pulse" src={highwinLogo} />
      <QuestionBox />
      <ModuleNavigation />
    </main>
  )
}
