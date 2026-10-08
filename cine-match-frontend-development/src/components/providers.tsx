'use client'

import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { AuthProvider } from '@/context/AuthContext'
import { MyListProvider } from '@/context/MyListContext'
import { ApiError } from '@/services/api'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 60_000,
        errorRetryCount: 1,
        shouldRetryOnError: (error) => !(error instanceof ApiError && error.kind === 'not_found'),
      }}
    >
      <AuthProvider>
        <MyListProvider>{children}</MyListProvider>
      </AuthProvider>
    </SWRConfig>
  )
}
