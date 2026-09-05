import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const body = await request.json()
  const { data, error } = await supabase.from('applications').insert({
    applicant_id: user.id,
    full_name: body.full_name, address: body.address, age: body.age ? Number(body.age) : null,
    city: body.city, state: body.state, postal_code: body.postal_code, status: body.status,
    email: body.email || user.email, phone: body.phone, date_of_birth: body.date_of_birth || null,
    occupation: body.occupation, monthly_income: body.monthly_income ? Number(body.monthly_income) : null,
    reason: body.reason, grant_id: body.grant_id || null,
  }).select('id, application_number, status').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const query = supabase.from('applications').select('*, grants(title)').order('created_at', { ascending: false })
  const { data, error } = profile?.role === 'applicant' ? await query.eq('applicant_id', user.id) : await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
