'use client'

import type { ReactNode } from 'react'
import { useScrolled } from '@/hooks/use-ui'
import { PAGE_X } from '@/lib/ui'
import { cn } from '@/lib/utils'

interface NavShellProps {
  children: ReactNode
  /** Keep the bar solid even at the top of the page (for pages without a hero). */
  alwaysSolid?: boolean
}

/** Fixed header that is transparent over hero imagery and turns solid on scroll. */
export function NavShell({ children, alwaysSolid = false }: NavShellProps) {
  const scrolled = useScrolled(24)
  const solid = scrolled || alwaysSolid

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300',
        solid
          ? 'border-b border-white/8 bg-background/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-gradient-to-b from-black/80 via-black/30 to-transparent',
      )}
    >
      <div className={cn('mx-auto flex h-16 max-w-[1920px] items-center gap-6', PAGE_X)}>{children}</div>
    </header>
  )
}
