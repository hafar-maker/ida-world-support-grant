import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ValueStrip } from "@/components/value-strip";
import { Eligibility } from "@/components/eligibility";
import { HowItWorks } from "@/components/how-it-works";
import { CTA } from "@/components/cta";
import { GrantFooter } from "@/components/grant-footer";

export default function Home(){return <><SiteHeader/><main><Hero/><ValueStrip/><Eligibility/><HowItWorks/><section id="about" className="py-10 text-center"><p className="text-sm text-slate-500">Built as the first visual MVP from your reference design.</p></section><CTA/></main><GrantFooter/></>}
