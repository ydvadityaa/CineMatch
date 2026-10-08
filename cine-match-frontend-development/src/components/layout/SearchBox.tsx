'use client'

import { Loader2, Search, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useSearchSuggestions } from '@/hooks/use-movies'
import { useDebouncedValue, useDismissable } from '@/hooks/use-ui'
import { cn } from '@/lib/utils'
import { formatYear } from '@/utils/format'
import { posterUrl } from '@/utils/image'

/** Navbar search: icon that expands into an input with live poster suggestions. */
export function SearchBox() {
  const router = useRouter()
  const pathname = usePathname()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)

  const debounced = useDebouncedValue(query, 220)
  const { data, isLoading } = useSearchSuggestions(debounced)
  const suggestions = open ? (data?.items ?? []) : []
  const trimmed = query.trim()
  const showPanel = open && trimmed.length >= 2
  const optionCount = suggestions.length + (trimmed ? 1 : 0)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(-1)
  }, [])

  const containerRef = useDismissable<HTMLDivElement>(open, close)

  useEffect(() => {
    close()
  }, [pathname, close])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const go = (index: number) => {
    const movie = suggestions[index]
    if (movie) router.push(`/movies/${movie.id}`)
    else if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    close()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (optionCount ? (i + 1) % optionCount : -1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (optionCount ? (i <= 0 ? optionCount - 1 : i - 1) : -1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (!trimmed) return
      go(active >= 0 ? active : suggestions.length)
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative', open && 'max-sm:fixed max-sm:inset-x-3 max-sm:top-3 max-sm:z-10')}
    >
      <div
        className={cn(
          'flex h-10 items-center overflow-hidden rounded-full border transition-[width,background-color,border-color] duration-300 ease-out',
          open
            ? 'border-white/40 bg-black/80 backdrop-blur-md max-sm:w-full sm:w-72'
            : 'w-10 border-transparent bg-transparent',
        )}
      >
        <button
          type="button"
          onClick={() => (open ? inputRef.current?.focus() : setOpen(true))}
          aria-label={open ? 'Search movies' : 'Open search'}
          aria-expanded={open}
          className="grid size-10 shrink-0 place-items-center rounded-full text-white outline-none hover:text-white/80 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="size-5" aria-hidden="true" />
        </button>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(-1)
          }}
          onKeyDown={onKeyDown}
          tabIndex={open ? 0 : -1}
          role="combobox"
          aria-label="Search movies by title"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          placeholder="Titles"
          autoComplete="off"
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent pr-2 text-sm text-white outline-none placeholder:text-white/50',
            !open && 'pointer-events-none',
          )}
        />
        {open && (
          <button
            type="button"
            onClick={() => (query ? (setQuery(''), inputRef.current?.focus()) : close())}
            aria-label={query ? 'Clear search' : 'Close search'}
            className="mr-1 grid size-8 shrink-0 place-items-center rounded-full text-white/70 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="absolute top-full right-0 mt-2 w-full min-w-72 animate-pop-in overflow-hidden rounded-xl border border-white/12 bg-card shadow-2xl shadow-black/60 sm:w-[26rem]">
          <ul id={listId} role="listbox" aria-label="Search suggestions" className="max-h-[70vh] overflow-y-auto py-1">
            {isLoading && suggestions.length === 0 && (
              <li role="presentation" className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Searching…
              </li>
            )}
            {suggestions.map((movie, index) => {
              const src = posterUrl(movie.poster_path, 'w185')
              return (
                <li
                  key={movie.id}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={active === index}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(index)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors',
                    active === index ? 'bg-white/10' : 'hover:bg-white/5',
                  )}
                >
                  <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-surface-2">
                    {src && <Image src={src} alt="" fill sizes="40px" className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{movie.title}</p>
                    <p className="text-xs text-muted-foreground">{formatYear(movie.release_date) || 'Year unknown'}</p>
                  </div>
                </li>
              )
            })}
            {!isLoading && suggestions.length === 0 && (
              <li role="presentation" className="px-4 py-4 text-sm text-muted-foreground">
                No titles match &ldquo;{trimmed}&rdquo;.
              </li>
            )}
            <li
              id={`${listId}-${suggestions.length}`}
              role="option"
              aria-selected={active === suggestions.length}
              onMouseEnter={() => setActive(suggestions.length)}
              onClick={() => go(suggestions.length)}
              className={cn(
                'flex cursor-pointer items-center gap-2 border-t border-white/8 px-4 py-3 text-sm text-white transition-colors',
                active === suggestions.length ? 'bg-white/10' : 'hover:bg-white/5',
              )}
            >
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              See all results for &ldquo;{trimmed}&rdquo;
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
