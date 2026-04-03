import { searchSymbols } from '@renderer/api/itp-client'
import { cn } from '@renderer/lib/utils'
import { Security } from '@shared/types'
import { useTheme } from 'next-themes'
import { JSX } from 'react'
import { SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'

interface Props {
  plateIds?: number[]
  value?: Security
  onValueChange?: (value: Security | undefined) => void
  className?: string
}

type SecurityOption = {
  value: number
  label: string
  security: Security
}

export function InlineSecuritySearch({
  plateIds,
  value,
  onValueChange,
  className
}: Props): JSX.Element {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // 转换 Security 为 react-select Option
  const toOption = (s: Security): SecurityOption => ({
    value: s.securityid,
    label: `${s.symbol} ${s.shortname}`,
    security: s
  })

  const promiseOptions = async (inputValue: string): Promise<SecurityOption[]> => {
    const securities = await searchSymbols(inputValue, plateIds)
    return securities.map(toOption)
  }

  // 当前选中项转 Option
  const selectedOption = value
    ? { value: value.securityid, label: `${value.symbol} ${value.shortname}`, security: value }
    : undefined

  const handleChange = (newValue: SingleValue<SecurityOption>): void => {
    if (onValueChange) {
      if (newValue && newValue.security) {
        onValueChange(newValue.security)
      } else {
        onValueChange(undefined)
      }
    }
  }

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? '#1f2937' : 'white', // dark:bg-gray-800
      borderColor: isDark ? '#374151' : '#d1d5db', // dark:border-gray-700
      color: isDark ? '#f9fafb' : '#111827', // dark:text-gray-100
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none', // optional focus ring
      '&:hover': {
        borderColor: isDark ? '#4b5563' : '#9ca3af'
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? '#1f2937' : 'white',
      color: isDark ? '#f9fafb' : '#111827'
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#f9fafb' : '#111827'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? isDark
          ? '#374151'
          : '#e5e7eb'
        : isDark
          ? '#1f2937'
          : 'white',
      color: isDark ? '#f9fafb' : '#111827'
    }),
    input: (base) => ({
      ...base,
      color: isDark ? '#f9fafb' : '#111827'
    })
  }

  return (
    <AsyncSelect
      isSearchable={true}
      isClearable={true}
      styles={customStyles}
      value={selectedOption}
      onChange={handleChange}
      loadOptions={promiseOptions}
      placeholder="代码或名称首字母"
      className={cn('z-11 w-50 text-sm', className)}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null
      }}
      noOptionsMessage={() => '暂无数据'}
    />
  )
}
