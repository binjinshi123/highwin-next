import React from 'react'
import { Sun, Moon, Laptop } from 'lucide-react'

interface ThemeToggleProps {
  value: string | undefined
  onChange: (theme: 'system' | 'light' | 'dark') => void
  className?: string
}

const themeOptions = [
  { value: 'light', icon: Sun, label: '亮色' },
  { value: 'system', icon: Laptop, label: '跟随系统' },
  { value: 'dark', icon: Moon, label: '暗色' }
]

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  value = 'system',
  onChange,
  className = ''
}) => (
  <div className={`flex gap-2 ${className}`}>
    {themeOptions.map(({ value: option, icon: Icon, label }) => (
      <button
        key={option}
        type="button"
        aria-label={label}
        onClick={() => onChange(option as 'system' | 'light' | 'dark')}
        className={`
          flex items-center justify-center rounded-full
          transition-all duration-200
          ${value === option ? 'border-primary shadow-lg' : 'border-transparent'}
        `}
      >
        <Icon
          className={`
            size-5 hover:text-accent-foreground
            transition-colors duration-200
            ${value === option ? 'text-primary' : 'text-muted-foreground'}
          `}
        />
      </button>
    ))}
  </div>
)

export default ThemeToggle
