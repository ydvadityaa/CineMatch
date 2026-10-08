import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { MovieGridSkeleton } from '@/components/common/LoadingSkeleton'
import { PageShell } from '@/components/layout/PageShell'
import { CatalogueBrowser } from '@/components/movie/CatalogueBrowser'
import { findGenreBySlug, GENRES } from '@/lib/genres'
import { BackButton } from '@/components/common/BackButton'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return GENRES.map((genre) => ({ slug: genre.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const genre = findGenreBySlug((await params).slug)
  return { title: genre ? `${genre.name} Movies` : 'Genre' }
}

export default async function GenrePage({ params }: Props) {
  const genre = findGenreBySlug((await params).slug)
  if (!genre) notFound()

  return (
    <PageShell
      title={genre.name}
      description={genre.description}
      eyebrow={
        <Link
          href="/genres"
          className="mb-3 inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          All genres
        </Link>
      }
    >
      <Suspense fallback={<MovieGridSkeleton count={12} />}>
        <CatalogueBrowser fixedGenre={genre.name} />
      </Suspense>
      <BackButton />
    </PageShell>
  )
}
