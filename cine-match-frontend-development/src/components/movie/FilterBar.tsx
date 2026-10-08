'use client'

import { Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { SelectField } from '@/components/common/SelectField'
import { useDebouncedValue } from '@/hooks/use-ui'
import {
  activeFilterCount,
  DECADE_OPTIONS,
  LANGUAGE_OPTIONS,
  RATING_OPTIONS,
  SORT_OPTIONS,
  type CatalogueFilters,
} from '@/lib/filters'
import { GENRES } from '@/lib/genres'
import { cta } from '@/lib/ui'
import type { MovieSort } from '@/types/movie'

interface FilterBarProps {
  filters: CatalogueFilters
  onChange: (patch: Partial<CatalogueFilters>) => void
  onReset: () => void
  /** Hides the genre select and the text search on pages scoped to one genre. */
  fixedGenre?: string
}

const GENRE_OPTIONS = [{ value: '', label: 'All genres' }, ...GENRES.map((g) => ({ value: g.name, label: g.name }))]

export function FilterBar({ filters, onChange, onReset, fixedGenre }: FilterBarProps) {
  const searchId = useId()
  const [text, setText] = useState(filters.q)
  const debounced = useDebouncedValue(text, 350)
  const lastPushed = useRef(filters.q)

  // Reflect external changes (reset, back/forward) without clobbering in-flight typing.
  useEffect(() => {
    if (filters.q !== lastPushed.current) {
      lastPushed.current = filters.q
      setText(filters.q)
    }
  }, [filters.q])

  useEffect(() => {
    if (debounced !== lastPushed.current) {
      lastPushed.current = debounced
      onChange({ q: debounced })
    }
  }, [debounced, onChange])

  const activeCount = activeFilterCount(filters, fixedGenre)

  return (
    <form
      role="search"
      aria-label="Filter movies"
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4 rounded-xl border border-white/8 bg-surface p-4"
    >
      {!fixedGenre && (
        <div>
          <label htmlFor={searchId} className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Search the catalogue
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id={searchId}
              type="search"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Search by title"
              autoComplete="off"
              className="h-11 w-full rounded-md border border-white/12 bg-surface-2 pr-10 pl-10 text-sm text-white outline-none placeholder:text-muted-foreground hover:border-white/25 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:hidden"
            />
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {!fixedGenre && (
          <SelectField
            label="Genre"
            value={filters.genre}
            options={GENRE_OPTIONS}
            onChange={(genre) => onChange({ genre })}
          />
        )}
        <SelectField
          label="Language"
          value={filters.language}
          options={LANGUAGE_OPTIONS}
          onChange={(language) => onChange({ language })}
        />
        <SelectField
          label="Release year"
          value={filters.decade}
          options={DECADE_OPTIONS}
          onChange={(decade) => onChange({ decade })}
        />
        <SelectField
          label="Minimum rating"
          value={filters.rating}
          options={RATING_OPTIONS}
          onChange={(rating) => onChange({ rating })}
        />
        <SelectField
          label="Sort by"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(sort) => onChange({ sort: sort as MovieSort })}
        />
      </div>

      {activeCount > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-3">
          <p className="text-xs text-muted-foreground">
            {activeCount} {activeCount === 1 ? 'filter' : 'filters'} applied
          </p>
          <button type="button" onClick={onReset} className={cta('ghost', 'sm')}>
            <X aria-hidden="true" />
            Clear all
          </button>
        </div>
      )}
    </form>
  )
}
