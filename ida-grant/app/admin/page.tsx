import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/supabase/server'
import { StaffSignOut } from '@/components/staff-signout'
import { ShieldCheck, Users, FileText, Banknote, ArrowRight, type LucideIcon } from 'lucide-react'

export default async function AdminPage() {
  const { supabase, user, profile } = await requireRole(['admin'])
  if (!user) redirect('/login?next=/admin')
  if (!profile) redirect('/login?next=/admin&error=admin_access_required')

  const [{ count: applications }, { count: users }, { count: grants }, { count: approved }] = await Promise.all([
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('grants').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
  ])

  const stats: Array<{ label: string; value: number | null; Icon: LucideIcon }> = [
    { label: 'Applications', value: applications, Icon: FileText },
    { label: 'Users', value: users, Icon: Users },
    { label: 'Open grants', value: grants, Icon: ShieldCheck },
    { label: 'Approved', value: approved, Icon: Banknote },
  ]

  return <main className="min-h-screen bg-[#F4F7F9]"><header className="border-b bg-white"><div className="container-x flex min-h-20 items-center justify-between"><div><div className="text-xs font-bold text-[#005EA8]">ADMINISTRATION</div><h1 className="text-xl font-extrabold text-[#12304A]">Grant Operations</h1></div><div className="flex items-center gap-3"><Link href="/agent" className="text-sm font-bold text-[#005EA8]">Agent view</Link><Link href="/dashboard" className="text-sm font-bold text-[#005EA8]">Applicant view</Link><StaffSignOut/></div></div></header><div className="container-x py-8"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(({label,value,Icon})=><div className="rounded-xl border bg-white p-5" key={label}><Icon className="text-[#005EA8]" size={20}/><div className="mt-5 text-2xl font-extrabold text-[#12304A]">{value ?? 0}</div><div className="text-xs text-slate-500">{label}</div></div>)}</div><div className="mt-7 grid gap-4 md:grid-cols-3"><Link href="/admin/applications" className="rounded-xl border bg-white p-6 hover:border-[#005EA8]"><h2 className="font-bold">Review applications</h2><p className="mt-2 text-sm text-slate-500">Search, assign, update decisions and audit changes.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#005EA8]">Open queue <ArrowRight size={15}/></span></Link><Link href="/admin/awards" className="rounded-xl border bg-white p-6 hover:border-[#005EA8]"><h2 className="font-bold">Publish awards</h2><p className="mt-2 text-sm text-slate-500">Publish verified award notices used by the public popup.</p></Link><Link href="/admin/grants" className="rounded-xl border bg-white p-6 hover:border-[#005EA8]"><h2 className="font-bold">Create grant opportunity</h2><p className="mt-2 text-sm text-slate-500">Create and publish grant programs visible to applicants on Find a Grant.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#005EA8]">Manage opportunities <ArrowRight size={15}/></span></Link></div></div></main>
}
