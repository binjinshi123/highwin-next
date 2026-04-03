'use client'

import { ColumnDef } from '@tanstack/react-table'
import { L1Tick } from '@renderer/types/quote'
import { formatPrice, toPercent, toReadable } from '@renderer/lib/fmt'
import { getPriceFg, getPriceForeground } from '@renderer/lib/getters'
import { cn } from '@renderer/lib/utils'
import { DataTableRowActions } from './data-table-row-actions'
import { DataTableColumnHeader } from './data-table-column-header'
import { Link } from '@tanstack/react-router'
import { PlateType } from '@shared/types'
import { UpDownFlatMiniBar } from './up-down-flat-mini-bar'

const idHeaderMap = new Map([
  ['sm', '代码'],
  ['sn', '名称'],
  ['cp', '最新价'],
  ['cr', '涨跌幅'],
  ['cg', '涨跌'],
  ['bp', '买价'],
  ['sp', '卖价'],
  ['tr', '换手'],
  ['at', '振幅'],
  ['tq', '总手'],
  ['tm', '总额'],
  ['ic', '行业'],
  ['nav', '净值'],
  ['ufd', '涨平跌'],
  ['lcp', '昨收'],
  ['op', '开盘价'],
  ['hp', '最高价'],
  ['lp', '最低价']
])

// base: 代码, 名称, 最新价, 涨跌幅, 涨跌
// 股票: 买价, 卖价, 换手, 振幅, 总手, 总额, 行业, 操作
// 基金: 买价, 卖价, 净值, 换手, 振幅, 总手, 总额, 操作
// 债券: 买价, 卖价, 换手, 振幅, 总手, 总额, 操作
// 指数: 昨收, 开盘价, 最高价, 最低价, 总手, 总额, 涨平跌, 操作
const COLUMN_FIELDS = {
  stock: ['rn', 'sm', 'sn', 'cp', 'cr', 'cg', 'bp', 'sp', 'tr', 'at', 'tq', 'tm', 'ic', 'actions'],
  fund: ['rn', 'sm', 'sn', 'cp', 'cr', 'cg', 'bp', 'sp', 'nav', 'tr', 'at', 'tq', 'tm', 'actions'],
  bond: ['rn', 'sm', 'sn', 'cp', 'cr', 'cg', 'bp', 'sp', 'tr', 'at', 'tq', 'tm', 'actions'],
  index: ['rn', 'sm', 'sn', 'cp', 'cr', 'cg', 'lcp', 'op', 'hp', 'lp', 'tq', 'tm', 'ufd', 'actions']
}

const COLUMN_TEMPLATES: Record<string, ColumnDef<L1Tick, any>> = {
  rn: {
    id: 'rowNumber',
    accessorKey: 'rowNumber',
    header: '',
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const rowIndex = row.index // 当前行在当前页的索引
      return <div className="text-center">{pageIndex * pageSize + rowIndex + 1}</div>
    },
    enableSorting: false,
    enableHiding: false,
    size: 50
  },
  sm: {
    id: 'sm',
    accessorKey: 'sm',
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const { sm, mk, securityType } = row.original
      return (
        <Link
          to="/chart"
          search={{ symbol: `${sm}.${mk}.${securityType}` }}
          target="_blank"
          className="px-2 py-1 rounded bg-secondary hover:bg-primary hover:text-primary-foreground"
        >
          {sm}
        </Link>
      )
    },
    enableHiding: false
  },
  sn: {
    id: 'sn',
    accessorKey: 'sn',
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    enableSorting: false
  },
  cp: {
    id: 'cp',
    accessorKey: 'cp',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { cp, cg, minTickSize } = row.original
      return (
        <div className={cn('text-right', getPriceForeground(cg))}>
          {formatPrice(cp, minTickSize)}
        </div>
      )
    }
  },
  cr: {
    id: 'cr',
    accessorKey: 'cr',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { cr, cg } = row.original
      return <div className={cn('text-right', getPriceForeground(cg))}>{toPercent(cr, true)}</div>
    }
  },
  cg: {
    id: 'cg',
    accessorKey: 'cg',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { cg, minTickSize } = row.original
      return (
        <div className={cn('text-right', getPriceForeground(cg))}>
          {formatPrice(cg, minTickSize, true)}
        </div>
      )
    }
  },
  bp: {
    id: 'bp',
    accessorKey: 'bp',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { bp, lcp, minTickSize } = row.original
      return (
        <div className={cn('text-right', getPriceFg(bp, lcp))}>{formatPrice(bp, minTickSize)}</div>
      )
    }
  },
  sp: {
    id: 'sp',
    accessorKey: 'sp',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { sp, lcp, minTickSize } = row.original
      return (
        <div className={cn('text-right', getPriceFg(sp, lcp))}>{formatPrice(sp, minTickSize)}</div>
      )
    }
  },
  tr: {
    id: 'tr',
    accessorKey: 'tr',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { tr } = row.original
      return <div className="text-right">{toPercent(tr)}</div>
    }
  },
  at: {
    id: 'at',
    accessorKey: 'at',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { at } = row.original
      return <div className="text-right">{toPercent(at)}</div>
    }
  },
  tq: {
    id: 'tq',
    accessorKey: 'tq',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { tq } = row.original
      return <div className="text-right">{toReadable(tq)}</div>
    }
  },
  tm: {
    id: 'tm',
    accessorKey: 'tm',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { tm } = row.original
      return <div className="text-right">{toReadable(tm)}</div>
    }
  },
  ic: {
    id: 'ic',
    accessorKey: 'ic',
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    enableSorting: false
  },
  nav: {
    id: 'nav',
    accessorKey: 'nav',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { nav, minTickSize } = row.original
      return <div className="text-right">{formatPrice(nav, minTickSize)}</div>
    }
  },
  ufd: {
    id: 'ufd',
    accessorKey: 'ufd',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { un, fn, dn } = row.original
      return <UpDownFlatMiniBar up={un} down={dn} flat={fn} />
    },
    enableSorting: false
  },
  lcp: {
    id: 'lcp',
    accessorKey: 'lcp',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { lcp, minTickSize } = row.original
      return <div className="text-right">{formatPrice(lcp, minTickSize)}</div>
    }
  },
  op: {
    id: 'op',
    accessorKey: 'op',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { op, minTickSize } = row.original
      return <div className="text-right">{formatPrice(op, minTickSize)}</div>
    }
  },
  hp: {
    id: 'hp',
    accessorKey: 'hp',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { hp, minTickSize } = row.original
      return <div className="text-right">{formatPrice(hp, minTickSize)}</div>
    }
  },
  lp: {
    id: 'lp',
    accessorKey: 'lp',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { lp, minTickSize } = row.original
      return <div className="text-right">{formatPrice(lp, minTickSize)}</div>
    }
  },
  actions: {
    id: 'actions',
    cell: ({ row }) => (
      <div className="text-center">
        <DataTableRowActions row={row} />
      </div>
    ),
    size: 100
  }
}

export const getColumnTitle = (id: string | null | undefined): string | undefined => {
  if (!id) return ''
  return idHeaderMap.get(id)
}

export function getColumnsByType(type: PlateType): ColumnDef<L1Tick, any>[] {
  return COLUMN_FIELDS[type].map((field) => COLUMN_TEMPLATES[field])
}
