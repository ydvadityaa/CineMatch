import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MovieGridSkeleton } from '@/components/common/LoadingSkeleton'
import { PageShell } from '@/components/layout/PageShell'
import { CatalogueBrowser } from '@/components/movie/CatalogueBrowser'

export const metadata: Metadata = { title: 'Movies' }

export default function MoviesPage() {
  return (
    <PageShell title="Movies" description="Browse the full catalogue and narrow it down by genre, language, year and rating.">
      <Suspense fallback={<MovieGridSkeleton count={12} />}>
        <CatalogueBrowser />
      </Suspense>
    </PageShell>
  )
}
