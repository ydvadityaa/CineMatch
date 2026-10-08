import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

type PageItem = number | 'gap-start' | 'gap-end'

function pageItems(page: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items: PageItem[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) items.push('gap-start')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total - 1) items.push('gap-end')
  items.push(total)
  return items
}

const buttonBase =
  'grid h-10 min-w-10 place-items-center rounded-md border px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40'

export function Pagination({ page, totalPages, onPageChange, disabled }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        aria-label="Previous page"
        className={cn(buttonBase, 'border-white/12 bg-surface-2 text-white hover:bg-white/10')}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      <p className="px-3 text-sm text-muted-foreground sm:hidden">
        Page <span className="font-semibold text-white">{page}</span> of {totalPages}
      </p>

      <ul className="hidden items-center gap-2 sm:flex">
        {pageItems(page, totalPages).map((item) =>
          typeof item === 'string' ? (
            <li key={item} aria-hidden="true" className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onPageChange(item)}
                disabled={disabled}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={cn(
                  buttonBase,
                  item === page
                    ? 'border-primary bg-primary text-white'
                    : 'border-white/12 bg-surface-2 text-white hover:bg-white/10',
                )}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
        aria-label="Next page"
        className={cn(buttonBase, 'border-white/12 bg-surface-2 text-white hover:bg-white/10')}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
