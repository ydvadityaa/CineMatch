import type { ReactNode } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { Footer } from '@/components/layout/Footer'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh flex-col">
        <AppNavbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </AuthGuard>
  )
}
