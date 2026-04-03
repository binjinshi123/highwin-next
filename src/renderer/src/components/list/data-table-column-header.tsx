import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { getColumnTitle } from './columns'
import { HTMLAttributes, JSX } from 'react'

interface DataTableColumnHeaderProps<TData> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData>
  align?: 'left' | 'right'
}

export function DataTableColumnHeader<TData>({
  column,
  align = 'left',
  className
}: DataTableColumnHeaderProps<TData>): JSX.Element {
  const canSort = column.getCanSort()
  const isSorted = column.getIsSorted()

  const handleSort = (): void => {
    if (!canSort) return
    if (isSorted === 'desc') {
      column.toggleSorting(false)
    } else if (isSorted === 'asc') {
      // remove sorting
      column.toggleSorting()
    } else {
      column.toggleSorting(true)
    }
  }

  const sortIcon =
    isSorted === 'desc' ? (
      <ArrowDown size={16} className="text-primary" />
    ) : isSorted === 'asc' ? (
      <ArrowUp size={16} className="text-primary" />
    ) : (
      <ArrowDown size={16} className="text-muted-foreground" />
    )

  return (
    <div
      className={cn(
        'h-full w-full px-2 flex items-center select-none group',
        'hover:bg-secondary', // 鼠标移入时的 hover 颜色
        align === 'left' ? 'flex-row' : 'flex-row-reverse',
        className
      )}
    >
      <span className="truncate">{getColumnTitle(column.columnDef.id)}</span>
      {canSort && (
        <span
          className={cn(
            'p-[2px] group-hover:opacity-100 hover:bg-border rounded transition-opacity',
            isSorted ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleSort}
        >
          {sortIcon}
        </span>
      )}
    </div>
  )
}
