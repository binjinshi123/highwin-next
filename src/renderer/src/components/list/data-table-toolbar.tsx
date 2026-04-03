'use client'

import { Table } from '@tanstack/react-table'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  className?: string
}

export function DataTableToolbar<TData>({ table, className }: DataTableToolbarProps<TData>) {
  return <DataTableViewOptions table={table} className={className} />
}
