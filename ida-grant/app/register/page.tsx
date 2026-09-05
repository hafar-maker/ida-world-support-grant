'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Country = { name: string; code: string; dial: string }

const countries: Country[] = [
  { name: 'United States', code: 'US', dial: '+1' },
  { name: 'Australia', code: 'AU', dial: '+61' },
  { name: 'Canada', code: 'CA', dial: '+1' },
  { name: 'Albania', code: 'AL', dial: '+355' },
  { name: 'Andorra', code: 'AD', dial: '+376' },
  { name: 'Austria', code: 'AT', dial: '+43' },
  { name: 'Belarus', code: 'BY', dial: '+375' },
  { name: 'Belgium', code: 'BE', dial: '+32' },
  { name: 'Bosnia and Herzegovina', code: 'BA', dial: '+387' },
  { name: 'Bulgaria', code: 'BG', dial: '+359' },
  { name: 'Croatia', code: 'HR', dial: '+385' },
  { name: 'Czechia', code: 'CZ', dial: '+420' },
  { name: 'Denmark', code: 'DK', dial: '+45' },
  { name: 'Estonia', code: 'EE', dial: '+372' },
  { name: 'Finland', code: 'FI', dial: '+358' },
  { name: 'France', code: 'FR', dial: '+33' },
  { name: 'Germany', code: 'DE', dial: '+49' },
  { name: 'Greece', code: 'GR', dial: '+30' },
  { name: 'Hungary', code: 'HU', dial: '+36' },
  { name: 'Iceland', code: 'IS', dial: '+354' },
  { name: 'Ireland', code: 'IE', dial: '+353' },
  { name: 'Italy', code: 'IT', dial: '+39' },
  { name: 'Latvia', code: 'LV', dial: '+371' },
  { name: 'Liechtenstein', code: 'LI', dial: '+423' },
  { name: 'Lithuania', code: 'LT', dial: '+370' },
  { name: 'Luxembourg', code: 'LU', dial: '+352' },
  { name: 'Malta', code: 'MT', dial: '+356' },
  { name: 'Moldova', code: 'MD', dial: '+373' },
  { name: 'Monaco', code: 'MC', dial: '+377' },
  { name: 'Montenegro', code: 'ME', dial: '+382' },
  { name: 'Netherlands', code: 'NL', dial: '+31' },
  { name: 'North Macedonia', code: 'MK', dial: '+389' },
  { name: 'Norway', code: 'NO', dial: '+47' },
  { name: 'Poland', code: 'PL', dial: '+48' },
  { name: 'Portugal', code: 'PT', dial: '+351' },
  { name: 'Romania', code: 'RO', dial: '+40' },
  { name: 'Russia', code: 'RU', dial: '+7' },
  { name: 'San Marino', code: 'SM', dial: '+378' },
  { name: 'Serbia', code: 'RS', dial: '+381' },
  { name: 'Slovakia', code: 'SK', dial: '+421' },
  { name: 'Slovenia', code: 'SI', dial: '+386' },
  { name: 'Spain', code: 'ES', dial: '+34' },
  { name: 'Sweden', code: 'SE', dial: '+46' },
  { name: 'Switzerland', code: 'CH', dial: '+41' },
  { name: 'Ukraine', code: 'UA', dial: '+380' },
  { name: 'United Kingdom', code: 'GB', dial: '+44' },
  { name: 'Vatican City', code: 'VA', dial: '+39' },
]

export default function RegisterPage() {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('US')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectedCountry = useMemo(() => countries.find((item) => item.code === country) ?? countries[0], [country])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 6 || digits.length > 15) {
      setError('Enter a valid phone number for the selected country.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, country: selectedCountry.name, country_code: selectedCountry.code, phone: `${selectedCountry.dial}${digits}` } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setDone(true)
    setLoading(false)
  }

  return <main className="min-h-screen bg-[#F4F7F9] px-4 py-12"><div className="mx-auto max-w-md"><Link href="/" className="text-sm font-bold text-[#005EA8]">← IDA World Support Grant</Link><div className="mt-8 rounded-2xl border border-[#D9E2E8] bg-white p-7 shadow-soft"><h1 className="text-2xl font-extrabold text-[#12304A]">Create applicant account</h1><p className="mt-2 text-sm text-slate-600">Registration is available only to applicants in the United States, Australia, Canada, and eligible European countries.</p>{done?<div className="mt-6 rounded-lg bg-[#EAF1F5] p-4 text-sm text-[#12304A]">Check your email to confirm your account, then <Link href="/login" className="font-bold text-[#005EA8]">sign in</Link>.</div>:<form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-semibold">Full name<input required value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" /></label><label className="block text-sm font-semibold">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" /></label><label className="block text-sm font-semibold">Country<select required value={country} onChange={e=>{setCountry(e.target.value);setPhone('')}} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm">{countries.map(item=><option key={item.code} value={item.code}>{item.name}</option>)}</select></label><label className="block text-sm font-semibold">Phone number<div className="mt-2 flex"><span className="flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-700">{selectedCountry.dial}</span><input required type="tel" inputMode="tel" autoComplete="tel-national" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" className="min-w-0 flex-1 rounded-r-lg border border-slate-300 px-3 py-3 text-sm" /></div><span className="mt-1 block text-xs font-normal text-slate-500">Country calling code is set automatically from your country.</span></label><label className="block text-sm font-semibold">Password<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" /></label>{error&&<div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}<button disabled={loading} className="w-full rounded-lg bg-[#005EA8] px-4 py-3 text-sm font-bold text-white">{loading?'Creating…':'Create account'}</button></form>}<p className="mt-5 text-xs text-slate-500">Already registered? <Link href="/login" className="font-bold text-[#005EA8]">Sign in</Link></p></div></div></main>
}
