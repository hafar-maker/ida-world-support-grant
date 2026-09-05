import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const allowed = ['submitted','under_review','more_information','approved','declined','support_processing']

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['applicant','agent','admin'].includes(profile.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase.from('applications').select('*, grants(title)').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  if (profile.role === 'applicant' && data.applicant_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  if (profile.role === 'agent') {
    return NextResponse.json({
      id: data.id,
      application_number: data.application_number,
      applicant_id: data.applicant_id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      country: data.applicant_id ? (await supabase.from('profiles').select('country').eq('id', data.applicant_id).maybeSingle()).data?.country : null,
    })
  }

  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  const body = await request.json()
  if (body.status && !allowed.includes(body.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  const patch: Record<string, unknown> = {}
  for (const key of ['status','agent_notes','assigned_agent_id','decision_reason']) if (key in body) patch[key] = body[key]
  const { data, error } = await supabase.from('applications').update(patch).eq('id', id).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  await supabase.from('audit_logs').insert({ actor_id: user.id, action: 'application_updated', application_id: id, metadata: patch })
  return NextResponse.json(data)
}
