import { cn } from '@renderer/lib/utils'
import { toReadable, toPercent, formatPrice } from '@renderer/lib/fmt'
import { getPriceFg, getPriceForeground } from '@renderer/lib/getters'
import { BasicData, SecurityInfo } from '@renderer/types/chart'
import { useChartStore } from '@renderer/store/useChartStore'
import { isBond, isFund, isIndex, isStock } from '@renderer/lib/quoteManager'
import { JSX } from 'react'

interface BasicInfoProps {
  symbol: string
}

const BasicInfo = ({ symbol }: BasicInfoProps): JSX.Element => {
  const data = useChartStore((s) => s.basicDataMap[symbol]) as BasicData
  const securityInfo = useChartStore((s) => s.securityInfo) as SecurityInfo
  const tickSize = securityInfo?.tickSize || 0.01
  const securityType = securityInfo?.securityType || 1
  return (
    <div className="grid grid-cols-2 gap-4 p-2 border rounded text-sm tabular-nums">
      {isIndex(securityType) && (
        <div className="flex">
          <span className="flex-none">最新</span>
          <div className={cn('flex-1 text-right', getPriceFg(data?.cp, data?.lcp))}>
            {formatPrice(data?.cp, tickSize)}
          </div>
        </div>
      )}
      <div className="flex">
        <span className="flex-none">今开</span>
        <div className={cn('flex-1 text-right', getPriceFg(data?.op, data?.lcp))}>
          {formatPrice(data?.op, tickSize)}
        </div>
      </div>
      <div className="flex">
        <span className="flex-none">昨收</span>
        <div className={cn('flex-1 text-right', getPriceForeground(0))}>
          {formatPrice(data?.lcp, tickSize)}
        </div>
      </div>
      <div className="flex">
        <span className="flex-none">最高</span>
        <div className={cn('flex-1 text-right', getPriceFg(data?.hp, data?.lcp))}>
          {formatPrice(data?.hp, tickSize)}
        </div>
      </div>
      <div className="flex">
        <span className="flex-none">最低</span>
        <div className={cn('flex-1 text-right', getPriceFg(data?.lp, data?.lcp))}>
          {formatPrice(data?.lp, tickSize)}
        </div>
      </div>
      {isIndex(securityType) && (
        <>
          <div className="flex">
            <span className="flex-none">涨幅</span>
            <div className={cn('flex-1 text-right', getPriceForeground(data?.cr))}>
              {toPercent(data?.cr, true)}
            </div>
          </div>
          <div className="flex">
            <span className="flex-none">涨跌</span>
            <div className={cn('flex-1 text-right', getPriceForeground(data?.cg))}>
              {formatPrice(data?.cg, tickSize)}
            </div>
          </div>
          <div className="flex">
            <span className="flex-none">均价</span>
            <div className={cn('flex-1 text-right', getPriceFg(data?.ap, data?.lcp))}>
              {formatPrice(data?.ap, tickSize)}
            </div>
          </div>
          <div className="flex">
            <span className="flex-none">总额</span>
            <div className="flex-1 text-right">{toReadable(data?.tm)}</div>
          </div>
        </>
      )}
      <div className="flex">
        <span className="flex-none">总手</span>
        <div className="flex-1 text-right">{toReadable(data?.tq)}</div>
      </div>
      {!isIndex(securityType) && (
        <div className="flex">
          <span className="flex-none">委比</span>
          <div className={cn('flex-1 text-right', getPriceForeground(data?.or))}>
            {toPercent(data?.or)}
          </div>
        </div>
      )}
      {(isStock(securityType) || isFund(securityType)) && (
        <div className="flex">
          <span className="flex-none">换手</span>
          <div className="flex-1 text-right">{toPercent(data?.tr)}</div>
        </div>
      )}
      {isStock(securityType) && (
        <>
          <div className="flex">
            <span className="flex-none">市盈率</span>
            <div className="flex-1 text-right">{data?.pe?.toFixed(2)}</div>
          </div>
          <div className="flex">
            <span className="flex-none">市值</span>
            <div className="flex-1 text-right">{toReadable(data?.marketCap)}</div>
          </div>
        </>
      )}
      {isFund(securityType) && (
        <>
          <div className="flex">
            <span className="flex-none">份额</span>
            <div className="flex-1 text-right">{toReadable(data?.is)}</div>
          </div>
          <div className="flex">
            <span className="flex-none">净值</span>
            <div className="flex-1 text-right">{data?.nav}</div>
          </div>
        </>
      )}
      {isBond(securityType) && (
        <>
          <div className="flex">
            <span className="flex-none">利息</span>
            <div className="flex-1 text-right">{data?.ai?.toFixed(2)}</div>
          </div>
          <div className="flex">
            <span className="flex-none">利率</span>
            <div className="flex-1 text-right">{data?.pvr}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default BasicInfo
