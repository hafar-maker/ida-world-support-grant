import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('applications')
    .select('id, application_number, applicant_id, full_name, email, phone, address, age, city, state, postal_code, status, date_of_birth, occupation, monthly_income, reason, requested_amount, created_at, updated_at, grant_id, grants(title)')
    .ilike('email', email)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Unable to look up applications.' }, { status: 400 })
  const applicantIds = [...new Set((data ?? []).map(app => app.applicant_id).filter(Boolean))]
  const { data: profiles } = applicantIds.length
    ? await supabase.from('profiles').select('id, country').in('id', applicantIds)
    : { data: [] as { id: string; country: string | null }[] }
  const countries = new Map((profiles ?? []).map(p => [p.id, p.country]))

  return NextResponse.json({ applications: (data ?? []).map(app => ({ ...app, country: countries.get(app.applicant_id) || null })) })
}
