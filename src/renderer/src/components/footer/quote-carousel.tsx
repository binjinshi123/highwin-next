import { Carousel, CarouselContent, CarouselItem } from '@renderer/components/ui/carousel'
import { JSX, useCallback, useEffect, useRef } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { useTableStore } from '@renderer/store/useTableStore'
import { itpSocket } from '@renderer/lib/signalrManager'
import { formatPrice, toPercent, toReadable } from '@renderer/lib/fmt'
import { getPriceForeground } from '@renderer/lib/getters'
import { cn } from '@renderer/lib/utils'
import { nanoid } from 'nanoid'
import { useMarketReset } from '@renderer/hooks/useMarketReset'

const autoplayDelay = 5000
const symbols = [
  '000001.SSE', // 上证指数
  '399001.SZSE', // 深证成指
  '899050.BSE', // 北证50
  '000688.SSE', // 科创50
  '000300.SSE' // 沪深300
]

export function QuoteCarousel(): JSX.Element {
  // L1分笔数据
  const initializeData = useTableStore((s) => s.initialize)
  const patchData = useTableStore((s) => s.patch)

  const tranParamRef = useRef('')
  const subscribeToken = useRef(nanoid()).current

  const subscribe = useCallback(async (): Promise<void> => {
    const tranParam = `footer`
    tranParamRef.current = tranParam
    await itpSocket.sendMessage('Subscribe', {
      token: subscribeToken,
      QuotationType: 'TickQuotationcs',
      SearchParamData: {
        PageIndex: 1, // 后台 PageIndex 从 1 开始
        PageSize: symbols.length,
        Symbols: symbols.join(',')
      },
      tranParam: tranParam
    })
  }, [symbols])

  const unsubscribe = async (): Promise<void> => {
    await itpSocket.sendMessage('UnSubscribe', {
      token: subscribeToken,
      QuotationType: 'TickQuotationcs'
    })
  }

  useEffect(() => {
    const handleSubscribeReturn = (response: any): void => {
      if (response.quotationType !== 'TickQuotationcs') {
        return
      }

      if (response.tranParam !== tranParamRef.current) {
        console.debug(`tranParam not match: ${response.tranParam} != ${tranParamRef.current}`)
        return
      }

      if (response.isInit) {
        const innerData = response.data
        initializeData(innerData.data)
      } else {
        const l1Tick = response.data.data[0]
        patchData(l1Tick)
      }
    }

    itpSocket.connect(() => {
      subscribe()
    })

    itpSocket.onEvent('SubscribeReturn', handleSubscribeReturn)

    return () => {
      const cleanup = async (): Promise<void> => {
        await unsubscribe()
        // await itpSocket.disconnect()
      }
      cleanup()
    }
  }, [])

  useMarketReset(()=>{
    console.info('market reset: list page')
    itpSocket.connect(() => {
      subscribe()
    })
  })

  const plugin = useRef(Autoplay({ delay: autoplayDelay }))

  return (
    <Carousel
      className="w-full"
      plugins={[plugin.current]}
      opts={{
        align: 'start',
        loop: true
      }}
    >
      <CarouselContent className="ml-0">
        {symbols.map((symbol, index) => (
          <CarouselItem
            key={index}
            className="pl-1 basis-1/2 sm:basic-1/2 md:basis-1/3 lg:basis-1/4 xl:basic-1/5 2xl:basis-1/6"
          >
            <QuoteCarouselItem symbol={symbol} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

function QuoteCarouselItem({ symbol }: { symbol: string }): React.ReactNode {
  const l1Ticks = useTableStore((s) => s.rowsData)
  const quote = l1Ticks.find((x) => `${x.sm}.${x.mk}` === symbol)

  if (!quote) {
    return null
  }

  const { sn, cp, cg, cr, tm, minTickSize } = quote

  return (
    <div className="w-fit flex items-center gap-2">
      <div className="w-14">{sn}</div>
      <div className={cn('w-14 text-right', getPriceForeground(cg))}>
        {formatPrice(cp, minTickSize)}
      </div>
      <div className={cn('w-14 text-right', getPriceForeground(cg))}>{toPercent(cr, true)}</div>
      <div className="w-19 text-right">{toReadable(tm)}</div>
    </div>
  )
}
