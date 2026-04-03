import { ConnectState } from '@renderer/components/footer/connect-state'
import { NoticeCarousel } from '@renderer/components/footer/notice-carousel'
import { QuoteCarousel } from '@renderer/components/footer/quote-carousel'
import { SearchButton } from '@renderer/components/footer/search-button'
import { Separator } from '@renderer/components/ui/separator'
import { createLazyFileRoute } from '@tanstack/react-router'
import { JSX } from 'react'

export const Route = createLazyFileRoute('/footer')({
  component: Footer
})

function Footer(): JSX.Element {
  return (
    <div className="w-full h-10 flex flex-col bg-sidebar text-sidebar-foreground overflow-hidden text-sm">
      <QuoteCarousel />
      <Separator />
      <div className="flex gap-0.5">
        <NoticeCarousel className="flex-1" />
        <SearchButton className="shrink-0" />
        <ConnectState className="shink-0" />
      </div>
    </div>
  )
}
