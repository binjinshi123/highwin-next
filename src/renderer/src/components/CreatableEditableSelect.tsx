import { JSX, MouseEvent } from 'react'
import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { components, DropdownIndicatorProps } from 'react-select'

interface AccountSelectProps {
  accounts: { username: string }[]
  value: string
  onChange: (username: string) => void
  onInputChange: (inputValue: string) => void
}

const CreatableEditableSelect = ({
  accounts,
  value,
  onChange,
  onInputChange
}: AccountSelectProps): JSX.Element => {
  const [filterActive, setFilterActive] = useState(false)
  const CustomDropdownIndicator = (
    props: DropdownIndicatorProps<{ value: string; label: string }, false>
  ): JSX.Element => {
    const handleMouseDown = (e: MouseEvent): void => {
      e.stopPropagation()
      setFilterActive(false)
    }
    return (
      <div onMouseDown={handleMouseDown}>
        <components.DropdownIndicator {...props} />
      </div>
    )
  }

  return (
    <CreatableSelect
      classNamePrefix="react-select"
      placeholder=""
      maxMenuHeight={290}
      options={accounts.map((acc) => ({ value: acc.username, label: acc.username }))}
      value={value ? { value, label: value } : null}
      inputValue={value}
      onInputChange={(inputValue, actionMeta) => {
        if (actionMeta.action === 'input-change') {
          onInputChange(inputValue)
        }
        return inputValue
      }}
      onChange={(option) => {
        if (!option) {
          onChange('')
          return
        }
        onChange(option.value)
      }}
      onKeyDown={() => {
        setFilterActive(true) // 有输入才过滤
      }}
      filterOption={(option, rawInput) => {
        if (!filterActive) return true
        return option.label.toLowerCase().includes(rawInput.toLowerCase())
      }}
      onBlur={() => {
        setFilterActive(false)
      }}
      components={{ DropdownIndicator: CustomDropdownIndicator }}
      isClearable
      isSearchable
      formatCreateLabel={(username) => `"${username}"`}
      noOptionsMessage={() => null}
    />
  )
}

export default CreatableEditableSelect
