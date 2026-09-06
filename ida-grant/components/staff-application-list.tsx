'use client'

import Link from 'next/link'
import { Search, MessageCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

type Application = {
  id: string
  application_number: string | null
  full_name?: string | null
  email?: string | null
  phone?: string | null
  status?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
}

export function StaffApplicationList({ applications, hrefPrefix }: { applications: Application[]; hrefPrefix: '/admin/applications' | '/agent/applications' }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return applications
    return applications.filter((a) => [a.application_number, a.full_name, a.email, a.phone, a.status, a.country, a.city, a.state].some((value) => String(value ?? '').toLowerCase().includes(q)))
  }, [applications, query])

  return <>
    <div className="border-b p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#12304A]">Applicants</h2>
          <p className="mt-1 text-xs text-slate-500">Search by application number, applicant name, email, phone, status, or location.</p>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search applications…" aria-label="Search applications" className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#005EA8] focus:ring-2 focus:ring-[#005EA8]/20" />
        </div>
      </div>
    </div>
    <div className="divide-y">
      {filtered.map((a) => <div key={a.id} className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
        <div><div className="text-sm font-bold text-[#12304A]">{a.full_name || 'Unnamed applicant'}</div><div className="text-xs text-slate-500">{a.email || 'No email'} · {a.phone || 'No phone'}</div></div>
        <div className="text-xs text-slate-500">{a.country || 'Country not provided'}{a.city ? ` · ${a.city}` : ''}{a.state ? `, ${a.state}` : ''}</div>
        <div><div className="text-xs font-bold text-[#12304A]">{a.application_number || 'No application number'}</div><div className="text-[11px] capitalize text-slate-500">{String(a.status || 'unknown').replaceAll('_', ' ')}</div></div>
        <Link href={`${hrefPrefix}/${a.id}`} className="inline-flex items-center justify-center gap-2 rounded-md bg-[#005EA8] px-3 py-2 text-[11px] font-bold text-white"><MessageCircle size={14} /> {hrefPrefix.startsWith('/agent') ? 'Chat' : 'Review'}</Link>
      </div>)}
      {!filtered.length && <div className="p-8 text-sm text-slate-500">{applications.length ? 'No applications match your search.' : 'No applications found.'}</div>}
    </div>
  </>
}
