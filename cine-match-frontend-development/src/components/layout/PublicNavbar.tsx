import Link from 'next/link'
import { Logo } from '@/components/common/Logo'
import { cta } from '@/lib/ui'
import { NavShell } from './NavShell'

interface PublicNavbarProps {
  action?: { href: string; label: string }
}

/** Navbar for logged-out pages: logo on the left, a single auth action on the right. */
export function PublicNavbar({ action = { href: '/login', label: 'Sign In' } }: PublicNavbarProps) {
  return (
    <NavShell>
      <Logo />
      <div className="ml-auto">
        <Link href={action.href} className={cta('primary', 'sm')}>
          {action.label}
        </Link>
      </div>
    </NavShell>
  )
}
