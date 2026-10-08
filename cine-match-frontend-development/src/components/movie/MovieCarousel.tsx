'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { PAGE_X } from '@/lib/ui'
import { cn } from '@/lib/utils'

interface MovieCarouselProps {
  title: string
  /** Optional "See all" destination. */
  href?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

/**
 * Horizontally scrollable rail with snap scrolling, touch swipe, and
 * previous/next controls on larger screens. Pass cards as children.
 */
export function MovieCarousel({ title, href, subtitle, children, className }: MovieCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const node = scroller.current
    if (!node) return
    setEdges({
      start: node.scrollLeft <= 4,
      end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    measure()
    const node = scroller.current
    if (!node) return
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [measure, children])

  const scrollByPage = (direction: 1 | -1) => {
    const node = scroller.current
    if (!node) return
    node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: 'smooth' })
  }

  const headingId = `rail-${title.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <section aria-labelledby={headingId} className={cn('group/rail relative', className)}>
      <div className={cn('mb-3 flex items-baseline justify-between gap-4', PAGE_X)}>
        <div className="min-w-0">
          <h2 id={headingId} className="font-display text-2xl font-semibold tracking-wide text-white uppercase sm:text-[1.7rem]">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="shrink-0 rounded-sm text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
          >
            See all
          </Link>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          disabled={edges.start}
          aria-label={`Scroll ${title} backward`}
          className="absolute inset-y-0 left-0 z-20 hidden w-14 items-center justify-center bg-gradient-to-r from-background to-transparent text-white opacity-0 transition-opacity outline-none group-hover/rail:opacity-100 focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-0 md:flex"
        >
          <ChevronLeft className="size-8" aria-hidden="true" />
        </button>

        <div
          ref={scroller}
          onScroll={measure}
          role="list"
          className={cn(
            'no-scrollbar flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain py-3 scroll-smooth sm:gap-4 [&>*]:snap-start [&>*]:scroll-ml-4 [&>[role=listitem]]:shrink-0',
            PAGE_X,
          )}
        >
          {children}
        </div>

        <button
          type="button"
          onClick={() => scrollByPage(1)}
          disabled={edges.end}
          aria-label={`Scroll ${title} forward`}
          className="absolute inset-y-0 right-0 z-20 hidden w-14 items-center justify-center bg-gradient-to-l from-background to-transparent text-white opacity-0 transition-opacity outline-none group-hover/rail:opacity-100 focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-0 md:flex"
        >
          <ChevronRight className="size-8" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

export const CAROUSEL_ITEM = 'w-[140px] sm:w-[170px] lg:w-[196px]'
