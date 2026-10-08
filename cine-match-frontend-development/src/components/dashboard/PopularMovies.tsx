'use client'

import { Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Movie {
  id: number
  title: string
  release_date: string | null
  vote_average: number | null
  vote_count: number | null
  popularity: number | null
  poster_path: string | null
}

interface MoviesResponse {
  page: number
  limit: number
  total: number
  total_pages: number
  count: number
  items: Movie[]
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export function PopularMovies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadMovies() {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch(
          `${API_URL}/api/movies?page=1&limit=20`,
          {
            signal: controller.signal,
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          const text = await response.text()

          throw new Error(
            `Movies API failed: ${response.status} ${text}`,
          )
        }

        const data: MoviesResponse = await response.json()

        const sortedMovies = [...(data.items ?? [])].sort(
          (a, b) =>
            (b.popularity ?? 0) - (a.popularity ?? 0),
        )

        setMovies(sortedMovies.slice(0, 20))
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        console.error('Popular movies error:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()

    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <section className="bg-black py-12">
        <div className="mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
          <div className="mb-6 h-8 w-48 animate-pulse rounded bg-white/10" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-10">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] animate-pulse rounded-xl bg-white/10"
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
              Popular Movies
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Popular titles from the CineMatch movie catalogue.
            </p>
          </div>

          <Link
            href="/browse"
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

            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null

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