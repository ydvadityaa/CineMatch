'use client'

import { Clapperboard, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { backdropUrl } from '@/utils/image'

interface TrailerModalProps {
  open: boolean
  onClose: () => void
  title: string
  trailerKey?: string | null
  backdropPath?: string | null
}

/** Native <dialog> so focus trapping, Escape handling and focus restore come for free. */
export function TrailerModal({ open, onClose, title, trailerKey, backdropPath }: TrailerModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const backdrop = backdropUrl(backdropPath, 'w1280')

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${title} trailer`}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      className="modal m-auto w-[min(94vw,980px)] overflow-visible bg-transparent p-0 text-white"
    >
      {open && (
        <div className="animate-pop-in">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="truncate text-sm font-medium text-white/80">{title} · Trailer</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close trailer"
              className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
            {trailerKey ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title={`${title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            ) : (
              <>
                {backdrop && (
                  <Image
                    src={backdrop}
                    alt=""
                    fill
                    sizes="980px"
                    className="object-cover opacity-40 blur-[2px]"
                  />
                )}
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <span className="grid size-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <Clapperboard className="size-7" aria-hidden="true" />
                  </span>
                  <p className="text-lg font-semibold">Trailer not available yet</p>
                  <p className="max-w-sm text-sm leading-relaxed text-white/70">
                    The catalogue does not include a trailer for {title}. Once the backend returns a
                    trailer key, it will play right here.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
