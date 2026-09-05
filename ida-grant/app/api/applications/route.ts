import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // /apply is a public applicant flow. Do not reuse a staff session that
    // may be present in this browser, otherwise the database function sees
    // the staff profile and incorrectly rejects the submission.
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      console.error('Unable to reset applicant session:', signOutError)
      return NextResponse.json({ error: 'Unable to start the applicant session. Please try again.' }, { status: 400 })
    }

    const { error: anonymousError } = await supabase.auth.signInAnonymously()
    if (anonymousError) {
      console.error('Anonymous applicant session failed:', anonymousError)
      return NextResponse.json({ error: 'Unable to start the applicant session. Please try again.' }, { status: 400 })
    }

    const { data, error } = await supabase.rpc('submit_public_application', {
      p: body,
    })

    if (error) {
      console.error('Application submission failed:', error)
      return NextResponse.json({ error: error.message || 'Unable to submit application.' }, { status: 400 })
    }

    const application = Array.isArray(data) ? data[0] : data
    if (!application) {
      return NextResponse.json({ error: 'Unable to submit application.' }, { status: 500 })
    }

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Application submission request failed:', error)
    return NextResponse.json({ error: 'Unable to submit application. Please try again.' }, { status: 400 })
  }
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
