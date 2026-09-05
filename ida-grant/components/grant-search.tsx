"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Grant={id:string;title:string;description:string;category:string;status:string;created_at:string};

export function GrantSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => { fetch("/api/grants").then(async r => { if (!r.ok) throw new Error("Unable to load grant opportunities"); return r.json(); }).then(d => setGrants(Array.isArray(d)?d:[])).catch(e => setLoadError(e.message)).finally(()=>setLoading(false)); }, []);
  const filtered = useMemo(() => grants.filter(g => (category === "All categories" || g.category === category) && `${g.title} ${g.category}`.toLowerCase().includes(query.toLowerCase())), [query, category]);
  return <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
    <aside className="rounded-lg border border-[#d9e2e8] bg-white p-5">
      <div className="mb-4 flex items-center gap-2 font-bold text-[#12304a]"><SlidersHorizontal size={17}/> Filters</div>
      <label className="block text-xs font-bold text-[#27465a]">Category</label>
      <select value={category} onChange={e=>setCategory(e.target.value)} className="mt-2 w-full rounded-md border border-[#b9cbd5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#005ea8]">
        {['All categories','Household','Education','Medical','Basic needs'].map(v=><option key={v}>{v}</option>)}
      </select>
      <div className="mt-6 rounded-md bg-[#f4f7f9] p-3 text-xs leading-5 text-[#536b79]">Use filters to narrow open funding opportunities. Details should be verified before applying.</div>
    </aside>
    <section>
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1"><Search size={17} className="absolute left-3 top-3 text-[#718793]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search grant opportunities" className="w-full rounded-md border border-[#b9cbd5] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#005ea8]"/></div>
        <button className="rounded-md bg-[#005ea8] px-5 text-sm font-bold text-white hover:bg-[#004b87]">Search</button>
      </div>
      <p className="mb-3 text-xs text-[#647985]">{loading ? "Loading opportunities…" : `${filtered.length} opportunities found`}</p>
      {loadError && <div className="mb-3 rounded-md bg-red-50 p-3 text-xs text-red-700">{loadError}</div>}
      <div className="space-y-3">{filtered.map(g=><article key={g.title} className="rounded-lg border border-[#d9e2e8] bg-white p-5 hover:border-[#9eb8c7]">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><span className="inline-flex rounded-full bg-[#eaf1f5] px-2 py-1 text-[10px] font-bold uppercase text-[#005ea8]">{g.status}</span><h2 className="mt-2 text-lg font-bold text-[#12304a]">{g.title}</h2><p className="mt-1 text-xs text-[#647985]">IDA World Support Grant · {g.category}</p></div><a href={`/apply?grant=${g.id}`} className="rounded-md border border-[#005ea8] px-4 py-2 text-xs font-bold text-[#005ea8]">View & apply</a></div>
        <p className="mt-3 text-sm leading-6 text-[#536b79]">{g.description}</p><div className="mt-4 grid gap-2 border-t border-[#e4eaee] pt-3 text-xs text-[#536b79] sm:grid-cols-2"><span>Funding instrument: Grant</span><span>Eligibility: Applicants</span></div>
      </article>)}</div>
    </section>
  </div>
}
