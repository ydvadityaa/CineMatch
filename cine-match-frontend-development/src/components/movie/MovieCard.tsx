'use client'

import { Info, Play } from 'lucide-react'
import Link from 'next/link'
import { memo } from 'react'
import { RatingBadge } from '@/components/common/RatingBadge'
import { roundIconButton } from '@/lib/ui'
import { cn } from '@/lib/utils'
import type { CardMovie } from '@/types/movie'
import { formatYear } from '@/utils/format'
import { AddToListButton } from './AddToListButton'
import { LikeButton } from './LikeButton'
import { MoviePoster } from './MoviePoster'

interface MovieCardProps {
  movie: CardMovie
  /** Optional label shown top-left, e.g. a match percentage. */
  badge?: string
  priority?: boolean
  sizes?: string
  className?: string
}

const DEFAULT_SIZES = '(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 46vw'

export const MovieCard = memo(function MovieCard({
  movie,
  badge,
  priority = false,
  sizes = DEFAULT_SIZES,
  className,
}: MovieCardProps) {
  const href = `/movies/${movie.id}`
  const year = formatYear(movie.release_date)

  return (
    <article className={cn('group/card relative', className)}>
      <div className="relative rounded-lg shadow-black/60 transition-all duration-300 ease-out md:group-focus-within/card:z-30 md:group-focus-within/card:scale-[1.04] md:group-focus-within/card:shadow-2xl md:group-hover/card:z-30 md:group-hover/card:scale-[1.04] md:group-hover/card:shadow-2xl">
        <Link
          href={href}
          className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <MoviePoster title={movie.title} path={movie.poster_path} sizes={sizes} priority={priority} />
        </Link>

        {badge && (
          <span className="pointer-events-none absolute top-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-400 backdrop-blur-sm">
            {badge}
          </span>
        )}

        <div className="absolute top-2 right-2 md:hidden">
          <AddToListButton movie={movie} className="size-8" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 rounded-b-lg bg-gradient-to-t from-black via-black/90 to-transparent px-3 pt-14 pb-3 opacity-0 transition-all duration-300 md:block md:group-focus-within/card:translate-y-0 md:group-focus-within/card:opacity-100 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100">
          <div className="pointer-events-auto flex items-center gap-1.5">
            <Link
              href={`${href}?trailer=1`}
              aria-label={`Play trailer for ${movie.title}`}
              title="Play trailer"
              className={cn(roundIconButton, 'border-white bg-white text-black hover:bg-white/85')}
            >
              <Play className="fill-current" aria-hidden="true" />
            </Link>
            <AddToListButton movie={movie} />
            <LikeButton movieId={movie.id} title={movie.title} />
            <Link
              href={href}
              aria-label={`More info about ${movie.title}`}
              title="More info"
              className={cn(roundIconButton, 'ml-auto')}
            >
              <Info aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <RatingBadge value={movie.vote_average} className="text-xs" />
            <span className="truncate text-muted-foreground">
              {movie.genres.slice(0, 2).join(' · ')}
            </span>
          </div>
        </div>
      </div>

      <Link href={href} tabIndex={-1} aria-hidden="true" className="mt-2.5 block">
        <h3 className="truncate text-sm font-medium text-white">{movie.title}</h3>
        <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <RatingBadge value={movie.vote_average} className="text-xs text-muted-foreground" />
          {year && <span>{year}</span>}
        </p>
      </Link>
    </article>
  )
})
