import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRating } from '@/utils/format'

interface RatingBadgeProps {
  value: number | null | undefined
  className?: string
}

export function RatingBadge({ value, className }: RatingBadgeProps) {
  const label = formatRating(value)
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-sm font-semibold text-white', className)}
      aria-label={label === 'NR' ? 'Not rated' : `Rated ${label} out of 10`}
    >
      <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
      <span aria-hidden="true">{label}</span>
    </span>
  )
}
