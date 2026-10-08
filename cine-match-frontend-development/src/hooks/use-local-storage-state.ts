'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Updater<T> = T | ((previous: T) => T)

/**
 * localStorage-backed state that is safe for SSR: the first render always uses
 * `initial`, then the stored value is read after mount (`hydrated` flips to true).
 * Pass `key = null` to disable persistence (e.g. while logged out).
 */
export function useLocalStorageState<T>(key: string | null, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [hydrated, setHydrated] = useState(false)
  const latest = useRef<T>(initial)
  const initialRef = useRef(initial)

  useEffect(() => {
    if (!key) {
      latest.current = initialRef.current
      setValue(initialRef.current)
      setHydrated(false)
      return
    }

    const load = () => {
      try {
        const raw = localStorage.getItem(key)
        const next = raw ? (JSON.parse(raw) as T) : initialRef.current
        latest.current = next
        setValue(next)
      } catch {
        latest.current = initialRef.current
        setValue(initialRef.current)
      }
    }

    load()
    setHydrated(true)

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) load()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  const update = useCallback(
    (next: Updater<T>) => {
      const resolved =
        typeof next === 'function' ? (next as (previous: T) => T)(latest.current) : next
      latest.current = resolved
      setValue(resolved)
      if (key) {
        try {
          localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // Storage can be full or disabled; the in-memory state still works.
        }
      }
    },
    [key],
  )

  return [value, update, hydrated] as const
}
