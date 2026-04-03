import { Carousel, CarouselContent, CarouselItem } from '@renderer/components/ui/carousel'
import { JSX, useRef } from 'react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { useQuery } from '@tanstack/react-query'
import { GetNotices } from '@renderer/api/helper-client'
import { useAuthHook } from '@renderer/hooks/useAuth'
import { Notice } from '@renderer/schemas/helper-schema'
import { cn } from '@renderer/lib/utils'

export function NoticeCarousel({ className }: { className?: string }): React.ReactNode {
  const { user } = useAuthHook()
  const { data } = useQuery({
    queryKey: ['notices', user?.token],
    queryFn: () => GetNotices(user?.token || ''),
    enabled: !!user && !!user.token,
    refetchInterval: 3 * 60 * 1000 // 3 minutes
  })

  const plugin = useRef(AutoScroll({ speed: 1, stopOnInteraction: false, stopOnFocusIn: false }))

  return (
    <Carousel
      className={cn('w-full', className)}
      plugins={[plugin.current]}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {data?.map((notice, i) => (
          <NoticeCarouselItem key={i} data={notice} />
        ))}
        {data?.map((notice, i) => (
          <NoticeCarouselItem key={i + data.length} data={notice} />
        ))}
      </CarouselContent>
    </Carousel>
  )
}

function NoticeCarouselItem({ data, key }: { data: Notice; key: React.Key }): JSX.Element {
  return (
    <CarouselItem
      key={key}
      className={cn(
        'basis-auto',
        data.level === '3'
          ? 'text-destructive'
          : data.level === '2'
            ? 'text-orange-400'
            : 'text-foreground'
      )}
    >
      {data.content}
    </CarouselItem>
  )
}
