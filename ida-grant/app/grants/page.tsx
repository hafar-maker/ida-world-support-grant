import { SiteHeader } from "@/components/site-header";
import { GrantFooter } from "@/components/grant-footer";
import { GrantSearch } from "@/components/grant-search";
import { RecentAwards } from "@/components/recent-awards";

export default function GrantsPage(){return <><SiteHeader/><main className="bg-[#f4f7f9] py-10"><div className="container-x"><div className="mb-8 max-w-3xl"><p className="text-xs font-bold uppercase tracking-wider text-[#005ea8]">Find funding</p><h1 className="mt-2 text-3xl font-extrabold text-[#12304a]">Search grant opportunities</h1><p className="mt-3 text-sm leading-6 text-[#536b79]">Browse available IDA World Support Grant opportunities, review eligibility, and start an application.</p></div><GrantSearch/></div></main><RecentAwards/><GrantFooter/></>}
