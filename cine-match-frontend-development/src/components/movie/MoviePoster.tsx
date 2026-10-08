'use client'

import { Clapperboard } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { posterUrl, type PosterSize } from '@/utils/image'

interface MoviePosterProps {
  title: string
  path: string | null | undefined
  sizes: string
  size?: PosterSize
  priority?: boolean
  className?: string
}

/** Poster with a graceful fallback for missing or broken images. */
export function MoviePoster({
  title,
  path,
  sizes,
  size = 'w500',
  priority = false,
  className,
}: MoviePosterProps) {
  const src = posterUrl(path, size)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = src !== null && failedSrc !== src

  return (
    <div
      className={cn(
        'relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-surface-2',
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={`${title} poster`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div
          role="img"
          aria-label={`${title} (poster unavailable)`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-surface-2 to-surface p-4 text-center"
        >
          <Clapperboard className="size-8 text-muted-foreground/70" aria-hidden="true" />
          <span className="line-clamp-3 text-xs font-medium text-muted-foreground">{title}</span>
        </div>
      )}
    </div>
  )
}
