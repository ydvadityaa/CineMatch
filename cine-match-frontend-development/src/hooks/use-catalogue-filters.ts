'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import {
  parseFilters,
  serializeFilters,
  type CatalogueFilters,
} from '@/lib/filters'

/** Keeps catalogue filters in the URL so results are shareable and survive refresh. */
export function useCatalogueFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = useMemo(() => parseFilters(new URLSearchParams(searchParams)), [searchParams])

  const update = useCallback(
    (patch: Partial<CatalogueFilters>) => {
      const next: CatalogueFilters = {
        ...filters,
        ...patch,
        page: patch.page ?? 1,
      }
      const query = serializeFilters(next)
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [filters, pathname, router],
  )

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [pathname, router])

  return { filters, update, reset }
}
