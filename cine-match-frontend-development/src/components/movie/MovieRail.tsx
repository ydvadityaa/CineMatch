'use client'

import { ErrorState } from '@/components/common/ErrorState'
import { CarouselSkeleton } from '@/components/common/LoadingSkeleton'
import { useMovies } from '@/hooks/use-movies'
import { useInView } from '@/hooks/use-ui'
import { RAIL_SIZE } from '@/lib/config'
import { PAGE_X } from '@/lib/ui'
import { cn } from '@/lib/utils'
import type { MovieListParams } from '@/types/movie'
import { MovieCard } from './MovieCard'
import { CAROUSEL_ITEM, MovieCarousel } from './MovieCarousel'
import { RankedMovieCard } from './RankedMovieCard'

interface MovieRailProps {
  title: string
  params: MovieListParams
  href?: string
  subtitle?: string
  /** Show large ranking numbers (used for "Trending Now"). */
  ranked?: boolean
  /** Fetch immediately instead of waiting until the rail nears the viewport. */
  eager?: boolean
}

/**
 * Self-contained home rail: fetches its own page of movies once it scrolls
 * near the viewport, so the home page never loads every section up front.
 */
export function MovieRail({ title, params, href, subtitle, ranked = false, eager = false }: MovieRailProps) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const shouldFetch = eager || inView
  const { data, error, isLoading, mutate } = useMovies({ limit: RAIL_SIZE, ...params }, shouldFetch)
  const items = ranked ? data?.items.slice(0, 10) : data?.items

  if (!isLoading && !error && shouldFetch && items?.length === 0) return null

  return (
    <div ref={ref} className="min-h-[300px]">
      {error ? (
        <div className={cn(PAGE_X)}>
          <h2 className="mb-3 font-display text-2xl font-semibold tracking-wide text-white uppercase">
            {title}
          </h2>
          <ErrorState error={error} compact onRetry={() => void mutate()} />
        </div>
      ) : !items ? (
        <div>
          <div className={cn('mb-3', PAGE_X)}>
            <h2 className="font-display text-2xl font-semibold tracking-wide text-white uppercase sm:text-[1.7rem]">
              {title}
            </h2>
          </div>
          <div className={PAGE_X}>
            <CarouselSkeleton />
          </div>
        </div>
      ) : (
        <MovieCarousel title={title} href={href} subtitle={subtitle}>
          {items.map((movie, index) =>
            ranked ? (
              <div key={movie.id} role="listitem" className="w-[190px] sm:w-[220px] lg:w-[250px]">
                <RankedMovieCard movie={movie} rank={index + 1} />
              </div>
            ) : (
              <div key={movie.id} role="listitem" className={CAROUSEL_ITEM}>
                <MovieCard
                  movie={movie}
                  sizes="(min-width: 1024px) 196px, (min-width: 640px) 170px, 140px"
                />
              </div>
            ),
          )}
        </MovieCarousel>
      )}
    </div>
  )
}
