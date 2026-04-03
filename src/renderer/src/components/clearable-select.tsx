import { JSX, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { X } from 'lucide-react'

export interface Option {
  label: string
  value: string
}

interface ClearableSelectProps {
  options: Option[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function ClearableSelect({
  options,
  value: controlledValue,
  onValueChange,
  placeholder = '请选择',
  className = ''
}: ClearableSelectProps): JSX.Element {
  const [uncontrolledValue, setUncontrolledValue] = useState<string>('')

  // 支持受控和非受控
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue
  const setValue = (v: string): void => {
    if (onValueChange) onValueChange(v)
    if (controlledValue === undefined) setUncontrolledValue(v)
  }

  return (
    <div className="flex items-center space-x-1">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && (
        <button onClick={() => setValue('')} className="hover:text-destructive">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
