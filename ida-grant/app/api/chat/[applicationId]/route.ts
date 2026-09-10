import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request, { params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = await params
  const url = new URL(request.url)
  const applicantEmail = url.searchParams.get('applicantEmail')?.trim() || ''
  const supabase = await createClient()

  // Applicant tracking chat uses the verified email entered on the tracking page.
  // This keeps an existing Agent/Admin browser session from accidentally becoming the applicant.
  if (applicantEmail) {
    const { data, error } = await supabase.rpc('get_public_chat', {
      p_application_id: applicationId,
      p_email: applicantEmail,
    })
    if (error) return NextResponse.json({ error: error.message || 'Unable to open chat.' }, { status: 400 })
    const rows = (data || []) as Array<{ thread_id: string; user_id: string; role: string; id: string; message: string; sender_id: string | null; sender_role: string; created_at: string }>
    return NextResponse.json({
      thread_id: rows[0]?.thread_id || null,
      messages: rows.map(({ id, message, sender_id, sender_role, created_at }) => ({ id, message, sender_id, sender_role, created_at })),
      user_id: rows[0]?.user_id || null,
      role: 'applicant',
    })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || !['applicant', 'agent', 'admin'].includes(profile.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: application, error: applicationError } = await supabase.from('applications').select('id, applicant_id').eq('id', applicationId).maybeSingle()
  if (applicationError || !application) return NextResponse.json({ error: 'Application not found.' }, { status: 404 })
  if (profile.role === 'applicant' && application.applicant_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let { data: thread, error: threadError } = await supabase.from('chat_threads').select('id').eq('application_id', applicationId).maybeSingle()
  if (threadError) return NextResponse.json({ error: threadError.message }, { status: 400 })
  if (!thread) {
    const { data: created, error: createError } = await supabase.from('chat_threads').insert({ applicant_id: application.applicant_id, application_id: applicationId }).select('id').single()
    if (createError) {
      const { data: existing } = await supabase.from('chat_threads').select('id').eq('application_id', applicationId).maybeSingle()
      if (!existing) return NextResponse.json({ error: createError.message }, { status: 400 })
      thread = existing
    } else thread = created
  }

  const { data: messages, error: messageError } = await supabase.from('chat_messages').select('id, message, sender_id, sender_role, created_at').eq('thread_id', thread.id).order('created_at', { ascending: true })
  if (messageError) return NextResponse.json({ error: messageError.message }, { status: 400 })
  return NextResponse.json({ thread_id: thread.id, messages: messages ?? [], user_id: user.id, role: profile.role })
}

export async function POST(request: Request, { params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = await params
  const body = await request.json().catch(() => ({}))
  const message = String(body.message || '').trim()
  const applicantEmail = String(body.applicantEmail || '').trim()

  if (!message || message.length > 5000) return NextResponse.json({ error: 'Message must be between 1 and 5000 characters.' }, { status: 400 })

  const supabase = await createClient()

  // Applicant tracking chat always writes the message as the application's applicant,
  // even if the same browser currently has a staff session.
  if (applicantEmail) {
    const { data, error } = await supabase.rpc('send_public_chat', {
      p_application_id: applicationId,
      p_email: applicantEmail,
      p_message: message,
    })
    if (error) return NextResponse.json({ error: error.message || 'Unable to send message.' }, { status: 400 })
    const createdMessage = Array.isArray(data) ? data[0] : data
    return NextResponse.json(createdMessage, { status: 201 })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || !['applicant', 'agent', 'admin'].includes(profile.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: application } = await supabase.from('applications').select('id, applicant_id').eq('id', applicationId).maybeSingle()
  if (!application) return NextResponse.json({ error: 'Application not found.' }, { status: 404 })
  if (profile.role === 'applicant' && application.applicant_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let { data: thread } = await supabase.from('chat_threads').select('id').eq('application_id', applicationId).maybeSingle()
  if (!thread) {
    const { data: created, error: createError } = await supabase.from('chat_threads').insert({ applicant_id: application.applicant_id, application_id: applicationId }).select('id').single()
    if (createError) return NextResponse.json({ error: createError.message }, { status: 400 })
    thread = created
  }

  const { data: createdMessage, error } = await supabase.from('chat_messages').insert({ thread_id: thread.id, sender_id: user.id, sender_role: profile.role, message }).select('id, message, sender_id, sender_role, created_at').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(createdMessage, { status: 201 })
}
