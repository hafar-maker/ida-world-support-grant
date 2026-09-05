import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/supabase/server'
import { StaffSignOut } from '@/components/staff-signout'
import { MessageCircle, Users } from 'lucide-react'

export default async function AgentPage() {
  const { supabase, user, profile } = await requireRole(['agent','admin'])
  if (!user) redirect('/login?next=/agent')
  if (!profile) redirect('/login?next=/agent&error=staff_access_required')

  const { data: applicants } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, country, applications(id, application_number, created_at)')
    .eq('role', 'applicant')
    .order('created_at', { ascending: false })
    .limit(100)

  return <main className="min-h-screen bg-[#F4F7F9]"><header className="border-b bg-white"><div className="container-x flex min-h-20 items-center justify-between"><div><div className="text-xs font-bold text-[#005EA8]">APPLICANT SUPPORT</div><h1 className="text-xl font-extrabold text-[#12304A]">Agent workspace</h1></div><div className="flex items-center gap-4">{profile.role==='admin'&&<Link href="/admin" className="text-sm font-bold text-[#005EA8]">Admin</Link>}<StaffSignOut/></div></div></header><div className="container-x py-8"><div className="mb-6 rounded-xl border bg-white p-5"><div className="flex items-center gap-3"><Users className="text-[#005EA8]" size={20}/><div><h2 className="font-bold text-[#12304A]">Applicant list</h2><p className="mt-1 text-xs text-slate-500">Agents can view the applicant list and open a live chat. Application review and decisions are handled by administrators.</p></div></div></div><section className="overflow-hidden rounded-xl border bg-white"><div className="border-b p-5"><h2 className="font-bold">Applicants</h2><p className="mt-1 text-xs text-slate-500">Select a submission to open its live chat.</p></div><div className="divide-y">{(applicants??[]).map((a:any)=><div key={a.id} className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_auto] md:items-center"><div><div className="text-sm font-bold text-[#12304A]">{a.full_name||'Unnamed applicant'}</div><div className="text-xs text-slate-500">{a.email||'No email'} · {a.phone||'No phone'}</div><div className="mt-1 text-xs text-slate-400">{a.country||'Country not provided'} · {a.applications?.length||0} submission{a.applications?.length===1?'':'s'}</div></div><div className="text-xs text-slate-500">{(a.applications??[]).map((application:any)=><div key={application.id}>{application.application_number} · {new Date(application.created_at).toLocaleDateString()}</div>)}</div><div className="flex flex-wrap gap-2">{(a.applications??[]).map((application:any)=><Link key={application.id} href={`/agent/applications/${application.id}`} className="inline-flex items-center gap-2 rounded-md bg-[#005EA8] px-3 py-2 text-[11px] font-bold text-white"><MessageCircle size={14}/> Chat</Link>)}</div></div>)}{!(applicants?.length)&&<div className="p-8 text-sm text-slate-500">No applicants yet.</div>}</div></section></div></main>
}
