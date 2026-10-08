'use client'

import { Info, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ErrorState } from '@/components/common/ErrorState'
import { HeroSkeleton } from '@/components/common/LoadingSkeleton'
import { useFeaturedMovie } from '@/hooks/use-movies'
import { genreHref } from '@/lib/genres'
import { cta, PAGE_X } from '@/lib/ui'
import { backdropUrl } from '@/utils/image'
import { AddToListButton } from './AddToListButton'
import { MovieMetadata } from './MovieMetadata'
import { TrailerModal } from './TrailerModal'

export function Hero() {
  const { data: movie, error, isLoading, mutate } = useFeaturedMovie()
  const [trailerOpen, setTrailerOpen] = useState(false)

  if (isLoading) return <HeroSkeleton />

  if (error || !movie) {
    return (
      <div className="px-4 pt-28 pb-24 sm:px-8 lg:px-14">
        <ErrorState error={error} onRetry={() => void mutate()} />
      </div>
    )
  }

  const backdrop = backdropUrl(movie.backdrop_path, 'original')

  return (
    <section
      aria-label="Featured movie"
      className="relative isolate flex min-h-[80svh] w-full items-end overflow-hidden sm:min-h-[90svh]"
    >
      {backdrop && (
        <Image
          src={backdrop}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 animate-fade-in object-cover object-[70%_center] sm:object-center"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-background/90 via-background/35 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/20 to-background/40" />

      <div className={`${PAGE_X} w-full pb-36 sm:pb-44`}>
        <div className="max-w-2xl space-y-4">
          <p className="animate-fade-up text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            Featured tonight
          </p>
          <h1 className="animate-fade-up font-display text-5xl leading-[0.95] font-bold tracking-tight text-balance text-white uppercase [animation-delay:80ms] sm:text-7xl lg:text-8xl">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="animate-fade-up text-base text-white/80 italic [animation-delay:140ms] sm:text-lg">
              {movie.tagline}
            </p>
          )}
          <div className="animate-fade-up space-y-3 [animation-delay:200ms]">
            <MovieMetadata movie={movie} />
            <ul className="flex flex-wrap gap-2">
              {movie.genres.slice(0, 4).map((genre) => (
                <li key={genre}>
                  <Link
                    href={genreHref(genre)}
                    className="inline-block rounded-full border border-white/25 bg-black/30 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="line-clamp-3 max-w-xl animate-fade-up text-sm leading-relaxed text-white/80 [animation-delay:260ms] sm:text-base">
            {movie.overview}
          </p>
          <div className="flex animate-fade-up flex-wrap gap-3 pt-2 [animation-delay:320ms]">
            <button type="button" onClick={() => setTrailerOpen(true)} className={cta('light', 'lg')}>
              <Play className="fill-current" aria-hidden="true" />
              Watch Trailer
            </button>
            <Link href={`/movies/${movie.id}`} className={cta('secondary', 'lg')}>
              <Info aria-hidden="true" />
              More Info
            </Link>
            <AddToListButton movie={movie} variant="full" size="lg" className="hidden sm:inline-flex" />
          </div>
        </div>
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        title={movie.title}
        trailerKey={movie.trailer_key}
        backdropPath={movie.backdrop_path}
      />
    </section>
  )
}
