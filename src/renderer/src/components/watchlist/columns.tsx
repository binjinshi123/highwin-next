'use client'

import { ColumnDef } from '@tanstack/react-table'
import { L1Tick } from '@renderer/types/quote'
import { formatPrice, toPercent, toReadable } from '@renderer/lib/fmt'
import { getPriceFg, getPriceForeground } from '@renderer/lib/getters'
import { cn } from '@renderer/lib/utils'
import { DataTableRowActions } from '@renderer/components/list/data-table-row-actions'
import { DataTableColumnHeader } from '@renderer/components/list/data-table-column-header'
import { Link } from '@tanstack/react-router'

export const watchlistColumns: ColumnDef<L1Tick>[] = [
  {
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
  {
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
    enableHiding: false,
    enableSorting: false
  },
  {
    id: 'sn',
    accessorKey: 'sn',
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    enableSorting: false
  },
  {
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
    },
    enableSorting: false
  },
  {
    id: 'cr',
    accessorKey: 'cr',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { cr, cg } = row.original
      return <div className={cn('text-right', getPriceForeground(cg))}>{toPercent(cr, true)}</div>
    },
    enableSorting: false
  },
  {
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
    },
    enableSorting: false
  },
  {
    id: 'bp',
    accessorKey: 'bp',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { bp, lcp, minTickSize } = row.original
      return (
        <div className={cn('text-right', getPriceFg(bp, lcp))}>{formatPrice(bp, minTickSize)}</div>
      )
    },
    enableSorting: false
  },
  {
    id: 'sp',
    accessorKey: 'sp',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { sp, lcp, minTickSize } = row.original
      return (
        <div className={cn('text-right', getPriceFg(sp, lcp))}>{formatPrice(sp, minTickSize)}</div>
      )
    },
    enableSorting: false
  },
  {
    id: 'tr',
    accessorKey: 'tr',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { tr } = row.original
      return <div className="text-right">{toPercent(tr)}</div>
    },
    enableSorting: false
  },
  {
    id: 'at',
    accessorKey: 'at',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { at } = row.original
      return <div className="text-right">{toPercent(at)}</div>
    },
    enableSorting: false
  },
  {
    id: 'tq',
    accessorKey: 'tq',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { tq } = row.original
      return <div className="text-right">{toReadable(tq)}</div>
    },
    enableSorting: false
  },
  {
    id: 'tm',
    accessorKey: 'tm',
    header: ({ column }) => <DataTableColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const { tm } = row.original
      return <div className="text-right">{toReadable(tm)}</div>
    },
    enableSorting: false
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="text-center">
        <DataTableRowActions row={row} />
      </div>
    ),
    size: 100
  }
]
