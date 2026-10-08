import Image from 'next/image'
import Link from 'next/link'
import { GENRES, type GenreMeta } from '@/lib/genres'

function GenreCard({ genre }: { genre: GenreMeta }) {
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className="group relative isolate block aspect-[16/10] overflow-hidden rounded-xl bg-surface-2 ring-1 ring-white/10 transition-all duration-300 outline-none hover:-translate-y-1 hover:ring-white/30 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Image
        src={genre.art}
        alt=""
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="-z-20 object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 mix-blend-color"
        style={{ backgroundColor: `hsl(${genre.hue} 70% 45% / 0.75)` }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      <div className="flex h-full flex-col justify-end p-4">
        <h3 className="font-display text-2xl leading-tight font-bold tracking-wide text-white uppercase sm:text-[1.7rem]">
          {genre.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/75 sm:text-sm">{genre.description}</p>
      </div>
    </Link>
  )
}

export function GenreGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {GENRES.map((genre) => (
        <li key={genre.slug}>
          <GenreCard genre={genre} />
        </li>
      ))}
    </ul>
  )
}
