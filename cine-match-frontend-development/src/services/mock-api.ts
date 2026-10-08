/**
 * Preview-only stand-in for the FastAPI backend.
 *
 * It mimics the real response shapes (pagination, genres, similar movies) and
 * runs filtering/sorting/paging in memory so the UI behaves like it would
 * against the 76,000 movie catalogue. Disabled by NEXT_PUBLIC_USE_MOCK_API=false.
 */
import type {
  GenresResponse,
  MovieDetail,
  MovieListParams,
  MovieSummary,
  PaginatedMovies,
  RecommendedMovie,
  SimilarMoviesResponse,
} from '@/types/movie'
import { GENRES } from '@/lib/genres'

const GENRE_NAMES = GENRES.map((g) => g.name)

type Tone = 'epic' | 'dark' | 'warm' | 'light'

const TONE_BY_GENRE: Record<string, Tone> = {
  Action: 'epic',
  Adventure: 'epic',
  'Science Fiction': 'epic',
  Fantasy: 'epic',
  War: 'epic',
  Western: 'epic',
  Thriller: 'dark',
  Horror: 'dark',
  Crime: 'dark',
  Mystery: 'dark',
  Romance: 'warm',
  Comedy: 'warm',
  Drama: 'warm',
  Family: 'warm',
  Music: 'warm',
  'TV Movie': 'warm',
  Animation: 'light',
  Documentary: 'light',
  History: 'light',
}

const WORDS: Record<Tone, { adjectives: string[]; nouns: string[] }> = {
  epic: {
    adjectives: ['Iron', 'Golden', 'Last', 'Rising', 'Fallen', 'Lost', 'Burning', 'Endless'],
    nouns: ['Frontier', 'Horizon', 'Empire', 'Voyage', 'Legion', 'Odyssey', 'Crown', 'Storm'],
  },
  dark: {
    adjectives: ['Midnight', 'Silent', 'Crimson', 'Hollow', 'Broken', 'Forgotten', 'Cold', 'Shadow'],
    nouns: ['Witness', 'Door', 'Harvest', 'Signal', 'Garden', 'Verdict', 'Echo', 'Hour'],
  },
  warm: {
    adjectives: ['Summer', 'Little', 'Wild', 'Gentle', 'Borrowed', 'Second', 'Golden', 'Quiet'],
    nouns: ['Promise', 'Letters', 'Heart', 'Season', 'Window', 'Home', 'Melody', 'Chance'],
  },
  light: {
    adjectives: ['Secret', 'Curious', 'Wandering', 'Bright', 'Hidden', 'Ancient', 'Tiny', 'Magic'],
    nouns: ['Atlas', 'Lantern', 'Orchard', 'Compass', 'Archive', 'River', 'Journey', 'Garden'],
  },
}

const TITLE_VARIANTS = [
  (t: string) => t,
  (t: string) => `The ${t}`,
  (t: string) => `${t} II`,
  (t: string) => `${t}: Origins`,
  (t: string) => `${t} Returns`,
]

const OVERVIEWS: Record<Tone, string[]> = {
  epic: [
    'When an ancient threat awakens, an unlikely crew must cross a shattered frontier before the last light fades.',
    'A disgraced commander gets one final mission: reach the edge of the known world and bring back what was lost.',
    'As empires collapse, a young scout discovers a secret that could rewrite the fate of every kingdom.',
  ],
  dark: [
    'A single missed call pulls an investigator into a conspiracy that stretches far deeper than anyone imagined.',
    'Every night at the same hour, something changes in the house. By morning, someone is missing.',
    'The only witness to a perfect crime has a reason to lie, and a reason to run.',
  ],
  warm: [
    'Two strangers share one unforgettable summer that quietly changes the course of both their lives.',
    'A family reunion exposes old wounds and unexpected kindness in equal measure.',
    'After years apart, an old friendship gets a second chance, if they can both finally say what went unsaid.',
  ],
  light: [
    'Curiosity leads a small group down a hidden path where nothing is quite what it seems.',
    'Through patient observation and a little wonder, a remarkable story of discovery unfolds.',
    'An ordinary day turns extraordinary when a forgotten map surfaces in an old attic.',
  ],
}

