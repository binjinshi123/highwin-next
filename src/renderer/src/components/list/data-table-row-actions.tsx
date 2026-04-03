'use client'

import { Row } from '@tanstack/react-table'
import { Heart, MoreHorizontal } from 'lucide-react'

import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { L1Tick } from '@renderer/types/quote'
import { cn, openInNewTab } from '@renderer/lib/utils'
import { useModuleLinks } from '@renderer/hooks/useModuleLinks'
import { useWatchlist } from '@renderer/hooks/useWatchlist'
import { getF9Url } from '@renderer/lib/url-helper'
import { toast } from 'sonner'
import { JSX } from 'react'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>): JSX.Element {
  const l1tick = row.original as L1Tick
  const modules = useModuleLinks()
  const { exists, canAdd, maxCount, add: addSymbol, del: delSymbol } = useWatchlist()

  const symk = `${l1tick.sm}.${l1tick.mk}`
  const isInWatchlist = exists(symk)

  const openF9 = (): void => {
    const f9Url = getF9Url(
      modules.F9.url,
      `${l1tick.sm}.${l1tick.mk}`,
      l1tick.sn,
      l1tick.securityType
    )
    openInNewTab(f9Url)
  }

  const openChart = (): void => {
    const symbol = `${l1tick.sm}.${l1tick.mk}.${l1tick.securityType}`
    const url = `${modules.chart.url}?symbol=${symbol}`
    openInNewTab(url, modules.chart.title)
  }

  const addToWatchlist = (): void => {
    if (canAdd()) {
      addSymbol(symk)
    } else {
      toast.error(`自选股数量不能超过${maxCount}个，请删除一些后再添加。`)
    }
  }

  const removeFromWatchlist = async (): Promise<void> => {
    await delSymbol(symk)
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        className={cn(
          'size-8 p-0 transition-opacity duration-200',
          'group-hover:opacity-100', // 当行被hover时显示
          isInWatchlist ? 'opacity-100' : 'opacity-0' // 在自选列表中时始终显示
        )}
        onClick={isInWatchlist ? removeFromWatchlist : addToWatchlist}
      >
        <span className="sr-only">添加自选</span>
        <Heart className={cn('size-4', isInWatchlist && 'fill-current')} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>操作</DropdownMenuLabel>
          <DropdownMenuItem onClick={openF9}>深度资料</DropdownMenuItem>
          <DropdownMenuItem onClick={openChart}>行情图表</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
