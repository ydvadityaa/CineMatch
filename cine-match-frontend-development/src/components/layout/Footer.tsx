import Link from 'next/link'
import { Logo } from '@/components/common/Logo'
import { PAGE_X } from '@/lib/ui'
import { cn } from '@/lib/utils'

const LINKS = [
  { label: 'About', href: '/info/about' },
  { label: 'Contact', href: '/info/contact' },
  { label: 'Privacy', href: '/info/privacy' },
  { label: 'Terms', href: '/info/terms' },
] as const

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('border-t border-white/8 bg-background', className)}>
      <div
        className={cn(
          'mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-5 py-8 sm:flex-row',
          PAGE_X,
        )}
      >
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Logo className="text-xl sm:text-xl" />

          <p className="text-xs text-muted-foreground">
            Discover movies you&apos;ll love.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="rounded-sm transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </Link>
              </li>
            ))}

            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}