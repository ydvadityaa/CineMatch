'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  authService,
  type AuthUser,
  type Gender,
  type SignInInput,
  type SignUpInput,
} from '@/services/auth'

export type AuthStatus =
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'

interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus

  signIn: (
    input: SignInInput,
  ) => Promise<void>

  signUp: (
    input: SignUpInput,
  ) => Promise<void>

  signOut: () => void

  updateProfile: (patch: {
    firstName?: string
    lastName?: string
    username?: string
    gender?: Gender
  }) => void
}

const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  )

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null)

  const [status, setStatus] =
    useState<AuthStatus>('loading')

  useEffect(() => {
    const session =
      authService.getSession()

    setUser(session)

    setStatus(
      session
        ? 'authenticated'
        : 'unauthenticated',
    )
  }, [])

  const signIn = useCallback(
    async (
      input: SignInInput,
    ) => {
      const next =
        await authService.signIn(
          input,
        )

      setUser(next)

      setStatus(
        'authenticated',
      )
    },
    [],
  )

  const signUp = useCallback(
    async (
      input: SignUpInput,
    ) => {
      const next =
        await authService.signUp(
          input,
        )

      setUser(next)

      setStatus(
        'authenticated',
      )
    },
    [],
  )

  const signOut =
    useCallback(() => {
      authService.signOut()

      setUser(null)

      setStatus(
        'unauthenticated',
      )
    }, [])

  const updateProfile =
    useCallback(
      (patch: {
        firstName?: string
        lastName?: string
        username?: string
        gender?: Gender
      }) => {
        const next =
          authService.updateProfile(
            patch,
          )

        if (next) {
          setUser(next)
        }
      },
      [],
    )

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,
        status,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }),
      [
        user,
        status,
        signIn,
        signUp,
        signOut,
        updateProfile,
      ],
    )

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth():
  AuthContextValue {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider',
    )
  }

  return context
}