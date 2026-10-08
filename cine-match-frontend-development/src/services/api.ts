/**
 * Centralised API layer for the CineMatch FastAPI backend.
 *
 * Components never call `fetch` directly. They consume these functions
 * (usually through the SWR hooks in `src/hooks`).
 *
 * Query parameters beyond `page` and `limit` (genre, language, year_min,
 * year_max, min_rating, sort) are sent to `GET /api/movies` and `GET /api/search`.
 * The backend should accept them for server-side filtering across the catalogue.
 */
import { API_BASE_URL, USE_MOCK_API } from '@/lib/config'
import type {
  CardMovie,
  Genre,
  GenresResponse,
  MovieDetail,
  MovieListParams,
  MovieSummary,
  PaginatedMovies,
  RecommendedMovie,
  SimilarMoviesResponse,
} from '@/types/movie'
import { slugify } from '@/utils/format'

export type ApiErrorKind = 'network' | 'not_found' | 'http'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

type QueryValue = string | number | boolean | undefined | null

function buildQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}

async function request<T>(
  path: string,
  params: Record<string, QueryValue> = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}${buildQuery(params)}`, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new ApiError(
      'network',
      'Unable to reach the CineMatch service. Check that the backend is running.',
    )
  }

  if (response.status === 404) {
    throw new ApiError('not_found', 'We could not find what you were looking for.', 404)
  }
  if (!response.ok) {
    throw new ApiError('http', `The server responded with ${response.status}.`, response.status)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('http', 'The server returned an unreadable response.', response.status)
  }
}

type NamedItem = string | { name?: string }

function names(list: NamedItem[] | undefined | null): string[] {
  if (!Array.isArray(list)) return []
  return list
    .map((item) => (typeof item === 'string' ? item : (item?.name ?? '')))
    .filter(Boolean)
}

type RawMovie = Omit<MovieSummary, 'genres'> & { genres?: NamedItem[] }
type RawDetail = Omit<MovieDetail, 'genres' | 'production_companies' | 'keywords'> & {
  genres?: NamedItem[]
  production_companies?: NamedItem[]
  keywords?: NamedItem[]
}
type RawRecommendation = Omit<RecommendedMovie, 'genres'> & { genres?: NamedItem[] }

const normalizeSummary = (movie: RawMovie): MovieSummary => ({
  ...movie,
  genres: names(movie.genres),
})

const normalizeDetail = (movie: RawDetail): MovieDetail => ({
  ...movie,
  genres: names(movie.genres),
  production_companies: names(movie.production_companies),
  keywords: names(movie.keywords),
})

const normalizeRecommendation = (movie: RawRecommendation): RecommendedMovie => ({
  ...movie,
  genres: names(movie.genres),
})

export async function getMovies(
  params: MovieListParams = {},
): Promise<PaginatedMovies<MovieSummary>> {
  if (USE_MOCK_API) return (await import('./mock-api')).getMovies(params)
  const data = await request<PaginatedMovies<RawMovie>>('/api/movies', { ...params })
  return { ...data, items: data.items.map(normalizeSummary) }
}

export async function searchMovies(
  query: string,
  params: MovieListParams = {},
): Promise<PaginatedMovies<MovieSummary>> {
  if (USE_MOCK_API) return (await import('./mock-api')).searchMovies(query, params)
  const data = await request<PaginatedMovies<RawMovie>>('/api/search', {
    q: query,
    ...params,
  })
  return { ...data, items: data.items.map(normalizeSummary) }
}

export async function getMovieById(id: number): Promise<MovieDetail> {
  if (USE_MOCK_API) {
    try {
      return await (await import('./mock-api')).getMovieById(id)
    } catch {
      throw new ApiError('not_found', 'We could not find that movie.', 404)
    }
  }
  return normalizeDetail(await request<RawDetail>(`/api/movies/${id}`))
}

export async function getGenres(): Promise<Genre[]> {
  const data: GenresResponse = USE_MOCK_API
    ? await (await import('./mock-api')).getGenres()
    : await request<GenresResponse>('/api/genres')
  return names(data.genres as NamedItem[]).map((name) => ({ name, slug: slugify(name) }))
}

export async function getSimilarMovies(
  id: number,
  limit = 10,
): Promise<SimilarMoviesResponse> {
  if (USE_MOCK_API) {
    try {
      return await (await import('./mock-api')).getSimilarMovies(id, limit)
    } catch {
      throw new ApiError('not_found', 'We could not find that movie.', 404)
    }
  }
  const data = await request<Omit<SimilarMoviesResponse, 'recommendations'> & {
    recommendations: RawRecommendation[]
  }>(`/api/movies/${id}/similar`, { limit })
  return { ...data, recommendations: data.recommendations.map(normalizeRecommendation) }
}

export async function getHealth(): Promise<{ status: string }> {
  if (USE_MOCK_API) return { status: 'ok' }
  return request<{ status: string }>('/api/health')
}

/** Highlights one movie for the home hero, hydrated with full details. */
export async function getFeaturedMovie(): Promise<MovieDetail> {
  const { items } = await getMovies({ sort: 'popularity', limit: 1 })
  if (items.length === 0) {
    throw new ApiError('not_found', 'No featured movie is available right now.', 404)
  }
  return getMovieById(items[0].id)
}

/**
 * Personalised rail. Seeds from the user's most recently saved movie when
 * available, otherwise falls back to a popularity slice.
 */
export async function getRecommendedForYou(
  seedId: number | null,
  limit = 20,
): Promise<CardMovie[]> {
  if (seedId !== null) {
    const { recommendations } = await getSimilarMovies(seedId, limit)
    if (recommendations.length > 0) return recommendations
  }
  const { items } = await getMovies({ sort: 'rating', min_rating: 7, limit, page: 2 })
  return items
}
