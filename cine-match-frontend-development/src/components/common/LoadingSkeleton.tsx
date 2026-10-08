import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('skeleton rounded-md', className)} />
}

export function MovieCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2.5', className)} aria-hidden="true">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export const GRID_CLASSES =
  'grid grid-cols-2 gap-x-3.5 gap-y-7 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className={GRID_CLASSES} role="status" aria-label="Loading movies">
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading movies</span>
    </div>
  )
}

export function CarouselSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="no-scrollbar flex gap-3 overflow-hidden sm:gap-4"
      role="status"
      aria-label="Loading movies"
    >
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} className="w-[140px] shrink-0 sm:w-[170px] lg:w-[196px]" />
      ))}
      <span className="sr-only">Loading movies</span>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div
      className="relative min-h-[78svh] w-full overflow-hidden bg-surface sm:min-h-[88svh]"
      role="status"
      aria-label="Loading featured movie"
    >
      <div className="absolute inset-0 skeleton opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="relative flex min-h-[78svh] flex-col justify-end gap-4 px-4 pb-24 sm:min-h-[88svh] sm:px-8 lg:px-14">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-14 w-full max-w-xl sm:h-20" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
        <div className="mt-2 flex gap-3">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-36" />
        </div>
      </div>
      <span className="sr-only">Loading featured movie</span>
    </div>
  )
}

export function MovieDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading movie details">
      <div className="relative h-[52svh] min-h-[340px] w-full bg-surface">
        <div className="absolute inset-0 skeleton opacity-50" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="relative -mt-40 grid gap-8 px-4 sm:px-8 md:grid-cols-[260px_1fr] lg:px-14">
        <Skeleton className="mx-auto aspect-[2/3] w-44 rounded-xl sm:w-56 md:w-full" />
        <div className="space-y-4 pt-2 md:pt-24">
          <Skeleton className="h-12 w-3/4 max-w-lg" />
          <Skeleton className="h-4 w-1/2 max-w-sm" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-2/3 max-w-xl" />
        </div>
      </div>
      <span className="sr-only">Loading movie details</span>
    </div>
  )
}
