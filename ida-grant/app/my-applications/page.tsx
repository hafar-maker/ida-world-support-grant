'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { Mail, MessageCircle, Search } from 'lucide-react'
import { ChatPanel } from '@/components/chat-panel'
import { SiteHeader } from '@/components/site-header'

type Application = { id: string; application_number: string; status: string; full_name: string; email: string | null; city: string | null; created_at: string }

export default function MyApplicationsPage() {
  const [email, setEmail] = useState('')
  const [apps, setApps] = useState<Application[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function search(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError(''); setSearched(false)
    try {
      const response = await fetch('/api/applications/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim() }), cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to find applications.')
      setApps((data.applications || []) as Application[]); setSearched(true)
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to find applications.') }
    finally { setLoading(false) }
  }

  return <><SiteHeader/><main className="min-h-screen bg-[#F4F7F9] px-4 py-10"><div className="mx-auto max-w-5xl"><div className="rounded-xl border bg-white p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-[#005EA8]">Applicants</p><h1 className="mt-2 text-2xl font-extrabold text-[#12304A]">My Applications</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Enter the email address used on your application to see your submission status. There is no OTP and no password.</p><form onSubmit={search} autoComplete="off" className="mt-6 flex flex-col gap-3 sm:flex-row"><div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-300 px-3"><Mail size={17} className="text-slate-400"/><input required type="email" name="application-tracking-email" id="application-tracking-email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="you@example.com" className="w-full border-0 px-1 py-3 text-sm outline-none"/></div><button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#005EA8] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><Search size={16}/>{loading?'Searching…':'Track applications'}</button></form>{error&&<div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
{searched && <div className="mt-7 space-y-5">{apps.map(app=><article key={app.id} className="overflow-hidden rounded-xl border border-slate-200"><div className="flex flex-wrap items-start justify-between gap-4 border-b bg-[#F8FAFB] p-5"><div><div className="text-[11px] font-bold uppercase tracking-wide text-[#005EA8]">Application ID</div><div className="mt-1 text-lg font-extrabold text-[#12304A]">{app.application_number}</div><div className="mt-1 text-xs text-slate-500">Submitted {new Date(app.created_at).toLocaleString()}</div></div><span className="rounded-full bg-[#EAF1F5] px-3 py-2 text-xs font-bold capitalize text-[#005EA8]">{app.status.replaceAll('_',' ')}</span></div><div className="grid gap-5 p-5 md:grid-cols-[1fr_1.3fr]"><div><div className="rounded-lg bg-[#F4F7F9] p-4"><div className="text-[10px] font-bold uppercase text-slate-400">Applicant</div><div className="mt-1 text-sm font-semibold text-[#12304A]">{app.full_name}</div><div className="mt-1 text-xs text-slate-500">{app.email || email}</div><div className="mt-1 text-xs text-slate-500">{app.city || '—'}</div></div><Link href={`/application/${app.id}`} className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#005EA8] px-3 py-2 text-xs font-bold text-[#005EA8]"><MessageCircle size={14}/> Open application</Link></div><div><div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#12304A]"><MessageCircle size={16} className="text-[#005EA8]"/> Live chat</div><ChatPanel applicationId={app.id}/></div></div></article>)}{!apps.length&&<div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No applications were found for this email address.</div>}</div>}</div></div></main></>
}
