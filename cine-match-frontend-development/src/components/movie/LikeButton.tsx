'use client'

import { ThumbsUp } from 'lucide-react'
import { useMyList } from '@/context/MyListContext'
import { cta, roundIconButton, type CtaSize } from '@/lib/ui'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  movieId: number
  title: string
  variant?: 'icon' | 'full'
  size?: CtaSize
  className?: string
}

export function LikeButton({
  movieId,
  title,
  variant = 'icon',
  size = 'md',
  className,
}: LikeButtonProps) {
  const { isLiked, toggleLike } = useMyList()
  const liked = isLiked(movieId)
  const label = liked ? `Remove like from ${title}` : `Like ${title}`

  if (variant === 'full') {
    return (
      <button
        type="button"
        aria-pressed={liked}
        aria-label={label}
        onClick={() => toggleLike(movieId)}
        className={cta('secondary', size, className)}
      >
        <ThumbsUp className={cn(liked && 'fill-white')} aria-hidden="true" />
        {liked ? 'Liked' : 'Like'}
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={label}
      title={liked ? 'Liked' : 'Like'}
      onClick={() => toggleLike(movieId)}
      className={cn(roundIconButton, className)}
    >
      <ThumbsUp className={cn(liked && 'fill-white')} aria-hidden="true" />
    </button>
  )
}
