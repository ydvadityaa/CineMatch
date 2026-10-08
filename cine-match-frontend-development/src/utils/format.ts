export function formatYear(date: string | null | undefined): string {
  if (!date) return ''
  const year = new Date(date).getUTCFullYear()
  return Number.isNaN(year) ? '' : String(year)
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function formatRating(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value) || value <= 0) return 'NR'
  return value.toFixed(1)
}

export function formatVotes(value: number | null | undefined): string {
  if (!value) return '0'
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en').format(value)
}

export function formatLongDate(iso: string | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

let languageNames: Intl.DisplayNames | null = null

export function languageLabel(code: string | null | undefined): string {
  if (!code) return ''
  try {
    languageNames ??= new Intl.DisplayNames(['en'], { type: 'language' })
    return languageNames.of(code) ?? code.toUpperCase()
  } catch {
    return code.toUpperCase()
  }
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'CM'
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
