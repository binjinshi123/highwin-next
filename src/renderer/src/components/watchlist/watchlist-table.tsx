import { DataTable } from '@renderer/components/list/data-table'
import { watchlistColumns } from '@renderer/components/watchlist/columns'
import { PaginationState, Updater } from '@tanstack/react-table'
import { useTableStore } from '@renderer/store/useTableStore'
import { JSX } from 'react'

interface WatchlistTableProps {
  pagination: PaginationState
  onPaginationChange: (updater: Updater<PaginationState>) => void
}

export const WatchlistTable = function WatchlistTable({
  pagination,
  onPaginationChange
}: WatchlistTableProps): JSX.Element {
  const data = useTableStore((s) => s.rowsData)
  const rowCount = useTableStore((s) => s.rowCount)
  return (
    <DataTable
      columns={watchlistColumns}
      data={data}
      rowCount={rowCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      className="flex-1"
    />
  )
}
