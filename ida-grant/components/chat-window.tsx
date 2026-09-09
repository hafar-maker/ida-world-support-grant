'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Message = { id: string; message: string; sender_role: 'applicant' | 'agent' | 'admin'; created_at: string }

export function ChatWindow({ applicationId, applicationStatus }: { applicationId: string; applicationStatus?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = useMemo(() => createClient(), [])

  async function load() {
    const response = await fetch(`/api/chat/${applicationId}`, { cache: 'no-store' })
    const data = await response.json()
    if (!response.ok) { setError(data.error || 'Unable to load chat.'); return }
    setMessages(data.messages || [])
  }

  useEffect(() => {
    load()
    const channel = supabase.channel(`chat-${applicationId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, payload => {
        const row = payload.new as Message
        if (row?.id) load()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [applicationId, supabase])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    const value = text.trim()
    if (!value || sending) return
    setSending(true); setError('')
    const response = await fetch(`/api/chat/${applicationId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: value }) })
    const data = await response.json()
    if (!response.ok) setError(data.error || 'Unable to send message.')
    else { setText(''); await load() }
    setSending(false)
  }

  const approved = applicationStatus === 'approved'

  return <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    {approved && <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={22} />
        <div><div className="font-extrabold">Congratulations! Your application has been approved.</div><p className="mt-1 text-sm text-emerald-800">You can use this chat to speak with our Agent or Admin support team about your approved application and next steps.</p></div>
      </div>
    </div>}
    <div className="border-b bg-slate-50 px-4 py-3"><div className="text-sm font-extrabold text-[#12304A]">Applicant support chat</div><div className="text-xs text-slate-500">Agent or Admin support · one shared conversation</div></div>
    <div className="max-h-[420px] min-h-[220px] space-y-3 overflow-y-auto bg-[#f7fafc] p-4">
      {messages.map(m => { const applicant = m.sender_role === 'applicant'; return <div key={m.id} className={`flex ${applicant ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${applicant ? 'rounded-br-md bg-[#d9fdd3] text-slate-800' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'}`}><div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{applicant ? 'Applicant' : m.sender_role === 'admin' ? 'Admin' : 'Agent'}</div><div className="whitespace-pre-wrap break-words">{m.message}</div><div className="mt-1 text-right text-[10px] text-slate-400">{new Date(m.created_at).toLocaleString()}</div></div></div> })}
      {!messages.length && <div className="py-10 text-center text-xs text-slate-400">No messages yet. Our Agent or Admin can assist you here.</div>}
      <div ref={bottomRef} />
    </div>
    {error && <div className="border-t bg-red-50 px-4 py-2 text-xs text-red-700">{error}</div>}
    <div className="flex gap-2 border-t bg-white p-3"><input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Message Agent or Admin…" maxLength={5000} className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-[#005EA8]"/><button onClick={send} disabled={!text.trim() || sending} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#005EA8] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><Send size={15}/>{sending ? 'Sending' : 'Send'}</button></div>
  </div>
}
