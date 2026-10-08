'use client'

import {
  RefreshCcw,
  Search,
  Sparkles,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { BackButton } from '@/components/common/BackButton'
import { PageShell } from '@/components/layout/PageShell'
import {
  useMovieSearch,
  useMovies,
  useSimilarMovies,
} from '@/hooks/use-movies'

import type {
  MovieSummary,
  RecommendedMovie,
} from '@/types/movie'

export default function RecommendationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [selectedMovie, setSelectedMovie] =
    useState<MovieSummary | null>(null)

  // -------------------------------------------------------
  // SEARCH MOVIES
  // -------------------------------------------------------

  const {
    data: searchData,
    isLoading: searchLoading,
  } = useMovieSearch(
    activeQuery,
    {
      page: 1,
      limit: 6,
    },
    activeQuery.length > 0,
  )

  // -------------------------------------------------------
  // SIMILAR MOVIES
  // -------------------------------------------------------

  const {
    data: similarData,
    error: similarError,
    isLoading: similarLoading,
    mutate: refreshSimilar,
  } = useSimilarMovies(
    selectedMovie?.id ?? 0,
    20,
  )

  // -------------------------------------------------------
  // TOP PICKS
  // -------------------------------------------------------

  const {
    data: topPicksData,
    isLoading: topPicksLoading,
  } = useMovies({
    page: 1,
    limit: 10,
    sort: 'rating',
    min_rating: 7,
  })

  // -------------------------------------------------------
  // SEARCH HANDLER
  // -------------------------------------------------------

  function handleSearch() {
    const query = searchQuery.trim()

    if (!query) return

    setActiveQuery(query)
  }

  function handleSelectMovie(movie: MovieSummary) {
    setSelectedMovie(movie)
    setActiveQuery('')
    setSearchQuery(movie.title)
  }

  function handleReset() {
    setSelectedMovie(null)
    setSearchQuery('')
    setActiveQuery('')
  }

  return (
    <PageShell>
      {/* ------------------------------------------------ */}
      {/* BACK */}
      {/* ------------------------------------------------ */}

      <div className="mb-7">
        <BackButton fallback="/dashboard" />
      </div>

      {/* ------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------ */}

      <header className="mb-10">
        <div className="flex items-center gap-2 text-red-500">
          <Sparkles className="size-5" />

          <p className="text-sm font-semibold uppercase tracking-[0.2em]">
            Smart Recommendations
          </p>
        </div>

        <h1 className="mt-3 font-display text-4xl font-bold tracking-wide text-white uppercase sm:text-6xl">
          Recommendations
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          Pick a movie you enjoy and CineMatch will discover
          similar titles using content similarity, ratings,
          popularity, and audience signals.
        </p>
      </header>

      {/* ------------------------------------------------ */}
      {/* SEARCH BOX */}
      {/* ------------------------------------------------ */}

      <section className="mb-12">
        <div className="max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-white">
            Search a movie you like
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Choose a movie and we&apos;ll find similar titles.
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 p-2">
            <Search className="ml-3 size-5 shrink-0 text-zinc-500" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch()
                }
              }}
              placeholder="Search Inception, Avatar, Alien..."
              className="w-full bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Search
            </button>
          </div>

          {/* Search Results */}

          {activeQuery && (
            <div className="mt-5">
              {searchLoading ? (
                <p className="text-sm text-zinc-500">
                  Searching...
                </p>
              ) : searchData &&
                searchData.items.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {searchData.items.map((movie) => (
                    <button
                      key={movie.id}
                      type="button"
                      onClick={() =>
                        handleSelectMovie(movie)
                      }
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-3 text-left transition hover:border-white/25 hover:bg-white/5"
                    >
                      <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-900">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                            alt={`${movie.title} poster`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-zinc-600">
                            No poster
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {movie.title}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                          {movie.release_date && (
                            <span>
                              {movie.release_date.slice(
                                0,
                                4,
                              )}
                            </span>
                          )}

                          {movie.vote_average !== null && (
                            <>
                              <span>•</span>

                              <span className="flex items-center gap-1">
                                <Star className="size-3 fill-yellow-400 text-yellow-400" />

                                {movie.vote_average.toFixed(
                                  1,
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  No movies found for &quot;{activeQuery}&quot;.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* SELECTED MOVIE */}
      {/* ------------------------------------------------ */}

      {selectedMovie && (
        <section className="mb-12">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 to-zinc-900">
            <div className="grid gap-6 p-6 sm:grid-cols-[130px_1fr] sm:p-8">
              <div className="aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
                {selectedMovie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${selectedMovie.poster_path}`}
                    alt={`${selectedMovie.title} poster`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-4 text-center text-xs text-zinc-500">
                    Poster unavailable
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
                  Recommendation Seed
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {selectedMovie.title}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                  {selectedMovie.release_date && (
                    <span>
                      {selectedMovie.release_date.slice(
                        0,
                        4,
                      )}
                    </span>
                  )}

                  {selectedMovie.vote_average !== null && (
                    <span className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />

                      {selectedMovie.vote_average.toFixed(1)}
                    </span>
                  )}

                  {selectedMovie.original_language && (
                    <span className="uppercase">
                      {selectedMovie.original_language}
                    </span>
                  )}
                </div>

                {selectedMovie.genres.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedMovie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      void refreshSimilar()
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85"
                  >
                    <RefreshCcw className="size-4" />
                    Refresh Recommendations
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Choose Another Movie
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------ */}
      {/* SIMILAR MOVIES */}
      {/* ------------------------------------------------ */}

      {selectedMovie && (
        <section className="mb-16">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
              Because you liked
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {selectedMovie.title}
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Similar movies selected by the CineMatch
              recommendation engine.
            </p>
          </div>

          {similarLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-10">
              {Array.from({
                length: 20,
              }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[2/3] animate-pulse rounded-xl bg-white/10"
                />
              ))}
            </div>
          ) : similarError ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-sm text-red-400">
                Unable to load recommendations right now.
              </p>
            </div>
          ) : similarData &&
            similarData.recommendations.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-10">
              {similarData.recommendations.map(
                (movie) => (
                  <RecommendationCard
                    key={movie.id}
                    movie={movie}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-zinc-950 p-6">
              <p className="text-sm text-zinc-400">
                No similar movies were found for this title.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------ */}
      {/* TOP PICKS */}
      {/* ------------------------------------------------ */}

      <section>
        <div className="mb-7">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-red-500" />

            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Top Picks for You
            </h2>
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            Highly rated movies from the CineMatch catalogue.
          </p>
        </div>

        {topPicksLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 lg:grid-cols-10">
            {Array.from({
              length: 10,
            }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] animate-pulse rounded-xl bg-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 lg:grid-cols-10">
            {topPicksData?.items.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  )
}

// ---------------------------------------------------------
// RECOMMENDATION CARD
// ---------------------------------------------------------

function RecommendationCard({
  movie,
}: {
  movie: RecommendedMovie
}) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : null

  return (
    <Link
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
          <div className="flex h-full items-center justify-center p-3 text-center text-xs text-zinc-500">
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

      <h3 className="mt-3 truncate text-sm font-semibold text-white">
        {movie.title}
      </h3>

      <div className="mt-1 flex items-center justify-between gap-2">
        {year && (
          <span className="text-xs text-zinc-500">
            {year}
          </span>
        )}

        <span className="text-xs text-zinc-600">
          {Math.round(
            movie.similarity_score * 100,
          )}
          % match
        </span>
      </div>
    </Link>
  )
}

// ---------------------------------------------------------
// REGULAR MOVIE CARD
// ---------------------------------------------------------

function MovieCard({
  movie,
}: {
  movie: MovieSummary
}) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : null

  return (
    <Link
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
          <div className="flex h-full items-center justify-center p-3 text-center text-xs text-zinc-500">
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

      <h3 className="mt-3 truncate text-sm font-semibold text-white">
        {movie.title}
      </h3>

      {year && (
        <p className="mt-1 text-xs text-zinc-500">
          {year}
        </p>
      )}
    </Link>
  )
}