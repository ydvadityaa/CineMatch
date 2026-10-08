'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Clapperboard,
  Compass,
  LogOut,
  Search,
  Sparkles,
  Tags,
  TrendingUp,
} from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { TrendingNow } from '@/components/landing/TrendingNow'
import { RecommendedForYou } from '@/components/dashboard/RecommendedForYou'
import { PopularMovies } from '@/components/dashboard/PopularMovies'

export default function DashboardPage() {
  const router = useRouter()

  const { user, status, signOut } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  function handleLogout() {
    signOut()
    window.location.href = '/'
  }

  function handleSearch() {
    const query = searchQuery.trim()

    if (!query) return

    router.push(
      `/search?q=${encodeURIComponent(query)}`,
    )
  }

  function handleSearchKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-zinc-500">
          Loading CineMatch...
        </p>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const avatar =
    user.gender === 'female'
      ? '👩'
      : '👨'

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">

          {/* BRAND */}

          <Link
            href="/dashboard"
            className="flex items-center gap-2"
          >
            <Clapperboard className="size-6 text-red-500" />

            <span className="text-xl font-bold tracking-tight">
              CineMatch
            </span>
          </Link>

          {/* NAVIGATION */}

          <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
            <Link
              href="/dashboard"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/browse"
              className="transition hover:text-white"
            >
              Browse
            </Link>

            <Link
              href="/recommendations"
              className="transition hover:text-white"
            >
              Recommendations
            </Link>

            <Link
              href="/genres"
              className="transition hover:text-white"
            >
              Genres
            </Link>
          </nav>

          {/* USER */}

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">

              {/* AVATAR */}

              <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-xl">
                {avatar}
              </div>

              {/* USERNAME */}

              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {user.username}
                </p>
              </div>
            </div>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Logout"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome + Search */}

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-red-900/10 blur-3xl" />

        <div className="mx-auto max-w-[1500px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
              Your CineMatch
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome back, {user.username}.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Explore movies, browse genres, discover similar titles,
              and get smarter recommendations from the CineMatch
              catalogue.
            </p>

            <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-xl border border-white/10 bg-zinc-950 p-2">
              <Search className="ml-3 size-5 shrink-0 text-zinc-500" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                placeholder="Search movies..."
                aria-label="Search movies"
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
          </div>
        </div>
      </section>

      {/* Trending */}

      <TrendingNow mode="page" />

      {/* Recommended */}

      <RecommendedForYou />

      {/* Popular */}

      <PopularMovies />

      {/* Explore CineMatch */}

      <section className="mx-auto max-w-[1500px] px-6 py-12 sm:px-10 lg:px-16">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Explore CineMatch
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Discover more ways to find your next movie.
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Browse the catalogue, explore genres, check
            recommendations, or see what&apos;s trending right now.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* BROWSE */}

          <Link
            href="/browse"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-zinc-900"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/5 transition group-hover:bg-white/10">
              <Compass className="size-5 text-white" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Browse Movies
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Explore movies from the full CineMatch catalogue.
            </p>

            <p className="mt-5 text-sm font-medium text-zinc-300">
              Explore catalogue →
            </p>
          </Link>

          {/* RECOMMENDATIONS */}

          <Link
            href="/recommendations"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-zinc-900"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/5 transition group-hover:bg-white/10">
              <Sparkles className="size-5 text-white" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Recommendations
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Discover movies using CineMatch similarity recommendations.
            </p>

            <p className="mt-5 text-sm font-medium text-zinc-300">
              View recommendations →
            </p>
          </Link>

          {/* GENRES */}

          <Link
            href="/genres"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-zinc-900"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/5 transition group-hover:bg-white/10">
              <Tags className="size-5 text-white" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Genres
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Browse Action, Drama, Horror, Comedy and more.
            </p>

            <p className="mt-5 text-sm font-medium text-zinc-300">
              Browse genres →
            </p>
          </Link>

          {/* TRENDING */}

          <Link
            href="/trending"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-zinc-900"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/5 transition group-hover:bg-white/10">
              <TrendingUp className="size-5 text-white" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Trending
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              See the movies people are talking about right now.
            </p>

            <p className="mt-5 text-sm font-medium text-zinc-300">
              View trending →
            </p>
          </Link>
        </div>
      </section>

      {/* Smart Discovery */}

      <section className="mx-auto max-w-[1500px] px-6 pb-16 sm:px-10 lg:px-16">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 to-zinc-900 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Smart Discovery
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Your movie discovery journey starts here.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            CineMatch combines movie metadata, similarity analysis,
            popularity, ratings, and audience signals to help you
            discover relevant movies faster.
          </p>
        </div>
      </section>
    </main>
  )
}