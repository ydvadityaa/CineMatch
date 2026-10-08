'use client'

import { cn } from '@/lib/utils'

interface AvatarProps {
  name?: string | null
  className?: string
}

export function Avatar({
  name,
  className,
}: AvatarProps) {
  const safeName =
    typeof name === 'string' && name.trim()
      ? name.trim()
      : 'User'

  const hue =
    [...safeName].reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0,
    ) % 360

  const initials = safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
        className,
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 40) % 360} 70% 35%))`,
      }}
    >
      {initials}
    </span>
  )
}