import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { LandingHero } from '@/components/landing/LandingHero'
import { TrendingNow } from '@/components/landing/TrendingNow'
import { PopularGenres } from '@/components/landing/PopularGenres'
import { Footer } from '@/components/layout/Footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicNavbar />

      <LandingHero />

      <TrendingNow mode="modal" />

      <PopularGenres />

      <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#0a0a0c] via-[#101114] to-[#0b0b0d] px-4 py-16 sm:px-8 lg:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-red-900/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-10 h-72 w-72 rounded-full bg-blue-900/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
              Smart Movie Discovery
            </p>

            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Find your next favorite movie.
            </h2>

            <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
              CineMatch helps you explore movies, discover similar titles,
              browse genres, and get smarter recommendations using a catalogue
              of more than 76,000 movies.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}