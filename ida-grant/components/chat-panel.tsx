'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Bell, BellOff, Check, MessageCircle, Send } from 'lucide-react'
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
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) setNotificationPermission('unsupported')
    else setNotificationPermission(Notification.permission)
  }, [])

  async function enableNotifications() {
    if (typeof window === 'undefined' || !('Notification' in window)) return setNotificationPermission('unsupported')
    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      if (permission === 'granted') new Notification('Live chat notifications enabled', { body: 'You will be notified when a new chat message arrives.' })
    } catch { setError('Your browser could not enable notifications.') }
  }

  function notifyIncomingMessage(message: ChatMessage) {
    if (message.sender_id === userId || notificationPermission !== 'granted') return
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') return
    if (typeof window === 'undefined' || !('Notification' in window)) return
    new Notification(staff ? `New message from ${applicantName || 'applicant'}` : 'New message from the grant team', { body: message.message, tag: `chat-${threadId}` })
  }

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
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to open chat.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [applicationId])

  useEffect(() => {
    if (!threadId) return
    const channel = supabase.channel(`chat:${threadId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `thread_id=eq.${threadId}` }, payload => {
        const next = payload.new as ChatMessage
        setMessages(current => current.some(m => m.id === next.id) ? current : [...current, next])
        notifyIncomingMessage(next)
      }).subscribe()
    const timer = window.setInterval(() => load(), 3000)
    return () => { window.clearInterval(timer); supabase.removeChannel(channel) }
  }, [threadId, applicationId, userId, notificationPermission, staff, applicantName])

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
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to send message.') }
    finally { setSending(false) }
  }

  const notificationButton = notificationPermission === 'granted'
    ? <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><Bell size={13}/> Notifications on</span>
    : notificationPermission === 'unsupported' ? null
    : <button type="button" onClick={enableNotifications} className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-[#B8C9D4] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#005EA8] hover:bg-[#EAF1F5]"><BellOff size={13}/> Enable notifications</button>

  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b bg-white px-5 py-4">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-[#EAF1F5] text-[#005EA8] font-extrabold">{(applicantName || (staff ? 'A' : 'G')).slice(0,1).toUpperCase()}</div>
      <div><h2 className="text-sm font-extrabold text-[#12304A]">{staff ? applicantName || 'Applicant' : 'Grant Support Team'}</h2><p className="text-xs text-slate-500">{staff ? 'Applicant conversation' : 'Agent support · Online'}</p></div>
      {notificationButton}<span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Live</span>
    </div>

    <div className="h-[460px] overflow-y-auto bg-[#EAF1F5] px-4 py-5 sm:px-6">
      {loading ? <div className="py-12 text-center text-sm text-slate-500">Opening chat…</div> : messages.length ? messages.map((m, index) => {
        const mine = m.sender_id === userId
        const isAgentMessage = m.sender_role === 'agent' || m.sender_role === 'admin'
        const agentOnLeft = staff ? isAgentMessage : !isAgentMessage
        const alignLeft = agentOnLeft
        const label = isAgentMessage ? 'Agent' : 'Applicant'
        return <div key={m.id} className={`mb-3 flex w-full ${alignLeft ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[78%] sm:max-w-[68%] ${alignLeft ? 'items-start' : 'items-end'} flex flex-col`}>
            <div className={`mb-1 px-1 text-[10px] font-bold uppercase tracking-wide ${alignLeft ? 'text-[#005EA8]' : 'text-slate-500'}`}>{label}</div>
            <div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${alignLeft ? 'rounded-tl-sm border border-slate-200 bg-white text-[#12304A]' : 'rounded-tr-sm bg-[#D9FDD3] text-[#12304A]'}`}>
              <p className="whitespace-pre-wrap break-words">{m.message}</p>
              <div className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${alignLeft ? 'text-slate-400' : 'text-slate-500'}`}>
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {!alignLeft && mine && <Check size={12} className="text-[#005EA8]" />}
              </div>
            </div>
          </div>
        </div>
      }) : <div className="py-12 text-center text-sm text-slate-500">No messages yet. Start the conversation below.</div>}
      <div ref={bottomRef}/>
    </div>

    <form onSubmit={send} className="flex items-center gap-2 border-t bg-[#F8FAFB] p-3">
      <input value={text} onChange={e=>setText(e.target.value)} maxLength={5000} placeholder={staff ? 'Reply to applicant…' : 'Message your agent…'} className="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#005EA8] focus:ring-2 focus:ring-[#005EA8]/10"/>
      <button disabled={!text.trim()||sending||loading} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#005EA8] text-white disabled:opacity-50" aria-label="Send message"><Send size={17}/></button>
    </form>
    {error&&<div className="border-t bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}
  </section>
}
