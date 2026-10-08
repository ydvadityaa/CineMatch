import type { Metadata } from 'next'

import { BackButton } from '@/components/common/BackButton'
import { GenreGrid } from '@/components/genre/GenreGrid'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Genres',
}

export default function GenresPage() {
  return (
    <PageShell>
      <div className="mb-8">
        <BackButton />
      </div>

      <header className="mb-8 sm:mb-10">
        <h1 className="font-display text-4xl font-bold tracking-wide text-white uppercase sm:text-6xl">
          Genres
        </h1>

        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Pick a mood and dive into the movies that fit it.
        </p>
      </header>

      <GenreGrid />
    </PageShell>
  )
}