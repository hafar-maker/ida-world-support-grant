import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('applications')
    .select('id, application_number, full_name, email, status, created_at, updated_at')
    .ilike('email', email)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Unable to look up applications.' }, { status: 400 })
  return NextResponse.json({ applications: data ?? [] })
}
