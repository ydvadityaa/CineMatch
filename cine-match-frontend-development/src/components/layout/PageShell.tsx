import type { ReactNode } from 'react'
import { PAGE_X } from '@/lib/ui'
import { cn } from '@/lib/utils'

interface PageShellProps {
  title?: string
  description?: string
  eyebrow?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/** Standard page frame for non-hero pages: offsets the fixed navbar and aligns to the site gutter. */
export function PageShell({ title, description, eyebrow, actions, children, className }: PageShellProps) {
  return (
    <main id="main" className={cn('mx-auto w-full max-w-[1920px] pt-28 pb-20', PAGE_X, className)}>
      {title && (
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div className="min-w-0">
            {eyebrow}
            <h1 className="font-display text-4xl leading-none font-bold tracking-wide text-white uppercase sm:text-6xl">
              {title}
            </h1>
            {description && <p className="mt-3 max-w-2xl text-base text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </main>
  )
}
