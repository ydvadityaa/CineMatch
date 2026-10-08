import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

interface SelectFieldProps {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
  className?: string
}

export function SelectField({ label, value, options, onChange, className }: SelectFieldProps) {
  const id = useId()
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full cursor-pointer appearance-none rounded-md border border-white/12 bg-surface-2 pr-9 pl-3 text-sm text-white transition-colors outline-none hover:border-white/25 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-card text-white">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
