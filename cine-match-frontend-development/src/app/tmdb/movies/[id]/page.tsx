'use client'

import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import {
  useParams,
  useRouter,
} from 'next/navigation'
import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { PublicNavbar } from '@/components/layout/PublicNavbar'

interface TMDBMovieDetail {
  id: number
  title: string
  original_title: string | null
  overview: string | null
  release_date: string | null
  runtime: number | null
  vote_average: number | null
  vote_count: number | null
  popularity: number | null
  original_language: string | null
  status: string | null
  tagline: string | null
  genres: string[]
  poster_url: string | null
  backdrop_url: string | null
}

interface RecommendedMovie {
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

interface RecommendationsResponse {
  count: number
  movies: RecommendedMovie[]
}

interface Trailer {
  id: string | null
  name: string | null
  key: string | null
  site: string | null
  type: string | null
  official: boolean
  youtube_url: string | null
  embed_url: string | null
}

interface VideosResponse {
  trailer: Trailer | null
}

interface MovieStill {
  file_path: string
  width: number | null
  height: number | null
  aspect_ratio: number | null
  vote_average: number | null
  image_url: string
}

interface MovieImagesResponse {
  count: number
  images: MovieStill[]
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://127.0.0.1:8000'

export default function TMDBMoviePage() {
  const params = useParams()
  const router = useRouter()

  const movieId = params.id as string

  const recommendationRailRef =
    useRef<HTMLDivElement>(null)

  const [movie, setMovie] =
    useState<TMDBMovieDetail | null>(null)

  const [recommendations, setRecommendations] =
    useState<RecommendedMovie[]>([])

  const [trailer, setTrailer] =
    useState<Trailer | null>(null)

  const [movieStills, setMovieStills] =
    useState<MovieStill[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(false)

  const [trailerLoading, setTrailerLoading] =
    useState(true)

  const [
    recommendationsLoading,
    setRecommendationsLoading,
  ] = useState(true)

  const [stillsLoading, setStillsLoading] =
    useState(true)

  // -------------------------------------------------------
  // NATURAL BACK
  // -------------------------------------------------------

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/dashboard')
  }

  // -------------------------------------------------------
  // MAIN MOVIE
  // -------------------------------------------------------

  useEffect(() => {
    if (!movieId) return

    const controller =
      new AbortController()

    async function loadMovie() {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch(
          `${API_URL}/api/tmdb/movies/${movieId}`,
          {
            signal: controller.signal,
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          throw new Error(
            `Movie API failed: ${response.status}`,
          )
        }

        const data: TMDBMovieDetail =
          await response.json()

        setMovie(data)
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'TMDB movie detail error:',
          err,
        )

        setError(true)
      } finally {
        setLoading(false)
      }
    }

    void loadMovie()

    return () => {
      controller.abort()
    }
  }, [movieId])

  // -------------------------------------------------------
  // TRAILER
  // -------------------------------------------------------

  useEffect(() => {
    if (!movieId) return

    const controller =
      new AbortController()

    async function loadTrailer() {
      try {
        setTrailerLoading(true)

        const response = await fetch(
          `${API_URL}/api/tmdb/movies/${movieId}/videos`,
          {
            signal: controller.signal,
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          console.warn(
            `Trailer API unavailable: ${response.status}`,
          )

          setTrailer(null)
          return
        }

        const data: VideosResponse =
          await response.json()

        setTrailer(
          data.trailer ?? null,
        )
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'TMDB trailer error:',
          err,
        )

        setTrailer(null)
      } finally {
        setTrailerLoading(false)
      }
    }

    void loadTrailer()

    return () => {
      controller.abort()
    }
  }, [movieId])

  // -------------------------------------------------------
  // MOVIE STILLS
  // -------------------------------------------------------

  useEffect(() => {
    if (!movieId) return

    const controller =
      new AbortController()

    async function loadMovieStills() {
      try {
        setStillsLoading(true)

        const response = await fetch(
          `${API_URL}/api/tmdb/movies/${movieId}/images?limit=8`,
          {
            signal: controller.signal,
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          console.warn(
            `Movie stills API unavailable: ${response.status}`,
          )

          setMovieStills([])
          return
        }

        const data: MovieImagesResponse =
          await response.json()

        setMovieStills(
          Array.isArray(data.images)
            ? data.images
            : [],
        )
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'TMDB movie stills error:',
          err,
        )

        setMovieStills([])
      } finally {
        setStillsLoading(false)
      }
    }

    void loadMovieStills()

    return () => {
      controller.abort()
    }
  }, [movieId])

