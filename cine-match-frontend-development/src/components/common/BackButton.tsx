'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
  fallback?: string
  label?: string
  className?: string
}

export function BackButton({
  fallback = '/dashboard',
  label = 'Back',
  className = '',
}: BackButtonProps) {
  const router = useRouter()

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallback)
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 ${className}`}
    >
      <ArrowLeft className="size-4" />
      {label}
    </button>
  )
}

