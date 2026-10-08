import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { MovieDetailSkeleton } from '@/components/common/LoadingSkeleton'
import { MovieDetailView } from '@/components/movie/MovieDetailView'

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movieId = Number(id)
  if (!Number.isInteger(movieId) || movieId <= 0) notFound()

  return (
    <Suspense fallback={<MovieDetailSkeleton />}>
      <MovieDetailView id={movieId} />
    </Suspense>
  )
}
