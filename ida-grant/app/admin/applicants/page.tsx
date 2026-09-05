import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/supabase/server'
import { ArrowLeft, Users } from 'lucide-react'

export default async function AdminApplicantsPage() {
  const { supabase, user, profile } = await requireRole(['admin'])
  if (!user) redirect('/login?next=/admin/applicants')
  if (!profile) redirect('/login?next=/admin/applicants&error=admin_access_required')

  const { data: applicants } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, country, created_at, applications(id, application_number, status, city, created_at)')
    .eq('role', 'applicant')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#F4F7F9] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#005EA8]"><ArrowLeft size={16}/> Admin dashboard</Link>
        <div className="mt-5 overflow-hidden rounded-xl border bg-white">
          <div className="border-b p-5">
            <div className="flex items-center gap-3"><Users size={20} className="text-[#005EA8]"/><h1 className="text-xl font-extrabold text-[#12304A]">Applicants</h1></div>
            <p className="mt-1 text-xs text-slate-500">View applicants and open their submissions for review.</p>
          </div>
          <div className="divide-y">
            {(applicants ?? []).map((a: any) => (
              <div key={a.id} className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
                <div><div className="text-sm font-bold text-[#12304A]">{a.full_name || 'Unnamed applicant'}</div><div className="text-xs text-slate-500">{a.email || 'No email'} · {a.phone || 'No phone'}</div></div>
                <div className="text-xs text-slate-500">{a.country || '—'}{a.applications?.[0]?.city ? ` · ${a.applications[0].city}` : ''}</div>
                <div className="text-xs text-slate-500">{a.applications?.length || 0} submission{a.applications?.length === 1 ? '' : 's'}</div>
                <div className="flex flex-wrap gap-2">{(a.applications ?? []).map((application: any) => <Link key={application.id} href={`/admin/applications/${application.id}`} className="rounded-md bg-[#EAF1F5] px-3 py-2 text-[11px] font-bold text-[#005EA8]">{application.application_number} · {application.status.replaceAll('_',' ')}</Link>)}</div>
              </div>
            ))}
            {!applicants?.length && <div className="p-8 text-sm text-slate-500">No applicants yet.</div>}
          </div>
        </div>
      </div>
    </main>
  )
}
