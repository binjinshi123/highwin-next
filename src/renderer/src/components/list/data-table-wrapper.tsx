import { DataTable } from '@renderer/components/list/data-table'
import { getColumnsByType } from '@renderer/components/list/columns'
import { PaginationState, SortingState, Updater } from '@tanstack/react-table'
import { useTableStore } from '@renderer/store/useTableStore'
import { JSX } from 'react'
import { Plate } from '@shared/types'

interface QuotelistTableProps {
  plate: Plate
  pagination: PaginationState
  onPaginationChange: (updater: Updater<PaginationState>) => void
  onSortingChange: (updater: Updater<SortingState>) => void
  className?: string
}

export function QuotelistTable({
  plate,
  pagination,
  onPaginationChange,
  onSortingChange,
  className
}: QuotelistTableProps): JSX.Element {
  const data = useTableStore((s) => s.rowsData)
  const rowCount = useTableStore((s) => s.rowCount)
  const columns = getColumnsByType(plate.type)
  return (
    <DataTable
      columns={columns}
      data={data}
      rowCount={rowCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
      className={className}
    />
  )
}