  // -------------------------------------------------------
  // RECOMMENDATIONS
  // -------------------------------------------------------

  useEffect(() => {
    if (!movieId) return

    const controller =
      new AbortController()

    async function loadRecommendations() {
      try {
        setRecommendationsLoading(true)

        const response = await fetch(
          `${API_URL}/api/tmdb/movies/${movieId}/recommendations?limit=20`,
          {
            signal: controller.signal,
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          console.warn(
            `Recommendations API unavailable: ${response.status}`,
          )

          setRecommendations([])
          return
        }

        const data: RecommendationsResponse =
          await response.json()

        setRecommendations(
          Array.isArray(data.movies)
            ? data.movies
            : [],
        )
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'TMDB recommendations error:',
          err,
        )

        setRecommendations([])
      } finally {
        setRecommendationsLoading(false)
      }
    }

    void loadRecommendations()

    return () => {
      controller.abort()
    }
  }, [movieId])

  // -------------------------------------------------------
  // RECOMMENDATION RAIL
  // -------------------------------------------------------

  function scrollRecommendations(
    direction: 'left' | 'right',
  ) {
    recommendationRailRef.current?.scrollBy({
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
      <main className="min-h-screen bg-black text-white">
        <PublicNavbar />

        <div className="h-[88vh] animate-pulse bg-zinc-900" />
      </main>
    )
  }

  // -------------------------------------------------------
  // ERROR
  // -------------------------------------------------------

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-black text-white">
        <PublicNavbar />

        <div className="flex min-h-screen items-center justify-center px-6 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              Movie unavailable
            </h1>

            <p className="mt-2 text-zinc-400">
              We couldn&apos;t load this movie right now.
            </p>

            <button
              type="button"
              onClick={handleBack}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
          </div>
        </div>
      </main>
    )
  }

  const year =
    movie.release_date?.slice(0, 4) ??
    null

  const hours =
    movie.runtime !== null
      ? Math.floor(movie.runtime / 60)
      : 0

  const minutes =
    movie.runtime !== null
      ? movie.runtime % 60
      : 0