const TAGLINES: Record<Tone, string[]> = {
  epic: ['The fight begins at the edge of the world.', 'Some legends are earned.', 'Nothing stays buried forever.'],
  dark: ['Not everyone makes it to morning.', 'Trust is the first casualty.', 'Listen closely.'],
  warm: ['Some moments stay with you forever.', 'Home is a feeling.', 'It was never really about the summer.'],
  light: ['Wonder is everywhere.', 'Every map begins with a question.', 'Look closer.'],
}

const KEYWORDS: Record<Tone, string[]> = {
  epic: ['journey', 'quest', 'rebellion', 'survival', 'ancient prophecy', 'epic battle'],
  dark: ['conspiracy', 'investigation', 'betrayal', 'suspense', 'cover-up', 'night'],
  warm: ['friendship', 'family', 'coming of age', 'second chance', 'small town', 'summer'],
  light: ['discovery', 'nature', 'imagination', 'adventure', 'mystery', 'friendship'],
}

const STUDIOS = [
  'Northlight Pictures',
  'Ember Reel Studios',
  'Parallax Films',
  'Gilded Hour',
  'Monarch Lane',
  'Silverline Entertainment',
  'Cobalt Harbor',
]

const RELATED: Record<string, string[]> = {
  Action: ['Thriller', 'Adventure', 'Crime', 'Science Fiction'],
  Adventure: ['Fantasy', 'Family', 'Action', 'Animation'],
  Animation: ['Family', 'Fantasy', 'Comedy', 'Adventure'],
  Comedy: ['Romance', 'Family', 'Drama', 'Music'],
  Crime: ['Thriller', 'Mystery', 'Drama', 'Action'],
  Documentary: ['History', 'Music', 'War', 'Drama'],
  Drama: ['Romance', 'History', 'Crime', 'Music'],
  Family: ['Animation', 'Comedy', 'Adventure', 'Fantasy'],
  Fantasy: ['Adventure', 'Family', 'Action', 'Animation'],
  History: ['War', 'Drama', 'Documentary', 'Western'],
  Horror: ['Thriller', 'Mystery', 'Science Fiction', 'Fantasy'],
  Music: ['Drama', 'Romance', 'Comedy', 'Documentary'],
  Mystery: ['Thriller', 'Crime', 'Horror', 'Drama'],
  Romance: ['Drama', 'Comedy', 'Music', 'Family'],
  'Science Fiction': ['Adventure', 'Action', 'Thriller', 'Mystery'],
  Thriller: ['Crime', 'Mystery', 'Action', 'Horror'],
  'TV Movie': ['Drama', 'Comedy', 'Family', 'Romance'],
  War: ['History', 'Drama', 'Action', 'Adventure'],
  Western: ['Action', 'Adventure', 'Drama', 'History'],
}

const POSTERS: Record<string, number[]> = {
  Action: [4, 11],
  Adventure: [3, 1],
  Animation: [9],
  Comedy: [7],
  Crime: [12, 2],
  Documentary: [8, 10],
  Drama: [8, 6],
  Family: [7, 9],
  Fantasy: [3, 9],
  History: [10, 11],
  Horror: [5],
  Music: [8, 6],
  Mystery: [12, 5],
  Romance: [6],
  'Science Fiction': [1],
  Thriller: [2, 12],
  'TV Movie': [7, 8],
  War: [10],
  Western: [11],
}

const BACKDROPS: Record<string, number[]> = {
  Action: [4],
  Adventure: [3, 1],
  Animation: [3],
  Comedy: [6],
  Crime: [2],
  Documentary: [1, 3],
  Drama: [6],
  Family: [6, 3],
  Fantasy: [3],
  History: [4, 3],
  Horror: [5],
  Music: [6],
  Mystery: [2, 5],
  Romance: [6],
  'Science Fiction': [1],
  Thriller: [2],
  'TV Movie': [6],
  War: [4],
  Western: [4, 1],
}

