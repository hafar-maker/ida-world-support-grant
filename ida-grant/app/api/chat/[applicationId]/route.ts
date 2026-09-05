import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = await params
  const supabase = await createClient()
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
  if (!message || message.length > 5000) return NextResponse.json({ error: 'Message must be between 1 and 5000 characters.' }, { status: 400 })

  const supabase = await createClient()
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
