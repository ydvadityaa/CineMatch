'use client'

import { memo } from 'react'
import type { CardMovie } from '@/types/movie'
import { MovieCard } from './MovieCard'

interface RankedMovieCardProps {
  movie: CardMovie
  rank: number
}

export const RankedMovieCard = memo(function RankedMovieCard({ movie, rank }: RankedMovieCardProps) {
  return (
    <div className="flex items-end">
      <span
        aria-hidden="true"
        className="text-outline -mr-3 mb-10 shrink-0 select-none font-display text-[6.5rem] leading-[0.75] font-bold tracking-tighter sm:-mr-4 sm:text-[8.5rem]"
      >
        {rank}
      </span>
      <div className="relative w-[118px] shrink-0 sm:w-[140px] lg:w-[160px]">
        <span className="sr-only">Number {rank} trending.</span>
        <MovieCard movie={movie} sizes="160px" />
      </div>
    </div>
  )
})
