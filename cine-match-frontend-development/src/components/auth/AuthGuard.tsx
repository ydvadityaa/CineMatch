'use client'

import { Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'

/** Redirects logged-out visitors to sign in and remembers where they were headed. */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [status, pathname, router])

  if (status !== 'authenticated') {
    return (
      <div className="grid min-h-dvh place-items-center bg-background" role="status">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Loading CineMatch</span>
      </div>
    )
  }

  return <>{children}</>
}
