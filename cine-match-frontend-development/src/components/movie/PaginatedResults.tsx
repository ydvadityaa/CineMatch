'use client'

import type { ReactNode } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { MovieGridSkeleton } from '@/components/common/LoadingSkeleton'
import { Pagination } from '@/components/common/Pagination'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/utils/format'
import type { PaginatedMovies } from '@/types/movie'
import { MovieGrid } from './MovieGrid'

interface PaginatedResultsProps {
  data: PaginatedMovies | undefined
  error: unknown
  isLoading: boolean
  isValidating: boolean
  onRetry: () => void
  onPageChange: (page: number) => void
  emptyTitle: string
  emptyMessage?: string
  emptyAction?: ReactNode
  /** Noun used in the result count, e.g. "movies". */
  noun?: string
}

export function PaginatedResults({
  data,
  error,
  isLoading,
  isValidating,
  onRetry,
  onPageChange,
  emptyTitle,
  emptyMessage,
  emptyAction,
  noun = 'movies',
}: PaginatedResultsProps) {
  if (error && !data) return <ErrorState error={error} onRetry={onRetry} />
  if (isLoading || !data) return <MovieGridSkeleton count={12} />

  if (data.items.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />
  }

  const handlePageChange = (page: number) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {formatNumber(data.total)} {data.total === 1 ? noun.replace(/s$/, '') : noun}
        {data.total_pages > 1 && ` · page ${data.page} of ${formatNumber(data.total_pages)}`}
      </p>
      <div className={cn('transition-opacity duration-200', isValidating && 'opacity-60')}>
        <MovieGrid movies={data.items} />
      </div>
      <Pagination
        page={data.page}
        totalPages={data.total_pages}
        onPageChange={handlePageChange}
        disabled={isValidating}
      />
    </div>
  )
}
