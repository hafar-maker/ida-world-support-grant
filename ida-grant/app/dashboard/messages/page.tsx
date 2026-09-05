import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard-shell'
import { ChatPanel } from '@/components/chat-panel'
import { createClient } from '@/lib/supabase/server'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard/messages')

  const { data: application } = await supabase
    .from('applications')
    .select('id, application_number, full_name')
    .eq('applicant_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <DashboardShell>
      <div className="p-5 lg:p-8">
        <Link href="/dashboard" className="text-xs font-bold text-[#005EA8]">← Dashboard</Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#12304A]">Messages</h1>
            <p className="mt-1 text-sm text-slate-500">Communicate directly with the grant team about your application.</p>
          </div>
          {application && <div className="text-xs font-bold text-[#005EA8]">{application.application_number}</div>}
        </div>
        <div className="mt-6 max-w-3xl">
          {application ? <ChatPanel applicationId={application.id} applicantName={application.full_name} /> : <div className="rounded-xl border bg-white p-8 text-sm text-slate-500">Submit an application to open your live chat.</div>}
        </div>
      </div>
    </DashboardShell>
  )
}
