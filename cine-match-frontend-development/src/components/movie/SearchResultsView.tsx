'use client'

import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { EmptyState } from '@/components/common/EmptyState'
import { useMovieSearch } from '@/hooks/use-movies'
import { PAGE_SIZE } from '@/lib/config'
import { PaginatedResults } from './PaginatedResults'

export function SearchResultsView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = (searchParams.get('q') ?? '').trim()
  const pageParam = Number(searchParams.get('page') ?? 1)
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  const { data, error, isLoading, isValidating, mutate } = useMovieSearch(query, {
    page,
    limit: PAGE_SIZE,
  })

  const setPage = (next: number) => {
    const params = new URLSearchParams({ q: query })
    if (next > 1) params.set('page', String(next))
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (!query) {
    return (
      <EmptyState
        icon={Search}
        title="Search the CineMatch catalogue"
        message="Use the search icon in the navigation bar to find a movie by title."
      />
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-wide text-white uppercase sm:text-5xl">
          Search results for &ldquo;{query}&rdquo;
        </h1>
      </header>
      <PaginatedResults
        data={data}
        error={error}
        isLoading={isLoading}
        isValidating={isValidating}
        onRetry={() => void mutate()}
        onPageChange={setPage}
        emptyTitle={`No results for "${query}"`}
        emptyMessage="Check the spelling or try a shorter, more general title."
        noun="results"
      />
    </div>
  )
}
