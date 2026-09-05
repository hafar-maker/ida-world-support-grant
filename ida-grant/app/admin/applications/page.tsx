import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import { AdminApplicationActions } from '@/components/admin-application-actions'

export default async function AdminApplications(){
 const {supabase,user,profile}=await requireRole(['admin'])
 if(!user)redirect('/login?next=/admin/applications')
 if(!profile)redirect('/dashboard')
 const {data}=await supabase.from('applications').select('id,application_number,full_name,email,status,city,created_at,grants(title)').order('created_at',{ascending:false})
 return <main className="min-h-screen bg-[#F4F7F9] px-4 py-8"><div className="mx-auto max-w-6xl"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#005EA8]"><ArrowLeft size={16}/> Admin dashboard</Link><div className="mt-5 overflow-hidden rounded-xl border bg-white"><div className="border-b p-5"><h1 className="text-xl font-extrabold text-[#12304A]">All applications</h1><p className="mt-1 text-xs text-slate-500">Review, approve or decline each application.</p></div><div className="divide-y">{(data??[]).map((a:any)=><div key={a.id} className="grid gap-4 p-5 hover:bg-slate-50 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center"><Link href={`/admin/applications/${a.id}`} className="min-w-0"><div className="text-sm font-bold">{a.full_name}</div><div className="text-xs text-slate-400">{a.application_number}</div></Link><div className="text-xs text-slate-500">{a.email}</div><div><div className="text-xs text-slate-500">{a.grants?.title||'General support'}</div><div className="mt-2 w-fit rounded-full bg-[#EAF1F5] px-3 py-1 text-[11px] font-bold capitalize text-[#005EA8]">{a.status.replaceAll('_',' ')}</div></div><AdminApplicationActions id={a.id} status={a.status}/></div>)}{!data?.length&&<div className="p-8 text-sm text-slate-500">No applications yet.</div>}</div></div></div></main>
}
