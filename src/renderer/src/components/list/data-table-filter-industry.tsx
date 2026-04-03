import { JSX, useEffect, useState } from 'react'
import { ClearableSelect, Option } from '../clearable-select'
import { getIndustries } from '@renderer/api/itp-client'
import { cn } from '@renderer/lib/utils'

interface Props {
  value?: number
  onValueChange?: (value: number | undefined) => void
  className?: string
}

export function DataTableFilterIndustry({ value, onValueChange, className }: Props): JSX.Element {
  const [options, setOptions] = useState<Option[]>([])
  useEffect(() => {
    getIndustries().then((res) => {
      setOptions(res.map((plate) => ({ label: plate.name, value: plate.id.toString() })))
    })
  }, [])

  const handleValueChange = (newValue: string): void => {
    if (onValueChange) {
      if (newValue) {
        onValueChange(Number(newValue))
      } else {
        onValueChange(undefined)
      }
    }
  }

  return (
    <ClearableSelect
      value={value ? value.toString() : ''}
      onValueChange={handleValueChange}
      options={options}
      placeholder="按行业筛选"
      className={cn('w-fit', className)}
    />
  )
}
