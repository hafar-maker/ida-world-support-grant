import Link from 'next/link'

export default function ForbiddenPage(){return <main className="min-h-screen grid place-items-center bg-[#F4F7F9] p-6"><div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-extrabold text-[#12304A]">Access restricted</h1><p className="mt-3 text-sm text-slate-600">This area is restricted to authorized staff accounts.</p><Link href="/login" className="mt-6 inline-flex rounded-lg bg-[#005EA8] px-5 py-3 text-sm font-bold text-white">Sign in</Link></div></main>}
