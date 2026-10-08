'use client'

import { ArrowRight, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cta, PAGE_X } from '@/lib/ui'

export function LandingHero() {
  return (
    <section className="relative isolate min-h-[85svh] overflow-hidden bg-black">
      <Image
        src="/landing-hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover object-right"
      />

      {/* Overall dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-black/0"
      />

      {/* Strong left-side gradient for readable text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-transparent"
      />

      {/* Bottom fade into page background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-black/0"
      />

      <div
        className={`${PAGE_X} flex min-h-[85svh] w-full items-center pt-32 pb-16 sm:pt-36`}
      >
        <div className="max-w-2xl space-y-7">
          <p className="text-sm font-semibold tracking-[0.25em] text-primary uppercase">
            CineMatch
          </p>

          <h1 className="font-display text-5xl leading-[0.98] font-bold tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Discover movies
            <span className="block text-white/85">
              you&apos;ll love.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Explore thousands of movies, discover personalized recommendations,
            and find your next favorite film with CineMatch.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/signup"
              className={cta('primary', 'lg')}
            >
              Get Started
              <ArrowRight aria-hidden="true" />
            </Link>

            <Link
              href="/login"
              className={cta('secondary', 'lg')}
            >
              <Play
                className="fill-current"
                aria-hidden="true"
              />
              Sign In
            </Link>
          </div>

          <p className="text-sm text-white/50">
            Smart movie discovery powered by over 76,000 titles.
          </p>
        </div>
      </div>
    </section>
  )
}