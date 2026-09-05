'use client'

import { FormEvent, useEffect, useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { GrantFooter } from '@/components/grant-footer'
import { RecentAwards } from '@/components/recent-awards'

const fields = [
  ['full_name', 'Full name', 'text'],
  ['address', 'Residential street address', 'text'],
  ['age', 'Age', 'number'],
  ['city', 'City', 'text'],
  ['state', 'State / Province', 'text'],
  ['postal_code', 'ZIP / Postal code', 'text'],
  ['status', 'Relationship status', 'text'],
  ['email', 'Email address', 'email'],
  ['phone', 'Text / phone number', 'tel'],
  ['date_of_birth', 'Date of birth', 'date'],
  ['occupation', 'Occupation', 'text'],
  ['monthly_income', 'Monthly income', 'number'],
]

const supportAmounts = ['$30,000', '$85,000', '$120,000', '$170,000', '$300,000', '$500,000', '$650,000', '$800,000', '$1,000,000', '$1,400,000']

function looksLikeRealAddress(value: string) {
  const address = value.trim()
  if (address.length < 8 || address.length > 180) return false
  if (/^(test|fake|n\/a|na|none|unknown|asdf|qwerty)$/i.test(address)) return false
  const hasNumber = /\d/.test(address)
  const hasLetters = /[A-Za-z]/.test(address)
  const hasStreetWord = /\b(street|st|road|rd|avenue|ave|lane|ln|drive|dr|boulevard|blvd|close|crescent|court|ct|way|place|pl|terrace|ter|park|highway|hwy)\b/i.test(address)
  return hasNumber && hasLetters && (hasStreetWord || address.split(/\s+/).length >= 3)
}

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [form, setForm] = useState<Record<string, string>>({})
  const [reason, setReason] = useState('')
  const [grantId, setGrantId] = useState('')
  const [requestedAmount, setRequestedAmount] = useState('')

  useEffect(() => {
    setGrantId(new URLSearchParams(window.location.search).get('grant') || '')
  }, [])

  function change(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    if (key === 'address') setAddressError('')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!looksLikeRealAddress(form.address || '')) {
      setAddressError('Please enter your real residential street address, including a house/building number and street name. Test, fake, or placeholder addresses are not accepted.')
      return
    }
    setAddressError('')
    setLoading(true)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, reason, grant_id: grantId, requested_amount: requestedAmount }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Unable to submit application')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Unable to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-[#f4f7f9] py-10">
        <div className="container-x max-w-4xl">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#005ea8]">Applicants</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#12304a]">Application form</h1>
            <p className="mt-3 text-sm leading-6 text-[#536b79]">Complete the information below. No applicant account or password is required. Your applicant record is created automatically when you submit.</p>
          </div>

          {submitted ? (
            <div className="rounded-lg border border-[#b9d8c6] bg-white p-8">
              <h2 className="text-xl font-bold text-[#12304a]">Application received</h2>
              <p className="mt-2 text-sm text-[#536b79]">Your application has been submitted successfully. Our team can now review your application.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-lg border border-[#d9e2e8] bg-white">
              <div className="border-b border-[#d9e2e8] bg-[#f8fafb] px-6 py-4 text-xs text-[#536b79]">Application details</div>
              <div className="grid gap-5 p-6 sm:grid-cols-2">
                {fields.map(([id, label, type]) => (
                  <label key={id} className="block text-sm font-semibold text-[#27465a]">
                    {label} <span className="text-[#b42318]">*</span>
                    <input required value={form[id] || ''} onChange={(event) => change(id, event.target.value)} id={id} name={id} type={type} min={type === 'number' && id === 'age' ? '18' : undefined} className="mt-2 w-full rounded-md border border-[#b9cbd5] px-3 py-2.5 font-normal outline-none focus:border-[#005ea8]" />
                    {id === 'address' && <span className="mt-2 block text-xs font-normal text-[#647985]">Enter your real residential street address. Do not use a fake, test, or placeholder address.</span>}
                    {id === 'address' && addressError && <span className="mt-2 block text-xs font-semibold text-[#b42318]">{addressError}</span>}
                  </label>
                ))}
                <label className="block text-sm font-semibold text-[#27465a] sm:col-span-2">
                  Requested support amount <span className="text-[#b42318]">*</span>
                  <select required value={requestedAmount} onChange={(event) => setRequestedAmount(event.target.value)} className="mt-2 w-full rounded-md border border-[#b9cbd5] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#005ea8]">
                    <option value="">Select an amount</option>
                    {supportAmounts.map((amount) => <option key={amount} value={amount}>{amount}</option>)}
                  </select>
                  <span className="mt-2 block text-xs font-normal text-[#647985]">This is the support amount you are requesting. Approval and final award amounts are determined during review.</span>
                </label>
                <label className="block text-sm font-semibold text-[#27465a] sm:col-span-2">
                  Reason for support <span className="text-[#b42318]">*</span>
                  <textarea required value={reason} onChange={(event) => setReason(event.target.value)} rows={5} className="mt-2 w-full rounded-md border border-[#b9cbd5] px-3 py-2.5 font-normal outline-none focus:border-[#005ea8]" />
                </label>
              </div>
              {error && <div className="mx-6 mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <div className="flex flex-col justify-between gap-4 border-t border-[#d9e2e8] bg-[#f8fafb] px-6 py-5 sm:flex-row sm:items-center">
                <p className="text-xs text-[#647985]">By submitting, you confirm the information is accurate.</p>
                <button disabled={loading} className="rounded-md bg-[#005ea8] px-6 py-3 text-sm font-bold text-white hover:bg-[#004b87] disabled:opacity-60">{loading ? 'Submitting…' : 'Submit application'}</button>
              </div>
            </form>
          )}
        </div>
      </main>
      <RecentAwards />
      <GrantFooter />
    </>
  )
}