const LANGUAGES = ['en', 'en', 'en', 'fr', 'en', 'es', 'ja', 'en', 'ko', 'hi', 'de', 'it']

interface Curated {
  title: string
  genres: string[]
  poster: number
  backdrop: number
  year: number
  rating: number
  votes: number
  runtime: number
  language: string
  tagline: string
  overview: string
  keywords: string[]
}

/** Headline titles: these anchor the hero and the top of every popularity rail. */
const CURATED: Curated[] = [
  {
    title: 'Eclipse Horizon',
    genres: ['Science Fiction', 'Adventure', 'Drama'],
    poster: 1,
    backdrop: 1,
    year: 2024,
    rating: 8.4,
    votes: 18420,
    runtime: 148,
    language: 'en',
    tagline: 'Beyond the last sunrise, everything changes.',
    overview:
      'When a lone survey pilot crash-lands on a desert world orbited by twin moons, she uncovers a signal that has been waiting for humanity for ten thousand years. Cut off from home and running out of air, she must decide whether to answer it.',
    keywords: ['space exploration', 'first contact', 'survival', 'alien world', 'solitude'],
  },
  {
    title: 'Rain Protocol',
    genres: ['Thriller', 'Crime', 'Mystery'],
    poster: 2,
    backdrop: 2,
    year: 2023,
    rating: 7.9,
    votes: 14210,
    runtime: 124,
    language: 'en',
    tagline: 'In this city, the truth never stays dry.',
    overview:
      'A burned-out detective is handed a case no one else will touch: a string of disappearances that all trace back to a single neon-lit alley. As the storm worsens, so does the list of people who want her to stop looking.',
    keywords: ['detective', 'neo-noir', 'conspiracy', 'rain', 'city at night'],
  },
  {
    title: 'The Ember Crown',
    genres: ['Fantasy', 'Adventure', 'Action'],
    poster: 3,
    backdrop: 3,
    year: 2022,
    rating: 8.1,
    votes: 21930,
    runtime: 156,
    language: 'en',
    tagline: 'A kingdom lost. A flame reborn.',
    overview:
      'Exiled for a crime she did not commit, a young knight returns to the mountain fortress that cast her out, carrying the only weapon that can end a dragon-sworn war. The crown burns for those who dare to claim it.',
    keywords: ['dragon', 'kingdom', 'redemption', 'sword and sorcery', 'epic'],
  },
  {
    title: 'Redline Inferno',
    genres: ['Action', 'Thriller'],
    poster: 4,
    backdrop: 4,
    year: 2024,
    rating: 7.4,
    votes: 16780,
    runtime: 118,
    language: 'en',
    tagline: 'Full throttle. No brakes.',
    overview:
      'A retired getaway driver has one night to deliver a package across the desert, with a private army on his tail and a bomb ticking beneath the seat. The only way out is straight through the fire.',
    keywords: ['car chase', 'heist', 'desert', 'explosion', 'countdown'],
  },
  {
    title: 'The Hollow Window',
    genres: ['Horror', 'Mystery'],
    poster: 5,
    backdrop: 5,
    year: 2021,
    rating: 7.2,
    votes: 9870,
    runtime: 101,
    language: 'en',
    tagline: 'Someone is always watching from inside.',
    overview:
      'A family inherits a Victorian house at the edge of the fog line. Every night one window glows with a light no one has lit. By the third night, they stop counting who is still in the house.',
    keywords: ['haunted house', 'fog', 'ghost', 'inheritance', 'slow burn'],
  },
  {
    title: 'Umbrella Hours',
    genres: ['Romance', 'Drama'],
    poster: 6,
    backdrop: 6,
    year: 2023,
    rating: 7.8,
    votes: 11340,
    runtime: 112,
    language: 'fr',
    tagline: 'Love finds you in the middle of the rain.',
    overview:
      'Two strangers share one umbrella on a rain-soaked evening in Paris and, over the following week, an entire lifetime of almost-conversations. Some meetings are too well-timed to be an accident.',
    keywords: ['paris', 'rain', 'chance encounter', 'love story', 'city'],
  },
  {
    title: 'Yellow Van Summer',
    genres: ['Comedy', 'Family', 'Adventure'],
    poster: 7,
    backdrop: 6,
    year: 2022,
    rating: 7.1,
    votes: 8420,
    runtime: 104,
    language: 'en',
    tagline: 'Eight friends. One van. Zero plans.',
    overview:
      'A mismatched group of friends piles into a beat-up yellow van for one last cross-country road trip before life pulls them apart. What could possibly go wrong? Almost everything.',
    keywords: ['road trip', 'friendship', 'ensemble', 'summer', 'chaos'],
  },
  {
    title: 'The Quiet Tide',
    genres: ['Drama'],
    poster: 8,
    backdrop: 6,
    year: 2020,
    rating: 8.0,
    votes: 7650,
    runtime: 131,
    language: 'en',
    tagline: 'Some storms are heard long before they arrive.',
    overview:
      'In a weathered seaside house, a retired lighthouse keeper watches a storm roll in and finally opens the letters he never answered. A tender, slow-moving portrait of memory, regret and reconciliation.',
    keywords: ['sea', 'memory', 'family', 'regret', 'character study'],
  },
  {
    title: "Lumina's Glow",
    genres: ['Animation', 'Family', 'Fantasy'],
    poster: 9,
    backdrop: 3,
    year: 2024,
    rating: 8.2,
    votes: 13560,
    runtime: 96,
    language: 'en',
    tagline: 'Light the way home.',
    overview:
      "When a tiny forest spirit's glow begins to fade, she sets out across a kingdom of giant mushrooms to find the Heart Bloom, with a grumpy beetle for company and the whole twilight forest in her way.",
    keywords: ['forest spirit', 'friendship', 'magical creatures', 'animated', 'heartwarming'],
  },
  {
    title: 'Dawn at Ridgeline',
    genres: ['War', 'History', 'Drama'],
    poster: 10,
    backdrop: 4,
    year: 2019,
    rating: 8.3,
    votes: 15420,
    runtime: 142,
    language: 'en',
    tagline: 'Hold the line until the sun rises.',
    overview:
      'Over a single night in the autumn of 1944, a battered platoon is ordered to hold a ridge no one expects them to survive. A hard, humane account of courage, loss and the long walk home.',
    keywords: ['world war ii', 'platoon', 'sacrifice', 'based on true events', 'ridge'],
  },
  {
    title: 'Redrock Canyon',
    genres: ['Western', 'Action', 'Drama'],
    poster: 11,
    backdrop: 4,
    year: 2021,
    rating: 7.6,
    votes: 6980,
    runtime: 127,
    language: 'en',
    tagline: 'Justice rides alone.',
    overview:
      'A solitary rider crosses the canyon country to settle one last debt, only to find the town he left behind has become the thing he swore he would never ride into again.',
    keywords: ['frontier', 'gunslinger', 'canyon', 'revenge', 'lone rider'],
  },
  {
    title: 'Red String',
    genres: ['Mystery', 'Crime', 'Thriller'],
    poster: 12,
    backdrop: 2,
    year: 2022,
    rating: 7.7,
    votes: 10210,
    runtime: 119,
    language: 'en',
    tagline: 'Every thread leads somewhere. Pull carefully.',
    overview:
      'A retired analyst with a wall full of photographs and red thread is convinced a decade of cold cases share one author. Everyone calls it an obsession, until the next victim is someone she knows.',
    keywords: ['cold case', 'serial crime', 'obsession', 'investigation', 'noir'],
  },
]