  return (
    <main className="min-h-screen bg-black text-white">
      <PublicNavbar />

      {/* HERO */}

      <section className="relative min-h-[88vh] overflow-hidden">
        {movie.backdrop_url && (
          <img
            src={movie.backdrop_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />

        {/* BACK */}

        <div className="absolute left-0 right-0 top-24 z-30 mx-auto max-w-7xl px-4 sm:px-8 lg:px-14">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/55 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>

        {/* CONTENT */}

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-end px-4 pb-16 pt-40 sm:px-8 lg:px-14 lg:pb-20">
          <div className="grid w-full gap-8 lg:grid-cols-[230px_1fr] lg:items-end lg:gap-10">

            {/* POSTER */}

            <div className="mx-auto w-[180px] sm:w-[210px] lg:mx-0 lg:w-[230px]">
              <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={`${movie.title} poster`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-zinc-500">
                    Poster unavailable
                  </div>
                )}
              </div>
            </div>

            {/* DETAILS */}

            <div className="max-w-3xl">
              {movie.tagline && (
                <p className="mb-3 text-sm font-medium tracking-wide text-zinc-300 sm:text-base">
                  {movie.tagline}
                </p>
              )}

              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-zinc-300">
                {movie.vote_average !==
                  null && (
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />

                    <span className="font-semibold text-white">
                      {movie.vote_average.toFixed(
                        1,
                      )}
                    </span>

                    {movie.vote_count !==
                      null && (
                      <span className="text-zinc-500">
                        (
                        {movie.vote_count.toLocaleString()}
                        )
                      </span>
                    )}
                  </div>
                )}

                {year && (
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    {year}
                  </div>
                )}

                {movie.runtime !== null && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4" />

                    <span>
                      {hours > 0 &&
                        `${hours}h `}

                      {minutes > 0 &&
                        `${minutes}m`}
                    </span>
                  </div>
                )}

                {movie.original_language && (
                  <span className="uppercase">
                    {
                      movie.original_language
                    }
                  </span>
                )}

                {movie.status && (
                  <span className="text-zinc-400">
                    {movie.status}
                  </span>
                )}
              </div>

              {/* GENRES */}

              {movie.genres.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {movie.genres.map(
                    (genre) => {
                      const genreSlug =
                        genre
                          .toLowerCase()
                          .trim()
                          .replace(
                            /\s+/g,
                            '-',
                          )

                      return (
                        <Link
                          key={genre}
                          href={`/genres/${genreSlug}`}
                          className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur transition hover:border-white/30 hover:bg-white/20"
                        >
                          {genre}
                        </Link>
                      )
                    },
                  )}
                </div>
              )}

              {movie.overview && (
                <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
                  {movie.overview}
                </p>
              )}

              {trailer?.youtube_url && (
                <a
                  href={trailer.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  <Play className="size-4 fill-current" />
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TRAILER */}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:px-14">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Official Video
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Trailer
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Official trailer provided through TMDB.
          </p>
        </div>

        {trailerLoading ? (
          <div className="aspect-video w-full max-w-5xl animate-pulse rounded-2xl bg-zinc-900" />
        ) : trailer?.embed_url ? (
          <div className="max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
            <iframe
              src={trailer.embed_url}
              title={
                trailer.name ||
                `${movie.title} trailer`
              }
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8">
            <p className="text-sm text-zinc-400">
              No official trailer is currently available for this movie.
            </p>
          </div>
        )}
      </section>

      {/* MOVIE STILLS */}

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-8 lg:px-14">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Gallery
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Movie Stills
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Official movie images from TMDB.
          </p>
        </div>

        {stillsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="aspect-video animate-pulse rounded-xl bg-zinc-900"
              />
            ))}
          </div>
        ) : movieStills.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movieStills.map(
              (still, index) => (
                <a
                  key={`${still.file_path}-${index}`}
                  href={still.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
                >
                  <img
                    src={still.image_url}
                    alt={`${movie.title} still ${index + 1}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/15" />
                </a>
              ),
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8">
            <p className="text-sm text-zinc-400">
              No movie stills are available for this title.
            </p>
          </div>
        )}
      </section>

      {/* RECOMMENDATIONS */}

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-8 lg:px-14">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            You May Also Like
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Recommended Movies
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Recommendations from TMDB based on {movie.title}.
          </p>
        </div>

        {recommendationsLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({
              length: 7,
            }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] w-[150px] shrink-0 animate-pulse rounded-xl bg-white/10 sm:w-[170px] lg:w-[190px]"
              />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                scrollRecommendations(
                  'left',
                )
              }
              aria-label="Scroll recommendations left"
              className="absolute left-2 top-[42%] z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white backdrop-blur transition hover:bg-white hover:text-black lg:flex"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div
              ref={
                recommendationRailRef
              }
              className="movie-rail flex gap-4 scroll-smooth pb-3"
            >
              {recommendations.map(
                (recommendedMovie) => {
                  const recommendedYear =
                    recommendedMovie.release_date
                      ? recommendedMovie.release_date.slice(
                          0,
                          4,
                        )
                      : null

                  return (
                    <Link
                      key={
                        recommendedMovie.id
                      }
                      href={`/tmdb/movies/${recommendedMovie.id}`}
                      className="group w-[150px] shrink-0 sm:w-[170px] lg:w-[190px]"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
                        {recommendedMovie.poster_url ? (
                          <img
                            src={
                              recommendedMovie.poster_url
                            }
                            alt={`${recommendedMovie.title} poster`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center p-4 text-center text-xs text-zinc-500">
                            Poster unavailable
                          </div>
                        )}

                        {recommendedMovie.vote_average !==
                          null && (
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                            <Star className="size-3 fill-yellow-400 text-yellow-400" />

                            {recommendedMovie.vote_average.toFixed(
                              1,
                            )}
                          </div>
                        )}
                      </div>

                      <h3 className="mt-3 truncate text-sm font-semibold text-white">
                        {
                          recommendedMovie.title
                        }
                      </h3>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        {recommendedYear && (
                          <span className="text-xs text-zinc-500">
                            {
                              recommendedYear
                            }
                          </span>
                        )}

                        {recommendedMovie.original_language && (
                          <span className="text-[11px] uppercase text-zinc-600">
                            {
                              recommendedMovie.original_language
                            }
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                },
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                scrollRecommendations(
                  'right',
                )
              }
              aria-label="Scroll recommendations right"
              className="absolute right-2 top-[42%] z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white backdrop-blur transition hover:bg-white hover:text-black lg:flex"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8">
            <p className="text-sm text-zinc-400">
              No TMDB recommendations are available for this movie.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}