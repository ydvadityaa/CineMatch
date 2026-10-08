'use client'

import {
  ArrowLeft,
  Play,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  useRouter,
  useSearchParams,
} from 'next/navigation'
import {
  useEffect,
  useState,
} from 'react'

import { ErrorState } from '@/components/common/ErrorState'
import { MovieDetailSkeleton } from '@/components/common/LoadingSkeleton'
import { useMovie } from '@/hooks/use-movies'
import { genreHref } from '@/lib/genres'
import {
  cta,
  PAGE_X,
} from '@/lib/ui'
import { cn } from '@/lib/utils'
import {
  formatLongDate,
  formatRuntime,
  languageLabel,
} from '@/utils/format'
import { backdropUrl } from '@/utils/image'

import { AddToListButton } from './AddToListButton'
import { LikeButton } from './LikeButton'
import { MovieMetadata } from './MovieMetadata'
import { MoviePoster } from './MoviePoster'
import { ShareButton } from './ShareButton'
import { SimilarMovies } from './SimilarMovies'
import { TrailerModal } from './TrailerModal'


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://127.0.0.1:8000'


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


function Fact({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>

      <dd className="mt-1 text-sm text-white">
        {children}
      </dd>
    </div>
  )
}


export function MovieDetailView({
  id,
}: {
  id: number
}) {
  const router = useRouter()
  const searchParams =
    useSearchParams()

  // -------------------------------------------------------
  // LOCAL MOVIE DATA - 76K DATASET
  // -------------------------------------------------------

  const {
    data: movie,
    error,
    isLoading,
    mutate,
  } = useMovie(id)

  // -------------------------------------------------------
  // TMDB MEDIA DATA
  // -------------------------------------------------------

  const [tmdbTrailer, setTmdbTrailer] =
    useState<Trailer | null>(null)

  const [movieStills, setMovieStills] =
    useState<MovieStill[]>([])

  const [
    trailerLoading,
    setTrailerLoading,
  ] = useState(true)

  const [
    stillsLoading,
    setStillsLoading,
  ] = useState(true)

  const [
    trailerOpen,
    setTrailerOpen,
  ] = useState(
    () =>
      searchParams.get(
        'trailer',
      ) === '1',
  )

  // -------------------------------------------------------
  // PAGE TITLE
  // -------------------------------------------------------

  useEffect(() => {
    if (movie) {
      document.title =
        `${movie.title} · CineMatch`
    }
  }, [movie])

  // -------------------------------------------------------
  // TMDB TRAILER
  // -------------------------------------------------------

  useEffect(() => {
    const controller =
      new AbortController()

    async function loadTrailer() {
      try {
        setTrailerLoading(true)

        const response =
          await fetch(
            `${API_URL}/api/tmdb/movies/${id}/videos`,
            {
              signal:
                controller.signal,
              cache: 'no-store',
            },
          )

        if (!response.ok) {
          console.warn(
            `TMDB trailer API unavailable: ${response.status}`,
          )

          setTmdbTrailer(null)
          return
        }

        const data: VideosResponse =
          await response.json()

        setTmdbTrailer(
          data.trailer ?? null,
        )
      } catch (err) {
        if (
          err instanceof
            DOMException &&
          err.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'TMDB trailer error:',
          err,
        )

        setTmdbTrailer(null)
      } finally {
        setTrailerLoading(false)
      }
    }

    void loadTrailer()

    return () => {
      controller.abort()
    }
  }, [id])

  // -------------------------------------------------------
  // TMDB MOVIE STILLS
  // -------------------------------------------------------

  useEffect(() => {
    const controller =
      new AbortController()

    async function loadMovieStills() {
      try {
        setStillsLoading(true)

        const response =
          await fetch(
            `${API_URL}/api/tmdb/movies/${id}/images?limit=8`,
            {
              signal:
                controller.signal,
              cache: 'no-store',
            },
          )

        if (!response.ok) {
          console.warn(
            `TMDB movie stills API unavailable: ${response.status}`,
          )

          setMovieStills([])
          return
        }

        const data:
          MovieImagesResponse =
          await response.json()

        setMovieStills(
          Array.isArray(
            data.images,
          )
            ? data.images
            : [],
        )
      } catch (err) {
        if (
          err instanceof
            DOMException &&
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
  }, [id])

  // -------------------------------------------------------
  // CLOSE TRAILER
  // -------------------------------------------------------

  const closeTrailer = () => {
    setTrailerOpen(false)

    if (
      searchParams.get(
        'trailer',
      )
    ) {
      router.replace(
        `/movies/${id}`,
        {
          scroll: false,
        },
      )
    }
  }

  // -------------------------------------------------------
  // LOADING
  // -------------------------------------------------------

  if (isLoading) {
    return (
      <MovieDetailSkeleton />
    )
  }

  // -------------------------------------------------------
  // ERROR
  // -------------------------------------------------------

  if (error || !movie) {
    return (
      <div
        className={cn(
          'pt-28 pb-24',
          PAGE_X,
        )}
      >
        <ErrorState
          error={error}
          onRetry={() =>
            void mutate()
          }
        />
      </div>
    )
  }

  // -------------------------------------------------------
  // LOCAL MOVIE INFORMATION
  // -------------------------------------------------------

  const backdrop =
    backdropUrl(
      movie.backdrop_path,
      'original',
    )

  const releaseDate =
    formatLongDate(
      movie.release_date ??
        undefined,
    )

  /*
   * Prefer live TMDB trailer.
   * If TMDB does not return one,
   * fall back to the trailer key
   * already stored on the local movie.
   */
  const trailerKey =
    tmdbTrailer?.key ||
    movie.trailer_key ||
    null

  const trailerAvailable =
    Boolean(trailerKey)

  // -------------------------------------------------------
  // PAGE
  // -------------------------------------------------------

  return (
    <article className="pb-20">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative h-[54svh] min-h-[360px] w-full overflow-hidden">

        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="animate-fade-in object-cover"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/30"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent"
        />

        {/* BACK */}

        <div
          className={cn(
            'absolute top-20 left-0',
            PAGE_X,
          )}
        >
          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-black/45 py-1.5 pr-3.5 pl-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors outline-none hover:bg-black/65 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft
              className="size-4"
              aria-hidden="true"
            />

            Back
          </button>
        </div>
      </div>

      {/* =====================================================
          MOVIE INFORMATION
      ===================================================== */}

      <div
        className={cn(
          'relative z-10 -mt-44 grid gap-8 sm:-mt-56 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] lg:gap-12',
          PAGE_X,
        )}
      >
        {/* POSTER */}

        <div className="mx-auto w-44 sm:w-56 md:mx-0 md:w-full">
          <MoviePoster
            title={movie.title}
            path={
              movie.poster_path
            }
            size="w780"
            priority
            sizes="(min-width: 1024px) 300px, (min-width: 768px) 260px, 224px"
            className="rounded-xl shadow-2xl shadow-black/70 ring-1 ring-white/10"
          />
        </div>

        {/* DETAILS */}

        <div className="min-w-0 space-y-5 md:pt-28 lg:pt-36">

          <header className="space-y-3">
            <h1 className="font-display text-4xl leading-none font-bold tracking-tight text-balance text-white uppercase sm:text-6xl">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-base text-white/75 italic">
                {
                  movie.tagline
                }
              </p>
            )}

            <MovieMetadata
              movie={movie}
              showVotes
              showLanguage
            />
          </header>

          {/* GENRES */}

          <ul
            className="flex flex-wrap gap-2"
            aria-label="Genres"
          >
            {movie.genres.map(
              (genre) => (
                <li key={genre}>
                  <Link
                    href={genreHref(
                      genre,
                    )}
                    className="inline-block rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-sm text-white transition-colors outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {genre}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {/* ACTIONS */}

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setTrailerOpen(
                  true,
                )
              }
              disabled={
                trailerLoading ||
                !trailerAvailable
              }
              className={cn(
                cta(
                  'light',
                  'lg',
                ),
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <Play
                className="fill-current"
                aria-hidden="true"
              />

              {trailerLoading
                ? 'Loading Trailer...'
                : trailerAvailable
                  ? 'Watch Trailer'
                  : 'Trailer Unavailable'}
            </button>

            <AddToListButton
              movie={movie}
              variant="full"
              size="lg"
            />

            <LikeButton
              movieId={
                movie.id
              }
              title={
                movie.title
              }
              variant="full"
              size="lg"
            />

            <ShareButton
              title={
                movie.title
              }
            />
          </div>

          {/* OVERVIEW */}

          <section
            aria-labelledby="overview-heading"
            className="max-w-3xl space-y-2"
          >
            <h2
              id="overview-heading"
              className="text-lg font-semibold text-white"
            >
              Overview
            </h2>

            <p className="leading-relaxed text-white/80">
              {movie.overview ||
                'No overview is available for this title yet.'}
            </p>
          </section>

          {/* FACTS */}

          <dl className="grid max-w-3xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-3">

            {releaseDate && (
              <Fact label="Release date">
                {
                  releaseDate
                }
              </Fact>
            )}

            {movie.runtime ? (
              <Fact label="Runtime">
                {formatRuntime(
                  movie.runtime,
                )}
              </Fact>
            ) : null}

            <Fact label="Language">
              {languageLabel(
                movie.original_language,
              ) || 'Unknown'}
            </Fact>

            {movie
              .production_companies
              .length >
              0 && (
              <Fact label="Production">
                {movie.production_companies
                  .slice(0, 3)
                  .join(', ')}
              </Fact>
            )}
          </dl>

          {/* KEYWORDS */}

          {movie.keywords.length >
            0 && (
            <section
              aria-labelledby="keywords-heading"
              className="max-w-3xl space-y-2.5"
            >
              <h2
                id="keywords-heading"
                className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                Keywords
              </h2>

              <ul className="flex flex-wrap gap-2">
                {movie.keywords
                  .slice(0, 12)
                  .map(
                    (
                      keyword,
                    ) => (
                      <li
                        key={
                          keyword
                        }
                        className="rounded-md bg-surface-2 px-2.5 py-1 text-xs text-white/80"
                      >
                        {
                          keyword
                        }
                      </li>
                    ),
                  )}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* =====================================================
          MOVIE STILLS - TMDB
      ===================================================== */}

      <section
        className={cn(
          'mt-20',
          PAGE_X,
        )}
      >
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Gallery
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Movie Stills
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Official movie images from TMDB.
          </p>
        </div>

        {stillsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={
                    index
                  }
                  className="aspect-video animate-pulse rounded-xl bg-white/10"
                />
              ),
            )}
          </div>
        ) : movieStills.length >
          0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movieStills.map(
              (
                still,
                index,
              ) => (
                <a
                  key={`${still.file_path}-${index}`}
                  href={
                    still.image_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
                >
                  <img
                    src={
                      still.image_url
                    }
                    alt={`${movie.title} still ${index + 1}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/15" />
                </a>
              ),
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-muted-foreground">
              No movie stills are available for this title.
            </p>
          </div>
        )}
      </section>

      {/* =====================================================
          YOUR OWN ML RECOMMENDATIONS
      ===================================================== */}

      <div className="mt-20">
        <SimilarMovies
          movieId={movie.id}
          title={movie.title}
        />
      </div>

      {/* =====================================================
          TRAILER MODAL - TMDB
      ===================================================== */}

      <TrailerModal
        open={
          trailerOpen &&
          trailerAvailable
        }
        onClose={closeTrailer}
        title={movie.title}
        trailerKey={
          trailerKey
        }
        backdropPath={
          movie.backdrop_path
        }
      />
    </article>
  )
}