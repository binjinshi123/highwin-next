import { Interval } from '@renderer/types/chart'
import { intervalToggles } from '@renderer/config/chart-config'
import { Toggle } from '@renderer/components/ui/toggle'
import { JSX } from 'react'

interface IntervalSwitcherProps {
  interval: Interval
  onChanged: (oldValue: Interval, newValue: Interval) => void
}

const IntervalSwitcher = ({ interval, onChanged }: IntervalSwitcherProps): JSX.Element => {
  return (
    <div className="h-8 flex items-center px-[1px] gap-0.5 rounded border border-border">
      {intervalToggles.map((button) => (
        <Toggle
          pressed={interval === button.interval}
          key={button.interval}
          size="sm"
          className="h-7 px-1.5"
          onClick={() => onChanged(interval, button.interval)}
        >
          {button.label}
        </Toggle>
      ))}
    </div>
  )
}

export default IntervalSwitcher
