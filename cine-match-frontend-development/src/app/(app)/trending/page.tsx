import type { Metadata } from 'next'
import {
  ArrowLeft,
  Flame,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

import { PageShell } from '@/components/layout/PageShell'
import { ExploreTrending } from '@/components/trending/ExploreTrending'

export const metadata: Metadata = {
  title: 'Trending Movies',
}

export default function TrendingPage() {
  return (
    <PageShell>
      {/* BACK TO DASHBOARD */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />

          Back to Dashboard
        </Link>
      </div>

      {/* HEADER */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-red-500">
          <TrendingUp className="size-5" />

          <p className="text-sm font-semibold uppercase tracking-[0.2em]">
            What&apos;s Hot
          </p>
        </div>

        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide text-white sm:text-6xl">
          Trending Movies
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          Discover movies people are watching and talking about
          right now. Explore what&apos;s currently trending and
          open any title to see its details.
        </p>
      </header>

      {/* INFO CARDS */}
      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10">
            <Flame className="size-5 text-red-500" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-white">
            Trending Now
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            See movies currently gaining the most audience attention.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10">
            <TrendingUp className="size-5 text-red-500" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-white">
            Live Rankings
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Trending titles can change as movie activity changes.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10">
            <Sparkles className="size-5 text-red-500" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-white">
            Discover More
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Open any movie to explore its rating, overview and details.
          </p>
        </div>
      </section>

      {/* TRENDING MOVIES */}
      <section className="mb-10">
        <div className="mb-7">
          <div className="flex items-center gap-2">
            <Flame className="size-5 text-red-500" />

            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Trending Now
            </h2>
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            Popular movies people are watching right now.
          </p>
        </div>

        <ExploreTrending />
      </section>
    </PageShell>
  )
}