const BASE_ID = 1000
const GENERATED_COUNT = GENRE_NAMES.length * 16

function pick<T>(list: T[], index: number): T {
  return list[index % list.length]
}

function releaseDate(year: number, n: number): string {
  const month = String(1 + ((n * 5) % 12)).padStart(2, '0')
  const day = String(1 + ((n * 11) % 28)).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildCatalogue(): MovieDetail[] {
  const movies: MovieDetail[] = CURATED.map((c, i) => ({
    id: BASE_ID + i,
    title: c.title,
    release_date: releaseDate(c.year, i + 3),
    vote_average: c.rating,
    vote_count: c.votes,
    popularity: 990 - i * 6,
    original_language: c.language,
    poster_path: `/mock/poster-${c.poster}.jpg`,
    backdrop_path: `/mock/backdrop-${c.backdrop}.jpg`,
    genres: c.genres,
    runtime: c.runtime,
    adult: false,
    overview: c.overview,
    tagline: c.tagline,
    production_companies: [pick(STUDIOS, i), pick(STUDIOS, i + 3)],
    keywords: c.keywords,
    trailer_key: null,
  }))

  for (let n = 0; n < GENERATED_COUNT; n++) {
    const primary = GENRE_NAMES[n % GENRE_NAMES.length]
    const k = Math.floor(n / GENRE_NAMES.length)
    const tone = TONE_BY_GENRE[primary]
    const words = WORDS[tone]
    const adjective = words.adjectives[n % 8]
    const noun = words.nouns[(n * 3 + Math.floor(n / 8)) % 8]
    const variant = TITLE_VARIANTS[Math.floor(n / 64) % TITLE_VARIANTS.length]
    const related = RELATED[primary]
    const genres = [primary, pick(related, n), ...(n % 3 === 0 ? [pick(related, n + 1)] : [])]
    const year = 1978 + ((n * 7) % 48)
    const posterIndex = pick(POSTERS[primary], k)
    const backdropIndex = pick(BACKDROPS[primary], k)

    movies.push({
      id: BASE_ID + 100 + n * 13,
      title: variant(`${adjective} ${noun}`),
      release_date: releaseDate(year, n),
      vote_average: Math.round((5 + ((n * 17) % 40) / 10) * 10) / 10,
      vote_count: 120 + ((n * 7919) % 24000),
      popularity: Math.round((5 + ((n * 31) % 900) / 10) * 10) / 10,
      original_language: pick(LANGUAGES, n),
      poster_path: `/mock/poster-${posterIndex}.jpg`,
      backdrop_path: `/mock/backdrop-${backdropIndex}.jpg`,
      genres: Array.from(new Set(genres)),
      runtime: 82 + ((n * 11) % 78),
      adult: false,
      overview: pick(OVERVIEWS[tone], n),
      tagline: pick(TAGLINES[tone], n + k),
      production_companies: [pick(STUDIOS, n), pick(STUDIOS, n + 2)],
      keywords: [0, 1, 2, 3].map((j) => pick(KEYWORDS[tone], n + j * 2)),
      trailer_key: null,
    })
  }

  return movies
}

let catalogue: MovieDetail[] | null = null
function getCatalogue(): MovieDetail[] {
  catalogue ??= buildCatalogue()
  return catalogue
}

const delay = (base = 260) =>
  new Promise<void>((resolve) => setTimeout(resolve, base + Math.random() * 220))

function toSummary(movie: MovieDetail): MovieSummary {
  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    popularity: movie.popularity,
    original_language: movie.original_language,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    genres: movie.genres,
  }
}

