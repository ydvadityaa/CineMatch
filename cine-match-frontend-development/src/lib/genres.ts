import type { Genre } from '@/types/movie'
import { slugify } from '@/utils/format'

export interface GenreMeta extends Genre {
  description: string
  /** Local artwork used on genre cards until backdrops come from the API. */
  art: string
  /** Hue used for the subtle card tint. */
  hue: number
}

const ART = (n: number) => `/mock/backdrop-${n}.jpg`

const RAW: Array<[string, string, number, number]> = [
  ['Action', 'High-octane set pieces and edge-of-your-seat chases.', 4, 28],
  ['Adventure', 'Epic journeys to the farthest corners of the map.', 3, 40],
  ['Animation', 'Imaginative worlds brought to life frame by frame.', 3, 280],
  ['Comedy', 'Laugh-out-loud stories to lift any mood.', 6, 45],
  ['Crime', 'Heists, investigations and the shadows of the city.', 2, 190],
  ['Documentary', 'Real stories, remarkable people, true events.', 1, 210],
  ['Drama', 'Character-driven stories that stay with you.', 6, 20],
  ['Family', 'Warm, feel-good films for every generation.', 6, 50],
  ['Fantasy', 'Magic, myth and worlds beyond imagination.', 3, 150],
  ['History', 'Landmark moments and the people who shaped them.', 4, 35],
  ['Horror', 'Dread, suspense and sleepless nights.', 5, 220],
  ['Music', 'Stories told through rhythm, melody and stage lights.', 6, 330],
  ['Mystery', 'Clues, twists and secrets waiting to be unravelled.', 2, 250],
  ['Romance', 'Love stories from first glance to final goodbye.', 6, 10],
  ['Science Fiction', 'Future worlds, strange frontiers, big ideas.', 1, 200],
  ['Thriller', 'Tense, twisting stories that keep you guessing.', 2, 180],
  ['TV Movie', 'Standout stories made for the small screen.', 6, 60],
  ['War', 'Courage and sacrifice on the front lines of history.', 4, 100],
  ['Western', 'Dust, duels and the untamed frontier.', 4, 30],
]

export const GENRES: GenreMeta[] = RAW.map(
  ([name, description, art, hue]) => ({
    name,
    slug: slugify(name),
    description,
    art: ART(art),
    hue,
  }),
)

export function findGenreBySlug(slug: string): GenreMeta | undefined {
  return GENRES.find((genre) => genre.slug === slug)
}

export function genreHref(name: string): string {
  return `/genres/${slugify(name)}`
}
