import { cn } from '@/lib/utils'

/** Shared horizontal gutter so every section aligns to the same grid. */
export const PAGE_X = 'px-4 sm:px-8 lg:px-14'

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 active:translate-y-px [&_svg]:shrink-0'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary/85',
  light: 'bg-white text-black hover:bg-white/85',
  secondary: 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25',
  outline: 'border border-white/20 text-white hover:bg-white/10',
  ghost: 'text-muted-foreground hover:bg-white/10 hover:text-white',
} as const

const sizes = {
  sm: 'h-9 px-3.5 text-sm [&_svg]:size-4',
  md: 'h-11 px-5 text-sm [&_svg]:size-4.5',
  lg: 'h-12 px-7 text-base [&_svg]:size-5',
} as const

export type CtaVariant = keyof typeof variants
export type CtaSize = keyof typeof sizes

/** Class names for buttons and links so both share one visual language. */
export function cta(variant: CtaVariant = 'primary', size: CtaSize = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

/** Round icon button used on posters and toolbars. */
export const roundIconButton =
  'grid size-9 shrink-0 place-items-center rounded-full border border-white/35 bg-black/65 text-white backdrop-blur-sm transition-colors outline-none hover:border-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 [&_svg]:size-4'
