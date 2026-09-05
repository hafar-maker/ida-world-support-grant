'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

export function AdminApplicationActions({ id, status, onUpdated }: { id: string; status: string; onUpdated?: (status: string) => void }) {
  const [loading, setLoading] = useState(false)

  async function update(nextStatus: 'approved' | 'declined') {
    if (loading || status === nextStatus) return
    setLoading(true)
    const response = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    })
    if (response.ok) onUpdated?.(nextStatus)
    setLoading(false)
  }

  return <div className="flex flex-wrap gap-2">
    <button type="button" disabled={loading || status === 'approved'} onClick={() => update('approved')} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-[11px] font-bold text-white disabled:opacity-50"><CheckCircle2 size={13}/> Approve</button>
    <button type="button" disabled={loading || status === 'declined'} onClick={() => update('declined')} className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-2 text-[11px] font-bold text-white disabled:opacity-50"><XCircle size={13}/> Decline</button>
  </div>
}
