import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  className?: string
}

export function Logo({ href = '/', className }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="CineMatch home"
      className={cn(
        'inline-flex items-center gap-2 rounded-sm font-display text-2xl leading-none font-bold tracking-wide uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-[1.7rem]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-[7px] bg-primary shadow-[0_0_18px_-2px] shadow-primary/60"
      >
        <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden="true">
          <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
        </svg>
      </span>
      <span>
        Cine<span className="text-primary">Match</span>
      </span>
    </Link>
  )
}
