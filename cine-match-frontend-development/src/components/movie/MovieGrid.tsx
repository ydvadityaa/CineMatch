import { GRID_CLASSES } from '@/components/common/LoadingSkeleton'
import { cn } from '@/lib/utils'
import type { CardMovie } from '@/types/movie'
import { MovieCard } from './MovieCard'

interface MovieGridProps {
  movies: CardMovie[]
  className?: string
}

export function MovieGrid({ movies, className }: MovieGridProps) {
  return (
    <div className={cn(GRID_CLASSES, className)}>
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} priority={index < 6} />
      ))}
    </div>
  )
}
