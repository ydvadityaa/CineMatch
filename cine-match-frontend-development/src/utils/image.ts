const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export type PosterSize = 'w185' | 'w342' | 'w500' | 'w780'
export type BackdropSize = 'w780' | 'w1280' | 'original'

/** Local preview assets (/mock/...) and absolute URLs are returned untouched. */
function resolveImage(
  path: string | null | undefined,
  size: string,
): string | null {
  if (!path) return null
  if (path.startsWith('/mock/') || /^https?:\/\//.test(path)) return path
  return `${TMDB_IMAGE_BASE}/${size}/${path.replace(/^\//, '')}`
}

export function posterUrl(
  path: string | null | undefined,
  size: PosterSize = 'w500',
): string | null {
  return resolveImage(path, size)
}

export function backdropUrl(
  path: string | null | undefined,
  size: BackdropSize = 'original',
): string | null {
  return resolveImage(path, size)
}