function yearOf(movie: MovieDetail): number {
  return movie.release_date ? Number(movie.release_date.slice(0, 4)) : 0
}

function applyFilters(
  list: MovieDetail[],
  params: MovieListParams,
  query?: string,
): MovieDetail[] {
  const q = query?.trim().toLowerCase()
  const genre = params.genre?.toLowerCase()
  return list.filter((movie) => {
    if (q && !movie.title.toLowerCase().includes(q)) return false
    if (genre && !movie.genres.some((g) => g.toLowerCase() === genre)) return false
    if (params.language && movie.original_language !== params.language) return false
    if (params.min_rating && movie.vote_average < params.min_rating) return false
    const year = yearOf(movie)
    if (params.year_min && year < params.year_min) return false
    if (params.year_max && year > params.year_max) return false
    return true
  })
}

function sortMovies(
  list: MovieDetail[],
  sort: MovieListParams['sort'] = 'popularity',
  query?: string,
): MovieDetail[] {
  const sorted = [...list]
  const q = query?.trim().toLowerCase()
  const relevance = (m: MovieDetail) => (q && m.title.toLowerCase().startsWith(q) ? 1 : 0)
  switch (sort) {
    case 'rating':
      sorted.sort((a, b) => b.vote_average - a.vote_average || b.vote_count - a.vote_count)
      break
    case 'newest':
      sorted.sort((a, b) => (b.release_date ?? '').localeCompare(a.release_date ?? ''))
      break
    case 'oldest':
      sorted.sort((a, b) => (a.release_date ?? '').localeCompare(b.release_date ?? ''))
      break
    case 'votes':
      sorted.sort((a, b) => b.vote_count - a.vote_count)
      break
    default:
      sorted.sort((a, b) => relevance(b) - relevance(a) || b.popularity - a.popularity)
  }
  return sorted
}

