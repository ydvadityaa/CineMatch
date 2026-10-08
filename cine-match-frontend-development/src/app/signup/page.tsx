'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { AuthError } from '@/services/auth'
import type { Gender } from '@/services/auth'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!firstName.trim()) {
      setError('First name is required.')
      return
    }

    if (!lastName.trim()) {
      setError('Last name is required.')
      return
    }

    if (!username.trim()) {
      setError('Username is required.')
      return
    }

    if (!gender) {
      setError('Please select your gender.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setLoading(true)

      await signUp({
        firstName,
        lastName,
        username,
        email,
        password,
        gender,
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
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950/90 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
            CineMatch
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Start discovering movies made for your taste.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* FIRST + LAST NAME */}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                First Name
              </label>

              <input
                type="text"
                required
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none transition focus:border-red-500"
                placeholder="Aditya"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Last Name
              </label>

              <input
                type="text"
                required
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none transition focus:border-red-500"
                placeholder="Yadav"
              />
            </div>
          </div>

          {/* USERNAME */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Username
            </label>

            <input
              type="text"
              required
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none transition focus:border-red-500"
              placeholder="Aditya"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none transition focus:border-red-500"
              placeholder="aditya123@gmail.com"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Create Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none transition focus:border-red-500"
              placeholder="Create password"
            />
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Confirm Password
            </label>

            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none transition focus:border-red-500"
              placeholder="Confirm password"
            />
          </div>

          {/* GENDER */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Gender
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setGender('male')
                }
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                  gender === 'male'
                    ? 'border-red-500 bg-red-500/10 text-white'
                    : 'border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                👨 Male
              </button>

              <button
                type="button"
                onClick={() =>
                  setGender('female')
                }
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                  gender === 'female'
                    ? 'border-red-500 bg-red-500/10 text-white'
                    : 'border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                👩 Female
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-white hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}