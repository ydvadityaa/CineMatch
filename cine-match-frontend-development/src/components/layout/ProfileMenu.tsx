'use client'

import { Bookmark, LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Avatar } from '@/components/common/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useDismissable } from '@/hooks/use-ui'

const ITEM =
  'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 transition-colors outline-none hover:bg-white/8 hover:text-white focus-visible:bg-white/10 [&_svg]:size-4 [&_svg]:text-muted-foreground'

export function ProfileMenu() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismissable<HTMLDivElement>(open, close)

  if (!user) return null

  const handleSignOut = () => {
    close()
    signOut()
    router.replace('/')
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="grid size-9 place-items-center rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar name={user.name} className="size-9" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] animate-pop-in overflow-hidden rounded-xl border border-white/12 bg-card shadow-2xl shadow-black/60">
          <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3.5">
            <Avatar name={user.name} className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <nav aria-label="Account" className="py-1">
            <Link href="/profile" onClick={close} className={ITEM}>
              <User aria-hidden="true" /> Profile
            </Link>
            <Link href="/profile#account" onClick={close} className={ITEM}>
              <Settings aria-hidden="true" /> Account
            </Link>
            <Link href="/my-list" onClick={close} className={ITEM}>
              <Bookmark aria-hidden="true" /> My List
            </Link>
          </nav>
          <div className="border-t border-white/8 py-1">
            <button type="button" onClick={handleSignOut} className={ITEM}>
              <LogOut aria-hidden="true" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