function paginate(
  list: MovieDetail[],
  params: MovieListParams,
): PaginatedMovies<MovieSummary> {
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 100)
  const total = list.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const page = Math.min(Math.max(params.page ?? 1, 1), totalPages)
  const items = list.slice((page - 1) * limit, page * limit).map(toSummary)
  return { page, limit, total, total_pages: totalPages, count: items.length, items }
}

export async function getMovies(
  params: MovieListParams = {},
): Promise<PaginatedMovies<MovieSummary>> {
  await delay()
  const filtered = applyFilters(getCatalogue(), params)
  return paginate(sortMovies(filtered, params.sort), params)
}

export async function searchMovies(
  query: string,
  params: MovieListParams = {},
): Promise<PaginatedMovies<MovieSummary>> {
  await delay(180)
  const filtered = applyFilters(getCatalogue(), params, query)
  return paginate(sortMovies(filtered, params.sort, query), params)
}

export class MockNotFoundError extends Error {}

export async function getMovieById(id: number): Promise<MovieDetail> {
  await delay()
  const movie = getCatalogue().find((m) => m.id === id)
  if (!movie) throw new MockNotFoundError(`Movie ${id} not found`)
  return movie
}

export async function getGenres(): Promise<GenresResponse> {
  await delay(120)
  return { count: GENRE_NAMES.length, genres: GENRE_NAMES }
}

export async function getSimilarMovies(
  id: number,
  limit = 10,
): Promise<SimilarMoviesResponse> {
  await delay()
  const source = getCatalogue().find((m) => m.id === id)
  if (!source) throw new MockNotFoundError(`Movie ${id} not found`)

  const sourceGenres = new Set(source.genres)
  const scored: RecommendedMovie[] = getCatalogue()
    .filter((m) => m.id !== id)
    .map((m) => {
      const shared = m.genres.filter((g) => sourceGenres.has(g)).length
      const union = new Set([...m.genres, ...source.genres]).size
      const jaccard = shared / union
      const closeness = 1 - Math.min(Math.abs(m.vote_average - source.vote_average) / 5, 1)
      return {
        id: m.id,
        title: m.title,
        release_date: m.release_date,
        genres: m.genres,
        vote_average: m.vote_average,
        vote_count: m.vote_count,
        popularity: m.popularity,
        similarity_score: Math.round((jaccard * 0.75 + closeness * 0.25) * 1000) / 1000,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
      }
    })
    .filter((m) => m.similarity_score > 0.2)
    .sort((a, b) => b.similarity_score - a.similarity_score || b.popularity - a.popularity)
    .slice(0, limit)

  return { movie_id: id, count: scored.length, recommendations: scored }
}
