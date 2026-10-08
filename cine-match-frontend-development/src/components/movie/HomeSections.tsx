import type { MovieListParams } from '@/types/movie'
import { genreHref } from '@/lib/genres'
import { MovieRail } from './MovieRail'
import { RecommendedRail } from './RecommendedRail'

interface SectionConfig {
  title: string
  params: MovieListParams
  href: string
  ranked?: boolean
  subtitle?: string
}

const genreSection = (genre: string, title = genre): SectionConfig => ({
  title,
  params: { genre, sort: 'popularity' },
  href: genreHref(genre),
})

/** Add, remove or reorder home rails by editing this list. */
const SECTIONS: SectionConfig[] = [
  { title: 'Trending Now', params: { sort: 'popularity' }, href: '/movies?sort=popularity', ranked: true },
  { title: 'Popular Movies', params: { sort: 'votes', page: 1 }, href: '/movies?sort=votes' },
  { title: 'Top Rated', params: { sort: 'rating', min_rating: 7 }, href: '/movies?sort=rating' },
  genreSection('Action'),
  genreSection('Science Fiction'),
  genreSection('Thriller'),
  genreSection('Comedy'),
  genreSection('Drama'),
  genreSection('Horror'),
  genreSection('Romance'),
]

export function HomeSections() {
  return (
    <div className="relative z-10 -mt-24 space-y-6 pb-16 sm:-mt-28 sm:space-y-8">
      <RecommendedRail />
      {SECTIONS.map((section, index) => (
        <MovieRail
          key={section.title}
          title={section.title}
          params={section.params}
          href={section.href}
          ranked={section.ranked}
          eager={index === 0}
        />
      ))}
    </div>
  )
}
