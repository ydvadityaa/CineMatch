'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { AuthError } from '@/services/auth'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!identifier.trim()) {
      setError('Please enter your username or email.')
      return
    }

    try {
      setLoading(true)

      await signIn({
        identifier,
        password,
        remember,
      })

      router.push('/dashboard')
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/90 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
            CineMatch
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Sign in to continue discovering movies.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* USERNAME OR EMAIL */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Username or Email
            </label>

            <input
              type="text"
              required
              value={identifier}
              onChange={(e) =>
                setIdentifier(e.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none transition focus:border-red-500"
              placeholder="Aditya or aditya123@gmail.com"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none transition focus:border-red-500"
              placeholder="Enter your password"
            />
          </div>

          {/* REMEMBER ME */}

          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
              className="size-4 accent-red-600"
            />

            Remember me
          </label>

          {/* ERROR */}

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* SIGN IN */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Signing In...'
              : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{' '}

          <Link
            href="/signup"
            className="font-medium text-white hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  )
}