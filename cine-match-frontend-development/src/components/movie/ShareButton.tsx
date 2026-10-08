'use client'

import { Check, Share2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cta } from '@/lib/ui'

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const share = async () => {
    const url = window.location.href.split('?')[0]
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // User dismissed the sheet or sharing failed; fall back to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  return (
    <button type="button" onClick={share} className={cta('outline', 'lg')}>
      {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Link copied' : 'Share'}</span>
    </button>
  )
}
