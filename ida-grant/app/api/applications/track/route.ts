import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = String(body.email || '').trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_public_applications', {
      p_email: email,
    })

    if (error) {
      console.error('Application tracking lookup failed:', error)
      return NextResponse.json({ error: 'Unable to look up applications.' }, { status: 400 })
    }

    const applications = (data ?? []).map((app: Record<string, unknown>) => ({
      ...app,
      grants: app.grant_title ? { title: app.grant_title } : null,
    }))

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Application tracking request failed:', error)
    return NextResponse.json({ error: 'Unable to look up applications.' }, { status: 400 })
  }
}
