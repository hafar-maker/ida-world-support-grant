'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ChatPanel } from '@/components/chat-panel'

function Detail({ label, value }: { label: string; value: unknown }) {
  return <div><div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-sm font-semibold text-[#12304A] break-words">{value === null || value === undefined || value === '' ? 'Not provided' : String(value)}</div></div>
}

export default function AgentApplicationPage({params}:{params:Promise<{id:string}>}){
 const [id,setId]=useState(''); const [app,setApp]=useState<any>(null); const [error,setError]=useState('')
 useEffect(()=>{params.then(p=>{setId(p.id);fetch(`/api/applications/${p.id}`,{cache:'no-store'}).then(async r=>{const d=await r.json();if(!r.ok){setError(d.error||'Unable to open applicant');return}setApp(d)})})},[params])
 if(error)return <main className="min-h-screen bg-[#F4F7F9] p-8"><div className="mx-auto max-w-5xl rounded-xl border bg-white p-6 text-sm text-red-700">{error}</div></main>
 if(!app)return <div className="p-10 text-sm">Loading applicant…</div>
 const grantTitle = app.grants?.title || 'Not provided'
 const submitted = app.created_at ? new Date(app.created_at).toLocaleString() : 'Not provided'
 const updated = app.updated_at ? new Date(app.updated_at).toLocaleString() : 'Not provided'
 return <main className="min-h-screen bg-[#F4F7F9] px-4 py-8"><div className="mx-auto max-w-6xl"><Link href="/agent" className="inline-flex items-center gap-2 text-sm font-bold text-[#005EA8]"><ArrowLeft size={16}/> Back to applicants</Link><div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-start"><section className="rounded-xl border bg-white shadow-sm"><div className="border-b bg-[#F8FAFB] px-6 py-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-[11px] font-bold uppercase tracking-wide text-[#005EA8]">Application ID</div><h1 className="mt-1 text-2xl font-extrabold text-[#12304A]">{app.application_number}</h1><p className="mt-1 text-xs text-slate-500">Applicant record and submitted application details</p></div><span className="rounded-full bg-[#EAF1F5] px-3 py-1.5 text-[11px] font-bold capitalize text-[#005EA8]">{String(app.status || 'submitted').replaceAll('_',' ')}</span></div></div><div className="p-6"><div className="rounded-lg border bg-[#F4F7F9] p-4"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Application details</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Detail label="Country / Region" value={app.country}/><Detail label="Grant / Program" value={grantTitle}/><Detail label="Application status" value={String(app.status || '').replaceAll('_',' ')}/><Detail label="Requested amount" value={app.requested_amount}/><Detail label="Date submitted" value={submitted}/><Detail label="Last updated" value={updated}/></div></div><div className="mt-5 rounded-lg border p-4"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Applicant information</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Detail label="Full name" value={app.full_name}/><Detail label="Email" value={app.email}/><Detail label="Phone" value={app.phone}/><Detail label="Date of birth" value={app.date_of_birth}/><Detail label="Age" value={app.age}/><Detail label="Occupation" value={app.occupation}/><Detail label="Monthly income" value={app.monthly_income}/><Detail label="ZIP / Postal code" value={app.postal_code}/><div className="sm:col-span-2"><Detail label="Full address" value={app.address}/></div><div className="sm:col-span-2"><Detail label="Reason for support" value={app.reason}/></div></div></div></div></section><section><div className="mb-2 text-sm font-extrabold text-[#12304A]">Live chat</div><ChatPanel applicationId={app.id} applicantName={app.full_name} staff /></section></div></div></main>
}
