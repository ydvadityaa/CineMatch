'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/common/Logo'
import { cn } from '@/lib/utils'
import { NavShell } from './NavShell'
import { NotificationsMenu } from './NotificationsMenu'
import { ProfileMenu } from './ProfileMenu'
import { SearchBox } from './SearchBox'

export const APP_NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/genres', label: 'Genres' },
  { href: '/my-list', label: 'My List' },
] as const

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppNavbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <NavShell>
      <Logo href="/home" />

      <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
        {APP_NAV_LINKS.map(({ href, label }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active ? 'font-semibold text-white' : 'text-white/65 hover:text-white',
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <SearchBox />
        <NotificationsMenu />
        <ProfileMenu />
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="grid size-10 place-items-center rounded-full text-white outline-none hover:text-white/80 focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full animate-pop-in border-b border-white/8 bg-background/95 py-2 backdrop-blur-xl md:hidden"
        >
          {APP_NAV_LINKS.map(({ href, label }) => {
            const active = isActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'block border-l-2 px-6 py-3 text-base outline-none focus-visible:bg-white/10',
                  active
                    ? 'border-primary font-semibold text-white'
                    : 'border-transparent text-white/70 hover:text-white',
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      )}
    </NavShell>
  )
}
