import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/supabase/server'
import { StaffSignOut } from '@/components/staff-signout'
import { MessageCircle, Users } from 'lucide-react'

export default async function AgentPage() {
  const { supabase, user, profile } = await requireRole(['agent', 'admin'])
  if (!user) redirect('/login?next=/agent')
  if (!profile) redirect('/login?next=/agent&error=staff_access_required')

  const { data: applications, error } = await supabase.from('applications').select('id, application_number, applicant_id, full_name, email, phone, status, created_at').order('created_at', { ascending: false }).limit(100)
  const applicantIds = [...new Set((applications ?? []).map(a => a.applicant_id).filter(Boolean))]
  const { data: profiles } = applicantIds.length ? await supabase.from('profiles').select('id, country').in('id', applicantIds) : { data: [] as { id: string; country: string | null }[] }
  const countries = new Map((profiles ?? []).map(p => [p.id, p.country]))

  return <main className="min-h-screen bg-[#F4F7F9]"><header className="border-b bg-white"><div className="container-x flex min-h-20 items-center justify-between"><div><div className="text-xs font-bold text-[#005EA8]">APPLICANT SUPPORT</div><h1 className="text-xl font-extrabold text-[#12304A]">Agent workspace</h1></div><div className="flex items-center gap-4">{profile.role === 'admin' && <Link href="/admin" className="text-sm font-bold text-[#005EA8]">Admin</Link>}<StaffSignOut/></div></div></header><div className="container-x py-8"><div className="mb-6 rounded-xl border bg-white p-5"><div className="flex items-center gap-3"><Users className="text-[#005EA8]" size={20}/><div><h2 className="font-bold text-[#12304A]">Applicant list</h2><p className="mt-1 text-xs text-slate-500">Agents can view applicants and open live chat. Application review and decisions are handled by administrators.</p></div></div></div><section className="overflow-hidden rounded-xl border bg-white"><div className="border-b p-5"><h2 className="font-bold">Applicants</h2><p className="mt-1 text-xs text-slate-500">Every submitted application appears here.</p></div><div className="divide-y">{error && <div className="p-8 text-sm text-red-700">Unable to load applicants: {error.message}</div>}{(applications ?? []).map(a => <div key={a.id} className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center"><div><div className="text-sm font-bold text-[#12304A]">{a.full_name || 'Unnamed applicant'}</div><div className="text-xs text-slate-500">{a.email || 'No email'} · {a.phone || 'No phone'}</div></div><div className="text-xs text-slate-500">{countries.get(a.applicant_id) || 'Country not provided'}</div><div><div className="text-xs font-bold text-[#12304A]">{a.application_number}</div><div className="text-[11px] capitalize text-slate-500">{a.status.replaceAll('_', ' ')}</div></div><Link href={`/agent/applications/${a.id}`} className="inline-flex items-center justify-center gap-2 rounded-md bg-[#005EA8] px-3 py-2 text-[11px] font-bold text-white"><MessageCircle size={14}/> Chat</Link></div>)}{!error && !applications?.length && <div className="p-8 text-sm text-slate-500">No applicants yet.</div>}</div></section></div></main>
}
