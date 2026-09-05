'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, MessageCircle, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ChatPanel } from '@/components/chat-panel'

type Application = {
  id: string
  application_number: string
  status: string
  full_name: string
  email: string | null
  city: string | null
  created_at: string
  reason: string | null
}

const statusLabel = (status: string) => status.replaceAll('_', ' ')

export default function MyApplicationsPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code' | 'applications'>('email')
  const [apps, setApps] = useState<Application[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadApplications() {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return false
    const { data, error: loadError } = await supabase
      .from('applications')
      .select('id,application_number,status,full_name,email,city,created_at,reason')
      .eq('applicant_id', user.user.id)
      .order('created_at', { ascending: false })
    if (loadError) {
      setError(loadError.message)
      return false
    }
    setApps((data || []) as Application[])
    return true
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user || data.user.is_anonymous) return
      setEmail(data.user.email || '')
      if (await loadApplications()) setStep('applications')
    })
  }, [])

  async function sendCode(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const normalized = email.trim().toLowerCase()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: { shouldCreateUser: true },
    })
    if (otpError) setError(otpError.message)
    else {
      setEmail(normalized)
      setStep('code')
      setMessage('We sent a verification code to your email. Enter it below to view your applications.')
    }
    setLoading(false)
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: code.trim(), type: 'email' })
    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }
    const { data: claimed, error: claimError } = await supabase.rpc('claim_applications_by_email')
    if (claimError) {
      setError(claimError.message)
      setLoading(false)
      return
    }
    setApps((claimed || []) as Application[])
    setStep('applications')
    setMessage((claimed || []).length ? 'Your applications are ready to view.' : 'No applications were found for this email address.')
    setLoading(false)
  }

  async function refresh() {
    setLoading(true)
    setError('')
    await loadApplications()
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F7F9] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-bold text-[#005EA8]">← IDA World Support Grant</Link>
        <div className="mt-6 rounded-2xl border border-[#D9E2E8] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#005EA8]">Applicants</p>
              <h1 className="mt-2 text-2xl font-extrabold text-[#12304A]">My applications</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Use the email address you used when applying. We will send a one-time verification code so you can securely track your applications and open the live chat for each submission.</p>
            </div>
            {step === 'applications' && <button onClick={refresh} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-[#005EA8]"><RefreshCw size={14}/> Refresh</button>}
          </div>

          {step === 'email' && (
            <form onSubmit={sendCode} className="mt-7 max-w-lg space-y-4">
              <label className="block text-sm font-semibold text-[#27465A]">Email address
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 px-3 focus-within:border-[#005EA8]">
                  <Mail size={17} className="text-slate-400" />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-0 px-1 py-3 text-sm outline-none" placeholder="you@example.com" />
                </div>
              </label>
              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <button disabled={loading} className="rounded-lg bg-[#005EA8] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{loading ? 'Sending code…' : 'Email me a verification code'}</button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={verifyCode} className="mt-7 max-w-lg space-y-4">
              <label className="block text-sm font-semibold text-[#27465A]">Verification code
                <input required inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm tracking-[0.35em] outline-none focus:border-[#005EA8]" placeholder="123456" />
              </label>
              {message && <div className="rounded-lg bg-[#EAF1F5] p-3 text-sm text-[#12304A]">{message}</div>}
              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <div className="flex flex-wrap gap-3">
                <button disabled={loading} className="rounded-lg bg-[#005EA8] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{loading ? 'Checking…' : 'View my applications'}</button>
                <button type="button" onClick={() => { setStep('email'); setCode(''); setMessage('') }} className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600">Use another email</button>
              </div>
            </form>
          )}

          {step === 'applications' && (
            <div className="mt-7 space-y-6">
              {message && <div className="rounded-lg bg-[#EAF1F5] p-3 text-sm text-[#12304A]">{message}</div>}
              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              {!apps.length && !error && <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center"><h2 className="font-bold text-[#12304A]">No applications found</h2><p className="mt-2 text-sm text-slate-500">Make sure you used the same email address that you entered on your application.</p><Link href="/apply" className="mt-5 inline-block rounded-lg bg-[#005EA8] px-5 py-3 text-sm font-bold text-white">Start an application</Link></div>}
              {apps.map(app => (
                <article key={app.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b bg-[#F8FAFB] p-5">
                    <div><div className="text-[11px] font-bold uppercase tracking-wide text-[#005EA8]">Application ID</div><div className="mt-1 text-lg font-extrabold text-[#12304A]">{app.application_number}</div><div className="mt-1 text-xs text-slate-500">Submitted {new Date(app.created_at).toLocaleString()}</div></div>
                    <span className="rounded-full bg-[#EAF1F5] px-3 py-2 text-xs font-bold capitalize text-[#005EA8]">{statusLabel(app.status)}</span>
                  </div>
                  <div className="grid gap-4 p-5 md:grid-cols-[1fr_1.3fr]">
                    <div className="space-y-3">
                      <div className="rounded-lg bg-[#F4F7F9] p-4"><div className="text-[10px] font-bold uppercase text-slate-400">Applicant</div><div className="mt-1 text-sm font-semibold text-[#12304A]">{app.full_name}</div><div className="mt-1 text-xs text-slate-500">{app.email || email}</div></div>
                      <div className="rounded-lg bg-[#F4F7F9] p-4"><div className="text-[10px] font-bold uppercase text-slate-400">Location</div><div className="mt-1 text-sm text-[#12304A]">{app.city || '—'}</div></div>
                      <div className="rounded-lg border border-slate-200 p-4"><div className="flex items-center gap-2 text-sm font-bold text-[#12304A]"><MessageCircle size={16} className="text-[#005EA8]"/> Live chat for this application</div><p className="mt-2 text-xs leading-5 text-slate-500">Messages stay attached to application {app.application_number}.</p></div>
                    </div>
                    <ChatPanel applicationId={app.id} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
