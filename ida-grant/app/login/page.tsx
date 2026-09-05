'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const role = profile?.role || 'applicant'
    const requested = new URLSearchParams(window.location.search).get('next') || ''
    const host = window.location.hostname.toLowerCase()

    if (host === 'agent.idawsg.com') {
      if (role === 'agent' || role === 'admin') {
        window.location.href = 'https://agent.idawsg.com'
      } else {
        window.location.href = '/'
      }
      return
    }

    if (host === 'admin.idawsg.com') {
      if (role === 'admin') {
        window.location.href = 'https://admin.idawsg.com'
      } else {
        window.location.href = '/'
      }
      return
    }

    const destination = requested.startsWith('/') && !requested.startsWith('//')
      ? requested
      : role === 'admin'
        ? '/admin'
        : role === 'agent'
          ? '/agent'
          : '/dashboard'

    router.replace(destination)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#F4F7F9] px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-bold text-[#005EA8]">
          ← IDA World Support Grant
        </Link>

        <div className="mt-8 rounded-2xl border border-[#D9E2E8] bg-white p-7 shadow-soft">
          <h1 className="text-2xl font-extrabold text-[#12304A]">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Access your applicant, agent, or administrator account.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block text-sm font-semibold">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"
              />
            </label>

            <label className="block text-sm font-semibold">
              Password
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"
              />
            </label>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-lg bg-[#005EA8] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-xs text-slate-500">
            New applicant?{' '}
            <Link href="/register" className="font-bold text-[#005EA8]">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
