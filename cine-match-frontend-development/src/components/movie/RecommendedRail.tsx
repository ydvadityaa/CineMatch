'use client'

import { ErrorState } from '@/components/common/ErrorState'
import { CarouselSkeleton } from '@/components/common/LoadingSkeleton'
import { useMyList } from '@/context/MyListContext'
import { useRecommendedForYou } from '@/hooks/use-movies'
import { PAGE_X } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { MovieCard } from './MovieCard'
import { CAROUSEL_ITEM, MovieCarousel } from './MovieCarousel'

/**
 * "Recommended For You". Seeds from the most recently saved movie so it already
 * reacts to the user's taste; the backend personalisation can replace the seed later.
 */
export function RecommendedRail() {
  const { items: saved, hydrated } = useMyList()
  const seedId = saved[0]?.id ?? null
  const { data, error, isLoading, mutate } = useRecommendedForYou(seedId, hydrated)

  const subtitle = saved[0]
    ? `Because you saved ${saved[0].title}`
    : 'Handpicked from what is popular right now'

  if (error) {
    return (
      <div className={cn(PAGE_X)}>
        <h2 className="mb-3 font-display text-2xl font-semibold tracking-wide text-white uppercase">
          Recommended For You
        </h2>
        <ErrorState error={error} compact onRetry={() => void mutate()} />
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-[300px]">
        <div className={cn('mb-3', PAGE_X)}>
          <h2 className="font-display text-2xl font-semibold tracking-wide text-white uppercase sm:text-[1.7rem]">
            Recommended For You
          </h2>
        </div>
        <div className={PAGE_X}>
          <CarouselSkeleton />
        </div>
      </div>
    )
  }

  if (data.length === 0) return null

  return (
    <MovieCarousel title="Recommended For You" subtitle={subtitle}>
      {data.map((movie) => (
        <div key={movie.id} role="listitem" className={CAROUSEL_ITEM}>
          <MovieCard
            movie={movie}
            sizes="(min-width: 1024px) 196px, (min-width: 640px) 170px, 140px"
          />
        </div>
      ))}
    </MovieCarousel>
  )
}
