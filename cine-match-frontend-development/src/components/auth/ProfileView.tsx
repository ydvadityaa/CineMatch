'use client'

import { Check, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useId, useState, type FormEvent } from 'react'
import { Avatar } from '@/components/common/Avatar'
import { PageShell } from '@/components/layout/PageShell'
import { useAuth } from '@/context/AuthContext'
import { useMyList } from '@/context/MyListContext'
import { cta } from '@/lib/ui'

const INPUT =
  'h-11 w-full rounded-md border border-white/12 bg-surface-2 px-3 text-sm text-white outline-none placeholder:text-muted-foreground hover:border-white/25 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60'

export function ProfileView() {
  const router = useRouter()
  const { user, signOut, updateProfile } = useAuth()
  const { count } = useMyList()
  const nameId = useId()
  const emailId = useId()
  const [name, setName] = useState(user?.username ?? '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) return null

  const memberSince = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.')
      setSaved(false)
      return
    }
    setError(null)
    updateProfile({
      username: trimmed,
    })
    setSaved(true)
  }

  return (
    <PageShell title="Profile">
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <section aria-label="Overview" className="flex flex-col items-center gap-4 rounded-xl border border-white/8 bg-surface p-8 text-center">
          <Avatar name={user.username} className="size-24 text-3xl" />
          <div>
            <p className="font-display text-2xl font-bold tracking-wide text-white uppercase">{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <dl className="grid w-full grid-cols-2 gap-3 border-t border-white/8 pt-4 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Member since</dt>
              <dd className="mt-0.5 font-medium text-white">{memberSince}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">In My List</dt>
              <dd className="mt-0.5 font-medium text-white">
                <Link href="/my-list" className="underline-offset-4 hover:underline">
                  {count} {count === 1 ? 'title' : 'titles'}
                </Link>
              </dd>
            </div>
          </dl>
        </section>

        <section id="account" aria-labelledby="account-heading" className="scroll-mt-28 rounded-xl border border-white/8 bg-surface p-6 sm:p-8">
          <h2 id="account-heading" className="font-display text-2xl font-bold tracking-wide text-white uppercase">
            Account
          </h2>
          <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-md space-y-5">
            <div>
              <label htmlFor={nameId} className="mb-1.5 block text-sm font-medium text-white">
                Display name
              </label>
              <input
                id={nameId}
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setSaved(false)
                }}
                autoComplete="name"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${nameId}-error` : undefined}
                className={INPUT}
              />
              {error && (
                <p id={`${nameId}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
            <div>
              <label htmlFor={emailId} className="mb-1.5 block text-sm font-medium text-white">
                Email
              </label>
              <input id={emailId} value={user.email} disabled readOnly className={INPUT} />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className={cta('primary', 'md')} disabled={name.trim() === user.username}>
                Save changes
              </button>
              {saved && (
                <p role="status" className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
                  <Check className="size-4" aria-hidden="true" /> Saved
                </p>
              )}
            </div>
          </form>

          <div className="mt-10 border-t border-white/8 pt-6">
            <button
              type="button"
              onClick={() => {
                signOut()
                router.replace('/')
              }}
              className={cta('outline', 'md')}
            >
              <LogOut aria-hidden="true" /> Sign out
            </button>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
