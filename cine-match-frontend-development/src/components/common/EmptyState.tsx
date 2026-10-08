import type { LucideIcon } from 'lucide-react'
import { SearchX } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  message?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/12 px-6 py-16 text-center',
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-white/8 text-muted-foreground">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="max-w-md space-y-1.5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {message && <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>}
      </div>
      {action}
    </div>
  )
}
