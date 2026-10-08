'use client'

import { FilterX } from 'lucide-react'
import { useCatalogueFilters } from '@/hooks/use-catalogue-filters'
import { useMovieSearch, useMovies } from '@/hooks/use-movies'
import { filtersToParams } from '@/lib/filters'
import { PAGE_SIZE } from '@/lib/config'
import { cta } from '@/lib/ui'
import { FilterBar } from './FilterBar'
import { PaginatedResults } from './PaginatedResults'

/** Filterable, paginated catalogue. Used by the Movies page and each genre page. */
export function CatalogueBrowser({ fixedGenre }: { fixedGenre?: string }) {
  const { filters, update, reset } = useCatalogueFilters()
  const params = filtersToParams(filters, PAGE_SIZE, fixedGenre)
  const searching = filters.q.trim().length > 0

  const list = useMovies(params, !searching)
  const search = useMovieSearch(filters.q, params, searching)
  const result = searching ? search : list

  return (
    <div className="space-y-8">
      <FilterBar filters={filters} onChange={update} onReset={reset} fixedGenre={fixedGenre} />
      <PaginatedResults
        data={result.data}
        error={result.error}
        isLoading={result.isLoading}
        isValidating={result.isValidating}
        onRetry={() => void result.mutate()}
        onPageChange={(page) => update({ page })}
        emptyTitle={searching ? `No movies match "${filters.q}"` : 'No movies match these filters'}
        emptyMessage="Try removing a filter or widening the year range."
        emptyAction={
          <button type="button" onClick={reset} className={cta('outline', 'md')}>
            <FilterX aria-hidden="true" />
            Clear filters
          </button>
        }
      />
    </div>
  )
}
