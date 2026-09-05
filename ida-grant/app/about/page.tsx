import { SiteHeader } from "@/components/site-header";
import { GrantFooter } from "@/components/grant-footer";
import { RecentAwards } from "@/components/recent-awards";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f4f7f9] py-10">
        <div className="container-x">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#005ea8]">About</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#12304a]">About the IDA World Support Grant</h1>
            <p className="mt-3 text-sm leading-6 text-[#536b79]">Learn how the programme works, what applicants provide, and what to expect after an application is submitted.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <section className="rounded-lg border border-[#d9e2e8] bg-white p-7">
              <h2 className="text-xl font-extrabold text-[#12304a]">How the programme works</h2>
              <p className="mt-3 text-sm leading-7 text-[#536b79]">Applicants submit their information and reason for support through the application form. Applications can then be reviewed by the programme team and assigned an appropriate status.</p>
            </section>
            <section className="rounded-lg border border-[#d9e2e8] bg-white p-7">
              <h2 className="text-xl font-extrabold text-[#12304a]">Applying</h2>
              <p className="mt-3 text-sm leading-7 text-[#536b79]">No applicant account or password is required to begin. Complete the application accurately and provide only information requested by the programme.</p>
            </section>
            <section className="rounded-lg border border-[#d9e2e8] bg-white p-7">
              <h2 className="text-xl font-extrabold text-[#12304a]">Grant amounts</h2>
              <p className="mt-3 text-sm leading-7 text-[#536b79]">Available support amounts are shown on the application form. An amount shown there is a requested support level, not a promise of approval or payment.</p>
            </section>
            <section className="rounded-lg border border-[#d9e2e8] bg-white p-7">
              <h2 className="text-xl font-extrabold text-[#12304a]">Applicant safety</h2>
              <p className="mt-3 text-sm leading-7 text-[#536b79]">Do not send money or sensitive account information in response to an unexpected request. Verify important requests through an independently confirmed programme contact.</p>
            </section>
          </div>
        </div>
      </main>
      <RecentAwards />
      <GrantFooter />
    </>
  );
}
