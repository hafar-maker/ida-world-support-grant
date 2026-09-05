'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ChatMessage = { id: string; message: string; sender_id: string | null; sender_role: 'applicant' | 'agent' | 'admin'; created_at: string }

export function ChatPanel({ applicationId, applicantName, staff = false }: { applicationId?: string; applicantName?: string; staff?: boolean }) {
  const supabase = createClient()
  const [threadId, setThreadId] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState<'applicant' | 'agent' | 'admin'>('applicant')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  async function load() {
    if (!applicationId) { setError('No application is available for chat yet.'); setLoading(false); return }
    try {
      const response = await fetch(`/api/chat/${applicationId}`, { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to open chat.')
      setThreadId(data.thread_id)
      setUserId(data.user_id)
      if (data.role === 'agent' || data.role === 'admin' || data.role === 'applicant') setRole(data.role)
      setMessages((data.messages || []) as ChatMessage[])
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to open chat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [applicationId])

  useEffect(() => {
    if (!threadId) return
    const channel = supabase.channel(`chat:${threadId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `thread_id=eq.${threadId}` }, payload => {
        const next = payload.new as ChatMessage
        setMessages(current => current.some(m => m.id === next.id) ? current : [...current, next])
      })
      .subscribe()
    const timer = window.setInterval(() => { load() }, 3000)
    return () => { window.clearInterval(timer); supabase.removeChannel(channel) }
  }, [threadId, applicationId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  async function send(event: FormEvent) {
    event.preventDefault()
    const message = text.trim()
    if (!message || !applicationId || sending) return
    setSending(true); setError('')
    try {
      const response = await fetch(`/api/chat/${applicationId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to send message.')
      setMessages(current => current.some(m => m.id === data.id) ? current : [...current, data as ChatMessage])
      setText('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to send message.')
    } finally {
      setSending(false)
    }
  }

  return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b bg-[#F8FAFB] px-5 py-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#EAF1F5] text-[#005EA8]"><MessageCircle size={19}/></div><div><h2 className="text-sm font-extrabold text-[#12304A]">Live chat</h2><p className="text-xs text-slate-500">{staff ? `Conversation with ${applicantName || 'applicant'}` : 'Chat with the grant team'}</p></div><span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Live</span></div><div className="h-[360px] overflow-y-auto bg-[#F4F7F9] p-4 sm:p-5">{loading ? <div className="py-12 text-center text-sm text-slate-500">Opening chat…</div> : messages.length ? messages.map(m => { const mine=m.sender_id===userId; return <div key={m.id} className={`mb-3 flex ${mine?'justify-end':'justify-start'}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${mine?'rounded-br-md bg-[#005EA8] text-white':'rounded-bl-md border border-slate-200 bg-white text-[#12304A]'}`}><p>{m.message}</p><div className={`mt-1 text-[10px] ${mine?'text-blue-100':'text-slate-400'}`}>{new Date(m.created_at).toLocaleString()}</div></div></div> }) : <div className="py-12 text-center text-sm text-slate-500">No messages yet. Your conversation will appear here.</div>}<div ref={bottomRef}/></div><form onSubmit={send} className="flex gap-2 border-t bg-white p-3"><input value={text} onChange={e=>setText(e.target.value)} maxLength={5000} placeholder="Type your message…" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#005EA8]"/><button disabled={!text.trim()||sending||loading} className="inline-flex items-center gap-2 rounded-lg bg-[#005EA8] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Send size={16}/>{sending ? 'Sending…' : 'Send'}</button></form>{error&&<div className="border-t bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}</section>
}
