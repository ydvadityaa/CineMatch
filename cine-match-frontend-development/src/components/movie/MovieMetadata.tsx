import { RatingBadge } from '@/components/common/RatingBadge'
import { cn } from '@/lib/utils'
import type { MovieDetail } from '@/types/movie'
import {
  formatRuntime,
  formatVotes,
  formatYear,
  languageLabel,
} from '@/utils/format'

interface MovieMetadataProps {
  movie: Pick<
    MovieDetail,
    'vote_average' | 'vote_count' | 'release_date' | 'runtime' | 'original_language'
  >
  showVotes?: boolean
  showLanguage?: boolean
  className?: string
}

/** One-line summary: rating, year, runtime and (optionally) votes and language. */
export function MovieMetadata({
  movie,
  showVotes = false,
  showLanguage = false,
  className,
}: MovieMetadataProps) {
  const year = formatYear(movie.release_date)
  const runtime = formatRuntime(movie.runtime)
  const language = showLanguage ? languageLabel(movie.original_language) : ''

  return (
    <ul
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-white/85',
        className,
      )}
    >
      <li>
        <RatingBadge value={movie.vote_average} />
      </li>
      {showVotes && (
        <li className="text-muted-foreground">{formatVotes(movie.vote_count)} votes</li>
      )}
      {year && <li>{year}</li>}
      {runtime && <li>{runtime}</li>}
      {language && (
        <li className="rounded border border-white/25 px-1.5 py-px text-xs">{language}</li>
      )}
    </ul>
  )
}
