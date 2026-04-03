'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { cn } from '@renderer/lib/utils'
import { JSX, useState } from 'react'
import { DataTablePagination } from '@renderer/components/list/data-table-pagination'
import { DataTableViewOptions } from '@renderer/components/list/data-table-view-options'
import { Skeleton } from '@renderer/components/ui/skeleton'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  rowCount: number
  className?: string
  pagination: PaginationState
  onPaginationChange?: (updater: Updater<PaginationState>) => void
  onSortingChange?: (updater: Updater<SortingState>) => void
}

export const defaultPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 20
}
export function DataTable<TData>({
  columns,
  data,
  rowCount,
  className,
  pagination,
  onPaginationChange,
  onSortingChange
}: DataTableProps<TData>): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([])

  const onSortingChangeInner: OnChangeFn<SortingState> = (updater: Updater<SortingState>): void => {
    setSorting(updater)

    if (onSortingChange) {
      onSortingChange(updater)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: onPaginationChange,
    onSortingChange: onSortingChangeInner,
    rowCount: rowCount,
    state: {
      pagination,
      sorting
    }
  })

  return (
    <div
      className={cn(
        'text-nowrap overflow-y-hidden flex flex-col justify-between tabular-nums',
        className
      )}
    >
      <Table className="border-y">
        <TableHeader className="sticky top-0 bg-background shadow z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="px-0" style={{ width: header.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-1"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : // 显示 Skeleton 占位
              Array.from({ length: pagination.pageSize }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton className="h-4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center gap-4 px-2">
        <DataTablePagination table={table} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
