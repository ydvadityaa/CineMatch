import type { Metadata } from 'next'
import { Hero } from '@/components/movie/Hero'
import { HomeSections } from '@/components/movie/HomeSections'

export const metadata: Metadata = { title: 'Home' }

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <HomeSections />
    </main>
  )
}
