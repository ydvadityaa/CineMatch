'use client'

import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

interface TrendingMovie {
  id: number
  title: string
  original_title: string | null
  overview: string | null
  release_date: string | null
  vote_average: number | null
  vote_count: number | null
  popularity: number | null
  original_language: string | null
  poster_url: string | null
  backdrop_url: string | null
}

interface TrendingResponse {
  count: number
  movies: TrendingMovie[]
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://127.0.0.1:8000'

export function ExploreTrending() {
  const [movies, setMovies] =
    useState<TrendingMovie[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(false)

  const [retrying, setRetrying] =
    useState(false)

  const railRef =
    useRef<HTMLDivElement>(null)

  const loadTrending = useCallback(
    async (
      signal?: AbortSignal,
      isRetry = false,
    ) => {
      try {
        if (isRetry) {
          setRetrying(true)
        } else {
          setLoading(true)
        }

        setError(false)

        const response = await fetch(
          `${API_URL}/api/trending?limit=20`,
          {
            signal,
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          console.error(
            `Trending API failed: ${response.status}`,
          )

          setError(true)
          return
        }

        const data: TrendingResponse =
          await response.json()

        const nextMovies =
          Array.isArray(data.movies)
            ? data.movies
            : []

        setMovies(nextMovies)

        if (nextMovies.length === 0) {
          console.warn(
            'Trending API returned no movies.',
          )
        }
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'Explore trending error:',
          err,
        )

        setError(true)
      } finally {
        setLoading(false)
        setRetrying(false)
      }
    },
    [],
  )

  useEffect(() => {
    const controller =
      new AbortController()

    void loadTrending(
      controller.signal,
    )

    return () => {
      controller.abort()
    }
  }, [loadTrending])

  function handleRetry() {
    void loadTrending(
      undefined,
      true,
    )
  }

  function scrollRail(
    direction: 'left' | 'right',
  ) {
    railRef.current?.scrollBy({
      left:
        direction === 'right'
          ? 950
          : -950,

      behavior: 'smooth',
    })
  }

  // -------------------------------------------------------
  // LOADING
  // -------------------------------------------------------

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="aspect-[2/3] w-[150px] shrink-0 animate-pulse rounded-xl bg-white/10 sm:w-[170px] lg:w-[190px]"
          />
        ))}
      </div>
    )
  }

  // -------------------------------------------------------
  // ERROR
  // -------------------------------------------------------

  if (error && movies.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <p className="text-sm font-medium text-white">
          Trending movies are temporarily unavailable.
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          CineMatch couldn&apos;t reach TMDB right now.
          Please try again.
        </p>

        <button
          type="button"
          onClick={handleRetry}
          disabled={retrying}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw
            className={`size-4 ${
              retrying
                ? 'animate-spin'
                : ''
            }`}
          />

          {retrying
            ? 'Trying Again...'
            : 'Try Again'}
        </button>
      </div>
    )
  }

  // -------------------------------------------------------
  // EMPTY
  // -------------------------------------------------------

  if (movies.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-400">
          No trending movies are available right now.
        </p>
      </div>
    )
  }

  // -------------------------------------------------------
  // MOVIES
  // -------------------------------------------------------

  return (
    <div className="relative">
      {/* LEFT ARROW */}

      <button
        type="button"
        onClick={() =>
          scrollRail('left')
        }
        aria-label="Scroll trending movies left"
        className="absolute left-2 top-[42%] z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white backdrop-blur transition hover:bg-white hover:text-black lg:flex"
      >
        <ChevronLeft className="size-5" />
      </button>

      {/* MOVIE RAIL */}

      <div
        ref={railRef}
        className="movie-rail flex gap-4 scroll-smooth pb-3"
      >
        {movies.map((movie) => {
          const year =
            movie.release_date
              ? movie.release_date.slice(
                  0,
                  4,
                )
              : null

          return (
            <Link
              key={movie.id}
              href={`/tmdb/movies/${movie.id}?from=explore-trending`}
              className="group w-[150px] shrink-0 sm:w-[170px] lg:w-[190px]"
            >
              {/* POSTER */}

              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={`${movie.title} poster`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-4 text-center text-xs text-zinc-500">
                    Poster unavailable
                  </div>
                )}

                {/* RATING */}

                {movie.vote_average !==
                  null && (
                  <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                    <Star className="size-3 fill-yellow-400 text-yellow-400" />

                    {movie.vote_average.toFixed(
                      1,
                    )}
                  </div>
                )}
              </div>

              {/* TITLE */}

              <h3 className="mt-3 truncate text-sm font-semibold text-white">
                {movie.title}
              </h3>

              {/* YEAR + LANGUAGE */}

              <div className="mt-1 flex items-center justify-between gap-2">
                {year && (
                  <span className="text-xs text-zinc-500">
                    {year}
                  </span>
                )}

                {movie.original_language && (
                  <span className="text-[11px] uppercase text-zinc-600">
                    {
                      movie.original_language
                    }
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* RIGHT ARROW */}

      <button
        type="button"
        onClick={() =>
          scrollRail('right')
        }
        aria-label="Scroll trending movies right"
        className="absolute right-2 top-[42%] z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white backdrop-blur transition hover:bg-white hover:text-black lg:flex"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}