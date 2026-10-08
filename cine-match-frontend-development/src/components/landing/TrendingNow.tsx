'use client'

import { Star, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  CAROUSEL_ITEM,
  MovieCarousel,
} from '@/components/movie/MovieCarousel'

import type {
  TrendingMovie,
  TrendingMoviesResponse,
} from '@/types/movie'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

interface TrendingNowProps {
  mode?: 'modal' | 'page'
}

export function TrendingNow({
  mode = 'page',
}: TrendingNowProps) {
  const [movies, setMovies] = useState<TrendingMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] =
    useState<TrendingMovie | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTrending() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `${API_URL}/api/trending?limit=20`,
          {
            signal: controller.signal,
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          const errorText = await response.text()

          throw new Error(
            `Trending API failed: ${response.status} ${errorText}`,
          )
        }

        const data: TrendingMoviesResponse =
          await response.json()

        setMovies(data.movies ?? [])
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        const message =
          err instanceof Error
            ? err.message
            : 'Unknown error while loading trending movies'

        console.error('Trending movies error:', message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadTrending()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!selectedMovie) return

    document.body.style.overflow = 'hidden'

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedMovie(null)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [selectedMovie])

  if (loading) {
    return (
      <section className="bg-black py-12">
        <div className="px-4 sm:px-8 lg:px-14">
          <div className="mb-5 h-8 w-44 animate-pulse rounded bg-white/10" />

          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] w-[140px] shrink-0 animate-pulse rounded-xl bg-white/10 sm:w-[170px] lg:w-[196px]"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-black px-4 py-10 sm:px-8 lg:px-14">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <h2 className="text-lg font-semibold text-white">
            Trending Now
          </h2>

          <p className="mt-2 text-sm text-red-400">
            Unable to load trending movies.
          </p>
        </div>
      </section>
    )
  }

  if (movies.length === 0) return null

  return (
    <>
      <section className="bg-black py-12">
        <MovieCarousel
          title="Trending Now"
          subtitle="Popular movies people are watching right now"
        >
          {movies.map((movie, index) => {
            const year = movie.release_date
              ? movie.release_date.slice(0, 4)
              : null

            const cardContent = (
              <>
                <div className="relative pl-8 sm:pl-10">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-0 z-10 font-display text-[5.5rem] leading-none font-black text-black [-webkit-text-stroke:2px_#737373] sm:text-[7rem]"
                  >
                    {index + 1}
                  </span>

                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 shadow-xl transition duration-300 group-hover:scale-[1.04] group-hover:shadow-2xl">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={`${movie.title} poster`}
                        loading={index < 5 ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-4 text-center text-sm text-zinc-500">
                        Poster unavailable
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

                    {movie.vote_average !== null && (
                      <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pl-8 sm:pl-10">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {movie.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                    {year && <span>{year}</span>}

                    {movie.original_language && (
                      <>
                        <span>•</span>
                        <span className="uppercase">
                          {movie.original_language}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </>
            )

            return (
              <article
                key={movie.id}
                role="listitem"
                className={`${CAROUSEL_ITEM} group relative`}
              >
                {mode === 'modal' ? (
                  <button
                    type="button"
                    onClick={() => setSelectedMovie(movie)}
                    className="block w-full text-left outline-none"
                    aria-label={`View details for ${movie.title}`}
                  >
                    {cardContent}
                  </button>
                ) : (
                  <Link
                    href={`/tmdb/movies/${movie.id}`}
                    className="block outline-none"
                    aria-label={`View details for ${movie.title}`}
                  >
                    {cardContent}
                  </Link>
                )}
              </article>
            )
          })}
        </MovieCarousel>
      </section>

      {mode === 'modal' && selectedMovie && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-30 flex size-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-white hover:text-black"
              aria-label="Close movie details"
            >
              <X className="size-5" />
            </button>

            <div className="relative min-h-[540px]">
              {selectedMovie.backdrop_url && (
                <img
                  src={selectedMovie.backdrop_url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/25" />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

              <div className="relative z-10 flex min-h-[540px] items-end p-6 sm:p-10 lg:p-12">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold tracking-[0.22em] text-red-500 uppercase">
                    Trending Now
                  </p>

                  <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {selectedMovie.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                    {selectedMovie.vote_average !== null && (
                      <div className="flex items-center gap-1.5">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />

                        <span className="font-semibold text-white">
                          {selectedMovie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {selectedMovie.release_date && (
                      <span>
                        {selectedMovie.release_date.slice(0, 4)}
                      </span>
                    )}

                    {selectedMovie.original_language && (
                      <span className="uppercase">
                        {selectedMovie.original_language}
                      </span>
                    )}
                  </div>

                  {selectedMovie.overview && (
                    <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                      {selectedMovie.overview}
                    </p>
                  )}

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/signup"
                      className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/85"
                    >
                      Get Started
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedMovie(null)}
                      className="rounded-lg border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}