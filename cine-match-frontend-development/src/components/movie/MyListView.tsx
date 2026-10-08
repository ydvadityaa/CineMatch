'use client'

import { Bookmark, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { MovieGridSkeleton } from '@/components/common/LoadingSkeleton'
import { PageShell } from '@/components/layout/PageShell'
import { useMyList } from '@/context/MyListContext'
import { cta } from '@/lib/ui'
import { MovieGrid } from './MovieGrid'

export function MyListView() {
  const { items, hydrated, count, clearList } = useMyList()
  const [confirming, setConfirming] = useState(false)

  const actions =
    count > 0 ? (
      confirming ? (
        <div className="flex items-center gap-2" role="group" aria-label="Confirm clearing your list">
          <span className="text-sm text-muted-foreground">Remove all {count} titles?</span>
          <button
            type="button"
            onClick={() => {
              clearList()
              setConfirming(false)
            }}
            className={cta('primary', 'sm')}
          >
            Yes, clear
          </button>
          <button type="button" onClick={() => setConfirming(false)} className={cta('outline', 'sm')}>
            Cancel
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className={cta('outline', 'sm')}>
          <Trash2 aria-hidden="true" />
          Clear list
        </button>
      )
    ) : null

  return (
    <PageShell
      title="My List"
      description={hydrated ? (count ? `${count} saved ${count === 1 ? 'title' : 'titles'}` : undefined) : undefined}
      actions={actions}
    >
      {!hydrated ? (
        <MovieGridSkeleton count={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Your list is empty"
          message="Tap the + on any movie to save it here and come back to it later."
          action={
            <Link href="/movies" className={cta('primary', 'md')}>
              Browse movies
            </Link>
          }
        />
      ) : (
        <MovieGrid movies={items} />
      )}
    </PageShell>
  )
}
