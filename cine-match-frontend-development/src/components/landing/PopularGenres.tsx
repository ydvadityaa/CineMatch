'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { GenresResponse } from '@/types/movie'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const GENRE_ORDER = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Science Fiction',
  'Thriller',
]

export function PopularGenres() {
  const [genres, setGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadGenres() {
      try {
        const response = await fetch(`${API_URL}/api/genres`, {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to load genres')
        }

        const data: GenresResponse = await response.json()

        const selectedGenres = GENRE_ORDER.filter((genre) =>
          data.genres.includes(genre),
        )

        setGenres(selectedGenres)
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return
        }

        console.error('Popular genres error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGenres()

    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <section className="bg-black px-4 py-16 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-8 w-48 animate-pulse rounded bg-white/10" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-white/10"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (genres.length === 0) {
    return null
  }

  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-8 lg:px-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-red-900/10 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-900/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            Explore
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Popular Genres
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Browse movies by genre and quickly find something that matches your mood.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {genres.map((genre, index) => (
            <Link
              key={genre}
              href={`/genres/${encodeURIComponent(
                genre.toLowerCase().replace(/\s+/g, '-'),
              )}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl"
            >
              <div className="flex min-h-24 flex-col justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-primary">
                    {genre}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Explore movies
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/5 blur-2xl transition duration-300 group-hover:bg-primary/10" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}