import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ValueStrip } from "@/components/value-strip";
import { Eligibility } from "@/components/eligibility";
import { HowItWorks } from "@/components/how-it-works";
import { CTA } from "@/components/cta";
import { GrantFooter } from "@/components/grant-footer";
import { RecentAwards } from "@/components/recent-awards";

export default function Home(){return <><SiteHeader/><main><Hero/><ValueStrip/><section className="border-y border-[#d9e2e8] bg-[#f4f7f9] py-10"><div className="container-x grid gap-6 md:grid-cols-3"><div className="md:col-span-2"><p className="text-xs font-bold uppercase tracking-wider text-[#005ea8]">Start here</p><h2 className="mt-2 text-2xl font-extrabold text-[#12304a]">Find the right support opportunity</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#536b79]">Search open opportunities, check eligibility, and apply online. The goal is a simple process with clear information at every step.</p></div><div className="flex items-center md:justify-end"><a href="/grants" className="rounded-md bg-[#005ea8] px-5 py-3 text-sm font-bold text-white hover:bg-[#004b87]">Search grants</a></div></div></section><Eligibility/><HowItWorks/><section id="about" className="border-t border-[#d9e2e8] py-12"><div className="container-x grid gap-8 md:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-wider text-[#005ea8]">About the programme</p><h2 className="mt-2 text-2xl font-extrabold text-[#12304a]">A clear, accountable support process</h2></div><p className="text-sm leading-7 text-[#536b79]">This portal is designed around plain-language guidance, transparent application stages, accessible forms, and a single place to track updates. Award information should only be published when it has been verified and approved for public release.</p></div></section><CTA/></main><RecentAwards/><GrantFooter/></>}
