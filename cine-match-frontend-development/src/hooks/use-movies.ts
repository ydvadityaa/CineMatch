'use client'

import useSWR from 'swr'
import {
  getFeaturedMovie,
  getGenres,
  getMovieById,
  getMovies,
  getRecommendedForYou,
  getSimilarMovies,
  searchMovies,
} from '@/services/api'
import type { MovieListParams } from '@/types/movie'

export function useMovies(params: MovieListParams, enabled = true) {
  return useSWR(enabled ? ['movies', params] : null, ([, p]) => getMovies(p), {
    keepPreviousData: true,
  })
}

export function useMovieSearch(
  query: string,
  params: MovieListParams = {},
  enabled = true,
) {
  const active = enabled && query.trim().length > 0
  return useSWR(
    active ? ['search', query.trim(), params] : null,
    ([, q, p]) => searchMovies(q, p),
    { keepPreviousData: true },
  )
}

export function useSearchSuggestions(query: string) {
  const trimmed = query.trim()
  return useSWR(
    trimmed.length >= 2 ? ['suggest', trimmed] : null,
    ([, q]) => searchMovies(q, { limit: 6 }),
    { keepPreviousData: true },
  )
}

export function useMovie(id: number) {
  return useSWR(['movie', id], ([, movieId]) => getMovieById(movieId))
}

export function useSimilarMovies(id: number, limit = 10) {
  return useSWR(['similar', id, limit], ([, movieId, l]) => getSimilarMovies(movieId, l))
}

export function useGenres() {
  return useSWR('genres', getGenres, { revalidateIfStale: false })
}

export function useFeaturedMovie() {
  return useSWR('featured-movie', getFeaturedMovie)
}

export function useRecommendedForYou(seedId: number | null, enabled = true) {
  return useSWR(
    enabled ? ['recommended', seedId] : null,
    ([, seed]) => getRecommendedForYou(seed),
  )
}
