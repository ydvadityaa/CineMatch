import Link from 'next/link'
import { Film, RotateCw, ServerCrash, WifiOff, type LucideIcon } from 'lucide-react'
import { cta } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { ApiError } from '@/services/api'

interface ErrorStateProps {
  error?: unknown
  title?: string
  message?: string
  onRetry?: () => void
  compact?: boolean
  className?: string
}

interface Described {
  icon: LucideIcon
  title: string
  message: string
}

function describe(error: unknown): Described {
  if (error instanceof ApiError) {
    if (error.kind === 'network') {
      return {
        icon: WifiOff,
        title: 'CineMatch service unavailable',
        message:
          'We could not reach the movie service. Make sure the backend is running, then try again.',
      }
    }
    if (error.kind === 'not_found') {
      return {
        icon: Film,
        title: 'Movie not found',
        message: 'This title may have been removed or the link is incorrect.',
      }
    }
  }
  return {
    icon: ServerCrash,
    title: 'Something went wrong',
    message: 'The request failed unexpectedly. Please try again in a moment.',
  }
}

export function ErrorState({
  error,
  title,
  message,
  onRetry,
  compact = false,
  className,
}: ErrorStateProps) {
  const described = describe(error)
  const Icon = described.icon
  const isNotFound = error instanceof ApiError && error.kind === 'not_found'

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface text-center',
        compact ? 'gap-3 px-6 py-8' : 'gap-4 px-6 py-16',
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="max-w-md space-y-1.5">
        <h2 className="text-lg font-semibold text-white">{title ?? described.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {message ?? described.message}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && !isNotFound && (
          <button type="button" onClick={onRetry} className={cta('primary', 'sm')}>
            <RotateCw aria-hidden="true" />
            Try again
          </button>
        )}
        {isNotFound && (
          <Link href="/movies" className={cta('primary', 'sm')}>
            Browse movies
          </Link>
        )}
      </div>
    </div>
  )
}
