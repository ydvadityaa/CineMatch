'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

import { BackButton } from '@/components/common/BackButton'
import { PageShell } from '@/components/layout/PageShell'
import { PaginatedResults } from '@/components/movie/PaginatedResults'
import { useGenres, useMovies } from '@/hooks/use-movies'
import { PAGE_SIZE } from '@/lib/config'
import type { MovieSort } from '@/types/movie'

export default function BrowsePage() {
  const [page, setPage] = useState(1)

  const [genre, setGenre] = useState('')
  const [sort, setSort] = useState<MovieSort>('popularity')
  const [minRating, setMinRating] = useState('')
  const [yearMin, setYearMin] = useState('')
  const [yearMax, setYearMax] = useState('')
  const [language, setLanguage] = useState('')

  const { data: genres = [] } = useGenres()

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useMovies({
    page,
    limit: PAGE_SIZE,

    genre: genre || undefined,

    sort,

    min_rating: minRating
      ? Number(minRating)
      : undefined,

    year_min: yearMin
      ? Number(yearMin)
      : undefined,

    year_max: yearMax
      ? Number(yearMax)
      : undefined,

    language: language || undefined,
  })

  function resetFilters() {
    setGenre('')
    setSort('popularity')
    setMinRating('')
    setYearMin('')
    setYearMax('')
    setLanguage('')
    setPage(1)
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <PageShell>
      {/* Back */}

      <div className="mb-7">
        <BackButton fallback="/dashboard" />
      </div>

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          CineMatch Catalogue
        </p>

        <h1 className="mt-2 font-display text-4xl font-bold tracking-wide text-white uppercase sm:text-6xl">
          Browse Movies
        </h1>

        <p className="mt-3 max-w-2xl text-base text-zinc-400">
          Explore movies from the CineMatch catalogue and narrow
          the results using genre, rating, year and language.
        </p>
      </div>

      {/* Filters */}

      <div className="mb-10 rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-zinc-400" />

            <h2 className="font-semibold text-white">
              Filters
            </h2>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            <X className="size-4" />
            Reset
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Genre */}

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
              Genre
            </label>

            <select
              value={genre}
              onChange={(event) => {
                setSort(event.target.value as MovieSort)
                setPage(1)
              }}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white outline-none transition focus:border-white/25"
            >
              <option value="">
                All Genres
              </option>

              {genres.map((item) => (
                <option
                  key={item.slug}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
              Sort
            </label>

            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as MovieSort)
                setPage(1)
              }}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white outline-none transition focus:border-white/25"
            >
              <option value="popularity">
                Most Popular
              </option>

              <option value="rating">
                Top Rated
              </option>

              <option value="votes">
                Most Voted
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="title">
                A-Z
              </option>
            </select>
          </div>

          {/* Rating */}

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
              Min Rating
            </label>

            <select
              value={minRating}
              onChange={(event) => {
                setMinRating(event.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white outline-none transition focus:border-white/25"
            >
              <option value="">
                Any Rating
              </option>

              <option value="5">
                5+
              </option>

              <option value="6">
                6+
              </option>

              <option value="7">
                7+
              </option>

              <option value="8">
                8+
              </option>

              <option value="9">
                9+
              </option>
            </select>
          </div>

          {/* From Year */}

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
              From Year
            </label>

            <input
              type="number"
              min="1800"
              max="2100"
              value={yearMin}
              onChange={(event) => {
                setYearMin(event.target.value)
                setPage(1)
              }}
              placeholder="e.g. 2000"
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/25"
            />
          </div>

          {/* To Year */}

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
              To Year
            </label>

            <input
              type="number"
              min="1800"
              max="2100"
              value={yearMax}
              onChange={(event) => {
                setYearMax(event.target.value)
                setPage(1)
              }}
              placeholder="e.g. 2026"
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/25"
            />
          </div>

          {/* Language */}

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
              Language
            </label>

            <select
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white outline-none transition focus:border-white/25"
            >
              <option value="">
                All Languages
              </option>

              <option value="en">
                English
              </option>

              <option value="hi">
                Hindi
              </option>

              <option value="es">
                Spanish
              </option>

              <option value="fr">
                French
              </option>

              <option value="ja">
                Japanese
              </option>

              <option value="ko">
                Korean
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}

      <PaginatedResults
        data={data}
        error={error}
        isLoading={isLoading}
        isValidating={isValidating}
        onRetry={() => void mutate()}
        onPageChange={handlePageChange}
        emptyTitle="No movies found"
        emptyMessage="Try changing or resetting your filters."
        noun="movies"
      />
    </PageShell>
  )
}