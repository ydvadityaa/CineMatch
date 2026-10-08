import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MovieGridSkeleton } from '@/components/common/LoadingSkeleton'
import { PageShell } from '@/components/layout/PageShell'
import { SearchResultsView } from '@/components/movie/SearchResultsView'
import { BackButton } from '@/components/common/BackButton'

export const metadata: Metadata = { title: 'Search' }

export default function SearchPage() {
  return (
    
    <PageShell>
      <Suspense fallback={<MovieGridSkeleton count={12} />}>
        <SearchResultsView />
      </Suspense>
      <BackButton label="Back to Dashboard" />
    </PageShell>
  )
}
