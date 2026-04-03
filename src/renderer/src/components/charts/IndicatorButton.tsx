import indicatorIcon from '@renderer/assets/indicator.svg'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { useChartStore } from '@renderer/store/useChartStore'
import { Indicator } from '@renderer/types/chart'
import { JSX } from 'react'

interface IndicatorButtonProps {
  onCheckStateChange: (indicator: Indicator, checked: boolean) => void // 状态变化回调
}

function IndicatorButton({ onCheckStateChange }: IndicatorButtonProps): JSX.Element {
  const checkStatus = useChartStore((x) => x.indicatorState)
  const setCheckStatus = useChartStore((x) => x.setIndicatorState)

  const onIndicatorChange = (indicator: Indicator, checked: boolean): void => {
    setCheckStatus(indicator, checked)
    onCheckStateChange(indicator, checked)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 gap-1 px-2">
          <img className="dark:invert" src={indicatorIcon} />
          指标
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(checkStatus).map(([key, label]) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={label.checked}
            disabled={label.disabled}
            onCheckedChange={(checked) => onIndicatorChange(key as Indicator, checked)}
          >
            {label.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default IndicatorButton
