'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, RefreshCw, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminApplicantsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('applications').select('id, application_number, full_name, email, phone, status, city, state, country, created_at, applicant_id').order('created_at', { ascending: false })
    setApplications(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase.channel('admin-applications-audit')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  return <main className="min-h-screen bg-[#F4F7F9] px-4 py-8"><div className="mx-auto max-w-6xl">
    <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#005EA8]"><ArrowLeft size={16}/> Admin dashboard</Link><button onClick={load} className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-xs font-bold text-[#005EA8]"><RefreshCw size={14}/> Refresh</button></div>
    <div className="mt-5 overflow-hidden rounded-xl border bg-white"><div className="border-b p-5"><div className="flex items-center gap-3"><Users size={20} className="text-[#005EA8]"/><h1 className="text-xl font-extrabold text-[#12304A]">Applicants & submissions</h1></div><p className="mt-1 text-xs text-slate-500">Live audit view. New submissions and status changes appear automatically.</p></div>
      <div className="divide-y">{applications.map(a=><div key={a.id} className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center"><div><div className="text-sm font-bold text-[#12304A]">{a.full_name || 'Unnamed applicant'}</div><div className="text-xs text-slate-500">{a.email || 'No email'} · {a.phone || 'No phone'}</div></div><div className="text-xs text-slate-500">{a.country || '—'} · {a.city || '—'}{a.state ? `, ${a.state}` : ''}</div><div><div className="text-xs font-bold text-[#12304A]">{a.application_number}</div><div className="text-[11px] capitalize text-slate-500">{a.status.replaceAll('_',' ')}</div></div><Link href={`/admin/applications/${a.id}`} className="rounded-md bg-[#EAF1F5] px-3 py-2 text-center text-[11px] font-bold text-[#005EA8]">Review</Link></div>)}{!applications.length&&!loading&&<div className="p-8 text-sm text-slate-500">No applications found.</div>}{loading&&<div className="p-8 text-sm text-slate-500">Loading applications…</div>}</div>
    </div>
  </div></main>
}
