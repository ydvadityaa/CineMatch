import type { MovieListParams, MovieSort } from '@/types/movie'

export interface CatalogueFilters {
  q: string
  genre: string
  language: string
  decade: string
  rating: string
  sort: MovieSort
  page: number
}

export const DEFAULT_FILTERS: CatalogueFilters = {
  q: '',
  genre: '',
  language: '',
  decade: '',
  rating: '',
  sort: 'popularity',
  page: 1,
}

export const SORT_OPTIONS: Array<{ value: MovieSort; label: string }> = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'votes', label: 'Most Voted' },
]

export const RATING_OPTIONS = [
  { value: '', label: 'Any rating' },
  { value: '5', label: '5.0+' },
  { value: '6', label: '6.0+' },
  { value: '7', label: '7.0+' },
  { value: '8', label: '8.0+' },
]

export const DECADE_OPTIONS = [
  { value: '', label: 'Any year' },
  { value: '2020', label: '2020s' },
  { value: '2010', label: '2010s' },
  { value: '2000', label: '2000s' },
  { value: '1990', label: '1990s' },
  { value: '1980', label: '1980s' },
  { value: 'classic', label: 'Before 1980' },
]

export const LANGUAGE_OPTIONS = [
  { value: '', label: 'Any language' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'hi', label: 'Hindi' },
]

const SORT_VALUES = new Set<string>(SORT_OPTIONS.map((o) => o.value))

export function parseFilters(search: URLSearchParams): CatalogueFilters {
  const sort = search.get('sort') ?? ''
  const page = Number(search.get('page') ?? 1)
  return {
    q: search.get('q') ?? '',
    genre: search.get('genre') ?? '',
    language: search.get('language') ?? '',
    decade: search.get('decade') ?? '',
    rating: search.get('rating') ?? '',
    sort: SORT_VALUES.has(sort) ? (sort as MovieSort) : DEFAULT_FILTERS.sort,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function serializeFilters(filters: CatalogueFilters): string {
  const search = new URLSearchParams()
  for (const key of ['q', 'genre', 'language', 'decade', 'rating'] as const) {
    if (filters[key]) search.set(key, filters[key])
  }
  if (filters.sort !== DEFAULT_FILTERS.sort) search.set('sort', filters.sort)
  if (filters.page > 1) search.set('page', String(filters.page))
  return search.toString()
}

function decadeToRange(decade: string): Pick<MovieListParams, 'year_min' | 'year_max'> {
  if (!decade) return {}
  if (decade === 'classic') return { year_max: 1979 }
  const start = Number(decade)
  return Number.isNaN(start) ? {} : { year_min: start, year_max: start + 9 }
}

export function filtersToParams(
  filters: CatalogueFilters,
  limit: number,
  fixedGenre?: string,
): MovieListParams {
  return {
    page: filters.page,
    limit,
    sort: filters.sort,
    genre: fixedGenre ?? (filters.genre || undefined),
    language: filters.language || undefined,
    min_rating: filters.rating ? Number(filters.rating) : undefined,
    ...decadeToRange(filters.decade),
  }
}

export function activeFilterCount(filters: CatalogueFilters, fixedGenre?: string): number {
  let count = 0
  if (filters.q) count++
  if (filters.genre && !fixedGenre) count++
  if (filters.language) count++
  if (filters.decade) count++
  if (filters.rating) count++
  return count
}
