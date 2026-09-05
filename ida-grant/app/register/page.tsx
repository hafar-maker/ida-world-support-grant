'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const countries = [
  ['United States', '+1'], ['Australia', '+61'], ['Canada', '+1'],
  ['Albania', '+355'], ['Andorra', '+376'], ['Austria', '+43'], ['Belarus', '+375'], ['Belgium', '+32'],
  ['Bosnia and Herzegovina', '+387'], ['Bulgaria', '+359'], ['Croatia', '+385'], ['Czechia', '+420'],
  ['Denmark', '+45'], ['Estonia', '+372'], ['Finland', '+358'], ['France', '+33'], ['Germany', '+49'],
  ['Greece', '+30'], ['Hungary', '+36'], ['Iceland', '+354'], ['Ireland', '+353'], ['Italy', '+39'],
  ['Latvia', '+371'], ['Liechtenstein', '+423'], ['Lithuania', '+370'], ['Luxembourg', '+352'], ['Malta', '+356'],
  ['Moldova', '+373'], ['Monaco', '+377'], ['Montenegro', '+382'], ['Netherlands', '+31'], ['North Macedonia', '+389'],
  ['Norway', '+47'], ['Poland', '+48'], ['Portugal', '+351'], ['Romania', '+40'], ['Russia', '+7'],
  ['San Marino', '+378'], ['Serbia', '+381'], ['Slovakia', '+421'], ['Slovenia', '+386'], ['Spain', '+34'],
  ['Sweden', '+46'], ['Switzerland', '+41'], ['Ukraine', '+380'], ['United Kingdom', '+44'], ['Vatican City', '+39'],
] as const

export default function RegisterPage() {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('United States')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const countryCode = useMemo(
    () => countries.find(([name]) => name === country)?.[1] ?? '+1',
    [country],
  )

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const digits = phone.replace(/\D/g, '')
    if (digits.length < 6 || digits.length > 15) {
      setError('Enter a valid phone number for the selected country.')
      setLoading(false)
      return
    }

    const fullPhone = `${countryCode}${digits}`
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          country,
          country_code: countryCode,
          phone: fullPhone,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F7F9] px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-bold text-[#005EA8]">← IDA World Support Grant</Link>
        <div className="mt-8 rounded-2xl border border-[#D9E2E8] bg-white p-7 shadow-soft">
          <h1 className="text-2xl font-extrabold text-[#12304A]">Create applicant account</h1>
          <p className="mt-2 text-sm text-slate-600">Registration is available only to applicants in the United States, Australia, Canada, and eligible European countries.</p>

          {done ? (
            <div className="mt-6 rounded-lg bg-[#EAF1F5] p-4 text-sm text-[#12304A]">
              Check your email to confirm your account, then <Link href="/login" className="font-bold text-[#005EA8]">sign in</Link>.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-7 space-y-4">
              <label className="block text-sm font-semibold">Full name
                <input required value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" />
              </label>
              <label className="block text-sm font-semibold">Email
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" />
              </label>
              <label className="block text-sm font-semibold">Country
                <select required value={country} onChange={e => { setCountry(e.target.value); setPhone('') }} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm">
                  {countries.map(([name]) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold">Phone number
                <div className="mt-2 flex">
                  <span className="flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm font-bold text-slate-700">{countryCode}</span>
                  <input required inputMode="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9\s().-]/g, ''))} placeholder="Local phone number" className="w-full rounded-r-lg border border-slate-300 px-3 py-3 text-sm" />
                </div>
                <span className="mt-1 block text-xs font-normal text-slate-500">The calling code is set automatically from your selected country.</span>
              </label>
              <label className="block text-sm font-semibold">Password
                <input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" />
              </label>
              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <button disabled={loading} className="w-full rounded-lg bg-[#005EA8] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Creating…' : 'Create account'}</button>
            </form>
          )}
          <p className="mt-5 text-xs text-slate-500">Already registered? <Link href="/login" className="font-bold text-[#005EA8]">Sign in</Link></p>
        </div>
      </div>
    </main>
  )
}
