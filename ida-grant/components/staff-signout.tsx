'use client'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function StaffSignOut(){
  async function signOut(){
    await createClient().auth.signOut()
    window.location.href='/login'
  }
  return <button onClick={signOut} className="inline-flex items-center gap-2 rounded-md border border-[#d9e2e8] px-3 py-2 text-xs font-bold text-[#27465a] hover:bg-[#f4f7f9]"><LogOut size={14}/> Sign out</button>
}
