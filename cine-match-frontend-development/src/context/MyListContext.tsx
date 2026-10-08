'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLocalStorageState } from '@/hooks/use-local-storage-state'
import type { CardMovie } from '@/types/movie'

interface MyListContextValue {
  items: CardMovie[]
  hydrated: boolean
  count: number
  isInList: (id: number) => boolean
  toggleInList: (movie: CardMovie) => void
  removeFromList: (id: number) => void
  clearList: () => void
  isLiked: (id: number) => boolean
  toggleLike: (id: number) => void
}

const EMPTY_LIST: CardMovie[] = []
const EMPTY_LIKES: number[] = []

const MyListContext = createContext<MyListContextValue | null>(null)

/** Keep only what a card needs so persisted lists stay small. */
function toStored(movie: CardMovie): CardMovie {
  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    genres: movie.genres,
    poster_path: movie.poster_path ?? null,
    backdrop_path: movie.backdrop_path ?? null,
  }
}

/**
 * Per-user saved list and likes, persisted to localStorage for now.
 * Swap the storage hook for API calls once accounts live on the backend.
 */
export function MyListProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems, hydrated] = useLocalStorageState<CardMovie[]>(
    user ? `cinematch:list:${user.id}` : null,
    EMPTY_LIST,
  )
  const [likes, setLikes] = useLocalStorageState<number[]>(
    user ? `cinematch:likes:${user.id}` : null,
    EMPTY_LIKES,
  )

  const toggleInList = useCallback(
    (movie: CardMovie) => {
      setItems((previous) =>
        previous.some((m) => m.id === movie.id)
          ? previous.filter((m) => m.id !== movie.id)
          : [toStored(movie), ...previous],
      )
    },
    [setItems],
  )

  const removeFromList = useCallback(
    (id: number) => setItems((previous) => previous.filter((m) => m.id !== id)),
    [setItems],
  )

  const clearList = useCallback(() => setItems([]), [setItems])

  const toggleLike = useCallback(
    (id: number) =>
      setLikes((previous) =>
        previous.includes(id) ? previous.filter((x) => x !== id) : [...previous, id],
      ),
    [setLikes],
  )

  const value = useMemo<MyListContextValue>(() => {
    const listIds = new Set(items.map((m) => m.id))
    const likedIds = new Set(likes)
    return {
      items,
      hydrated,
      count: items.length,
      isInList: (id) => listIds.has(id),
      toggleInList,
      removeFromList,
      clearList,
      isLiked: (id) => likedIds.has(id),
      toggleLike,
    }
  }, [items, likes, hydrated, toggleInList, removeFromList, clearList, toggleLike])

  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
}

export function useMyList(): MyListContextValue {
  const context = useContext(MyListContext)
  if (!context) throw new Error('useMyList must be used within a MyListProvider')
  return context
}
