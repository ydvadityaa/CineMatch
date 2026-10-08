'use client'

import { Bell, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useDismissable } from '@/hooks/use-ui'

const NOTIFICATIONS = [
  {
    id: 'recs',
    icon: Sparkles,
    title: 'New picks for you',
    body: 'Your recommendations were refreshed.',
    href: '/home',
  },
  {
    id: 'trending',
    icon: TrendingUp,
    title: 'Trending this week',
    body: 'See what everyone is watching right now.',
    href: '/movies?sort=popularity',
  },
] as const

/** Placeholder notification centre; swap the static list for API data later. */
export function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismissable<HTMLDivElement>(open, close)

  const toggle = () => {
    setOpen((value) => !value)
    setUnread(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={unread ? 'Notifications, 2 unread' : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative grid size-10 place-items-center rounded-full text-white outline-none hover:text-white/80 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="size-5" aria-hidden="true" />
        {unread && (
          <span aria-hidden="true" className="absolute top-2 right-2.5 size-2 rounded-full bg-primary ring-2 ring-background" />
        )}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] animate-pop-in overflow-hidden rounded-xl border border-white/12 bg-card shadow-2xl shadow-black/60">
          <p className="border-b border-white/8 px-4 py-3 text-sm font-semibold text-white">Notifications</p>
          <ul>
            {NOTIFICATIONS.map(({ id, icon: Icon, title, body, href }) => (
              <li key={id}>
                <Link
                  href={href}
                  onClick={close}
                  className="flex gap-3 px-4 py-3 transition-colors outline-none hover:bg-white/5 focus-visible:bg-white/10"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-white">{title}</span>
                    <span className="block text-xs text-muted-foreground">{body}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
