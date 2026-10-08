'use client'

import { Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface RecommendedMovie {
  id: number
  title: string
  vote_average: number | null
  vote_count: number | null
  release_date: string | null
  poster_path: string | null
  poster_url?: string | null
  similarity_score?: number
}

interface SimilarMoviesResponse {
  movie_id: number
  count: number
  recommendations: RecommendedMovie[]
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

// Temporary base movie.
// Later we will replace this with the user's recently viewed movie.
const BASE_MOVIE_ID = 19995

export function RecommendedForYou() {
  const [movies, setMovies] = useState<RecommendedMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecommendations() {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch(
          `${API_URL}/api/movies/${BASE_MOVIE_ID}/similar?limit=20`,
          {
            signal: controller.signal,
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          const errorText = await response.text()

          throw new Error(
            `Recommendation API failed: ${response.status} ${errorText}`,
          )
        }

        const data: SimilarMoviesResponse = await response.json()

        setMovies(data.recommendations ?? [])
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        console.error('Recommendation error:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()

    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <section className="bg-black py-12">
        <div className="mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
          <div className="mb-6 h-8 w-56 animate-pulse rounded bg-white/10" />

          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] w-[150px] shrink-0 animate-pulse rounded-xl bg-white/10 sm:w-[175px] lg:w-[190px]"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || movies.length === 0) {
    return null
  }

  return (
    <section className="bg-black py-12">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Recommended for You
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Movies selected using CineMatch similarity recommendations.
            </p>
          </div>

          <Link
            href="/recommendations"
            className="hidden text-sm font-medium text-zinc-400 transition hover:text-white sm:block"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-10">
          {movies.map((movie) => {
            const year = movie.release_date
              ? movie.release_date.slice(0, 4)
              : null

            const posterUrl =
              movie.poster_url ||
              (movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null)

            return (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="group min-w-0"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={`${movie.title} poster`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-xs text-zinc-500">
                      Poster unavailable
                    </div>
                  )}

                  {movie.vote_average !== null && (
                    <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-white">
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {movie.title}
                  </h3>

                  {year && (
                    <p className="mt-1 text-xs text-zinc-500">
                      {year}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}