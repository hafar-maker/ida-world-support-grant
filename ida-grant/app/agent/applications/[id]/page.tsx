'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ChatPanel } from '@/components/chat-panel'

export default function AgentApplicationPage({params}:{params:Promise<{id:string}>}){
 const [id,setId]=useState(''); const [app,setApp]=useState<any>(null); const [error,setError]=useState('')
 useEffect(()=>{params.then(p=>{setId(p.id);fetch(`/api/applications/${p.id}`).then(async r=>{const d=await r.json();if(!r.ok){setError(d.error||'Unable to open applicant');return}setApp(d)})})},[params])
 if(error)return <main className="min-h-screen bg-[#F4F7F9] p-8"><div className="mx-auto max-w-3xl rounded-xl border bg-white p-6 text-sm text-red-700">{error}</div></main>
 if(!app)return <div className="p-10 text-sm">Loading applicant…</div>
 return <main className="min-h-screen bg-[#F4F7F9] px-4 py-8"><div className="mx-auto max-w-4xl"><Link href="/agent" className="inline-flex items-center gap-2 text-sm font-bold text-[#005EA8]"><ArrowLeft size={16}/> Back to applicants</Link><div className="mt-5 rounded-xl border bg-white p-6"><div><div className="text-xs font-bold text-[#005EA8]">{app.application_number}</div><h1 className="mt-1 text-2xl font-extrabold text-[#12304A]">{app.full_name}</h1><p className="mt-1 text-sm text-slate-500">{app.email||'No email'} · {app.phone||'No phone'}</p></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-lg bg-[#F4F7F9] p-4"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Country</div><div className="mt-1 text-sm text-[#12304A]">{app.country||'—'}</div></div><div className="rounded-lg bg-[#F4F7F9] p-4"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Application</div><div className="mt-1 text-sm text-[#12304A]">{app.application_number}</div></div></div><div className="mt-7"><ChatPanel applicationId={app.id} applicantName={app.full_name} staff /></div></div></div></main>
}
