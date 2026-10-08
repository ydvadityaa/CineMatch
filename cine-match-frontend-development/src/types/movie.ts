// export interface MovieSummary {
//   id: number
//   title: string
//   release_date: string | null
//   vote_average: number
//   vote_count: number
//   popularity: number
//   original_language: string
//   poster_path: string | null
//   backdrop_path: string | null
//   genres: string[]
// }

// export interface MovieDetail extends MovieSummary {
//   runtime: number | null
//   adult: boolean
//   overview: string
//   tagline: string
//   production_companies: string[]
//   keywords: string[]
//   /** Optional YouTube video key. When present the trailer modal embeds it. */
//   trailer_key?: string | null
// }

// export interface RecommendedMovie {
//   id: number
//   title: string
//   release_date: string | null
//   genres: string[]
//   vote_average: number
//   vote_count: number
//   popularity: number
//   similarity_score: number
//   /** Not guaranteed by the recommendation endpoint; cards fall back gracefully. */
//   poster_path?: string | null
//   backdrop_path?: string | null
// }

// export interface PaginatedMovies<T = MovieSummary> {
//   page: number
//   limit: number
//   total: number
//   total_pages: number
//   count: number
//   items: T[]
// }

// export interface GenresResponse {
//   count: number
//   genres: string[]
// }

// export interface SimilarMoviesResponse {
//   movie_id: number
//   count: number
//   recommendations: RecommendedMovie[]
// }

// /** Minimal shape needed to render a card; satisfied by summaries and recommendations. */
// export interface CardMovie {
//   id: number
//   title: string
//   release_date: string | null
//   vote_average: number
//   genres: string[]
//   poster_path?: string | null
//   backdrop_path?: string | null
// }

// export type MovieSort = 'popularity' | 'rating' | 'newest' | 'oldest' | 'votes'

// export interface MovieListParams {
//   page?: number
//   limit?: number
//   genre?: string
//   language?: string
//   year_min?: number
//   year_max?: number
//   min_rating?: number
//   sort?: MovieSort
// }

// export interface Genre {
//   name: string
//   slug: string
// }

// export interface TrendingMovie {
//   id: number
//   title: string
//   original_title: string | null
//   overview: string | null
//   release_date: string | null
//   vote_average: number | null
//   vote_count: number | null
//   popularity: number | null
//   original_language: string | null
//   poster_url: string | null
//   backdrop_url: string | null
// }

// export interface TrendingMoviesResponse {
//   count: number
//   movies: TrendingMovie[]
// }

export interface MovieSummary {
  id: number
  title: string
  release_date: string | null
  vote_average: number | null
  vote_count: number | null
  popularity: number | null
  original_language: string | null
  poster_path: string | null
  backdrop_path: string | null
  genres: string[]
}

export interface MovieDetail extends MovieSummary {
  runtime: number | null
  adult: boolean | null
  overview: string | null
  tagline: string | null
  production_companies: string[]
  keywords: string[]

  /** Optional YouTube video key. */
  trailer_key?: string | null
}

export interface RecommendedMovie {
  id: number
  title: string
  release_date: string | null
  genres: string[]
  vote_average: number | null
  vote_count: number | null
  popularity: number | null
  similarity_score: number

  poster_path?: string | null
  backdrop_path?: string | null
}

export interface PaginatedMovies<T = MovieSummary> {
  page: number
  limit: number
  total: number
  total_pages: number
  count: number
  items: T[]
}

export interface GenresResponse {
  count: number
  genres: string[]
}

export interface SimilarMoviesResponse {
  movie_id: number
  count: number
  recommendations: RecommendedMovie[]
}

/**
 * Minimal movie shape used by reusable cards.
 */
export interface CardMovie {
  id: number
  title: string
  release_date: string | null
  vote_average: number | null
  genres: string[]
  poster_path?: string | null
  backdrop_path?: string | null
}

/**
 * Supported backend sorting options.
 */
export type MovieSort =
  | 'popularity'
  | 'rating'
  | 'votes'
  | 'newest'
  | 'oldest'
  | 'title'

/**
 * Filters supported by /api/movies and /api/search.
 */
export interface MovieListParams {
  page?: number
  limit?: number
  genre?: string
  language?: string
  year_min?: number
  year_max?: number
  min_rating?: number
  sort?: MovieSort
}

export interface Genre {
  name: string
  slug: string
}

export interface TrendingMovie {
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

export interface TrendingMoviesResponse {
  count: number
  movies: TrendingMovie[]
}