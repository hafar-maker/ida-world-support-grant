import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

export async function POST(request: Request) {
  const body = await request.json()
  const email = String(body.email || '').trim().toLowerCase()
  const name = String(body.full_name || '').trim()

  if (!email || !name) {
    return NextResponse.json({ error: 'Full name and email are required.' }, { status: 400 })
  }

  const admin = createAdminClient()
  let applicantId: string | null = null

  const { data: existingProfile, error: profileLookupError } = await admin
    .from('profiles')
    .select('id, role')
    .eq('email', email)
    .maybeSingle()

  if (profileLookupError) {
    return NextResponse.json({ error: 'Unable to create applicant account.' }, { status: 500 })
  }

  if (existingProfile) {
    if (existingProfile.role !== 'applicant') {
      return NextResponse.json({ error: 'This email is reserved for staff access.' }, { status: 400 })
    }
    applicantId = existingProfile.id
  } else {
    const generatedPassword = `${crypto.randomUUID()}-${crypto.randomUUID()}`
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        country: body.country || null,
        country_code: body.country_code || null,
        phone: body.phone || null,
      },
    })

    if (createError || !created.user) {
      return NextResponse.json({ error: createError?.message || 'Unable to create applicant account.' }, { status: 400 })
    }
    applicantId = created.user.id

    const { error: profileError } = await admin.from('profiles').upsert({
      id: applicantId,
      email,
      full_name: name,
      role: 'applicant',
      country: body.country || null,
      country_code: body.country_code || null,
      phone: body.phone || null,
    })

    if (profileError) {
      await admin.auth.admin.deleteUser(applicantId)
      return NextResponse.json({ error: 'Unable to create applicant account.' }, { status: 500 })
    }
  }

  const { data, error } = await admin.from('applications').insert({
    applicant_id: applicantId,
    full_name: body.full_name,
    address: body.address,
    age: body.age ? Number(body.age) : null,
    city: body.city,
    state: body.state,
    postal_code: body.postal_code,
    status: body.status,
    email,
    phone: body.phone,
    date_of_birth: body.date_of_birth || null,
    occupation: body.occupation,
    monthly_income: body.monthly_income ? Number(body.monthly_income) : null,
    reason: body.reason,
    grant_id: body.grant_id || null,
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
