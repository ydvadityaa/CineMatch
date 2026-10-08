'use client'

import { Check, Plus } from 'lucide-react'
import { useMyList } from '@/context/MyListContext'
import { cta, roundIconButton, type CtaSize } from '@/lib/ui'
import { cn } from '@/lib/utils'
import type { CardMovie } from '@/types/movie'

interface AddToListButtonProps {
  movie: CardMovie
  variant?: 'icon' | 'full'
  size?: CtaSize
  className?: string
}

export function AddToListButton({
  movie,
  variant = 'icon',
  size = 'md',
  className,
}: AddToListButtonProps) {
  const { isInList, toggleInList } = useMyList()
  const saved = isInList(movie.id)
  const Icon = saved ? Check : Plus
  const label = saved ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`

  if (variant === 'full') {
    return (
      <button
        type="button"
        aria-pressed={saved}
        aria-label={label}
        onClick={() => toggleInList(movie)}
        className={cta('secondary', size, className)}
      >
        <Icon aria-hidden="true" />
        My List
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={label}
      title={saved ? 'Remove from My List' : 'Add to My List'}
      onClick={() => toggleInList(movie)}
      className={cn(roundIconButton, saved && 'border-white bg-white text-black hover:bg-white/85', className)}
    >
      <Icon aria-hidden="true" />
    </button>
  )
}
