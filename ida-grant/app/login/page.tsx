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

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: role } = await supabase.rpc('get_my_role')
    const requested = new URLSearchParams(window.location.search).get('next') || ''

    if (requested === '/admin' || requested.startsWith('/admin/')) {
      if (role !== 'admin') {
        await supabase.auth.signOut()
        setError('Administrator access is required for this area.')
        setLoading(false)
        return
      }
      router.replace(requested)
      router.refresh()
      return
    }

    if (requested === '/agent' || requested.startsWith('/agent/')) {
      if (role !== 'agent' && role !== 'admin') {
        await supabase.auth.signOut()
        setError('Staff access is required for this area.')
        setLoading(false)
        return
      }
      router.replace(requested)
      router.refresh()
      return
    }

    if (role === 'admin') router.replace('/admin')
    else if (role === 'agent') router.replace('/agent')
    else {
      await supabase.auth.signOut()
      setError('Applicant login is not available. Please use the application form instead.')
      setLoading(false)
      return
    }
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#F4F7F9] px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-bold text-[#005EA8]">← IDA World Support Grant</Link>
        <div className="mt-8 rounded-2xl border border-[#D9E2E8] bg-white p-7 shadow-soft">
          <h1 className="text-2xl font-extrabold text-[#12304A]">Staff sign in</h1>
          <p className="mt-2 text-sm text-slate-500">This sign-in is for authorized agents and administrators only. Applicants do not need an account or password to apply.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block text-sm font-semibold">Email
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" />
            </label>
            <label className="block text-sm font-semibold">Password
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" />
            </label>
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <button disabled={loading} className="w-full rounded-lg bg-[#005EA8] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{loading ? 'Signing in…' : 'Staff sign in'}</button>
          </form>

          <div className="mt-6 rounded-lg bg-[#EAF1F5] p-4 text-sm text-[#12304A]">
            <p className="font-bold">Are you an applicant?</p>
            <p className="mt-1">You can apply directly without registering or signing in.</p>
            <Link href="/apply" className="mt-3 inline-block font-bold text-[#005EA8]">Start application →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
