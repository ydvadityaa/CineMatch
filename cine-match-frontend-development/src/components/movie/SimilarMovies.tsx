'use client'

import { ErrorState } from '@/components/common/ErrorState'
import { CarouselSkeleton } from '@/components/common/LoadingSkeleton'
import { useSimilarMovies } from '@/hooks/use-movies'
import { PAGE_X } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { MovieCard } from './MovieCard'
import { CAROUSEL_ITEM, MovieCarousel } from './MovieCarousel'

export function SimilarMovies({ movieId, title }: { movieId: number; title: string }) {
  const { data, error, isLoading, mutate } = useSimilarMovies(movieId, 12)

  if (error) {
    return (
      <div className={cn(PAGE_X)}>
        <ErrorState error={error} compact onRetry={() => void mutate()} />
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className={cn(PAGE_X)}>
        <h2 className="mb-3 font-display text-2xl font-semibold tracking-wide text-white uppercase">
          More Like This
        </h2>
        <CarouselSkeleton count={7} />
      </div>
    )
  }

  if (data.recommendations.length === 0) return null

  return (
    <MovieCarousel title="More Like This" subtitle={`Because you are viewing ${title}`}>
      {data.recommendations.map((movie) => (
        <div key={movie.id} role="listitem" className={CAROUSEL_ITEM}>
          <MovieCard
            movie={movie}
            badge={`${Math.round(movie.similarity_score * 100)}% match`}
            sizes="(min-width: 1024px) 196px, (min-width: 640px) 170px, 140px"
          />
        </div>
      ))}
    </MovieCarousel>
  )
}
