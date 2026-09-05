import { SiteHeader } from "@/components/site-header";
import { GrantFooter } from "@/components/grant-footer";
import { RecentAwards } from "@/components/recent-awards";

const topics = [
  ["Grants 101", "Understand what the IDA World Support Grant is, how funding works, and what happens after you submit an application.", "#grants-101"],
  ["Eligibility", "Review the main eligibility requirements and the information applicants should have ready before applying.", "#eligibility"],
  ["How to apply", "Learn the application stages, what to expect during review, and how to track your application after submission.", "#how-to-apply"],
  ["Grant terms", "Plain-language explanations of common grant terms, application statuses, awards, and payment stages.", "#grant-terms"],
  ["Fraud awareness", "Learn how to recognize suspicious grant requests and protect your personal and financial information.", "#fraud-awareness"],
];

export default function LearnPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f4f7f9] py-10">
        <div className="container-x">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#005ea8]">Learn</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#12304a]">About the IDA World Support Grant</h1>
            <p className="mt-3 text-sm leading-6 text-[#536b79]">
              Learn how the grant works, who may be eligible, what the application process involves,
              and how to stay informed before you decide to apply.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {topics.map(([title, description, href]) => (
              <article key={title} className="rounded-lg border border-[#d9e2e8] bg-white p-6">
                <h2 className="font-bold text-[#12304a]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#647985]">{description}</p>
                <a href={href} className="mt-4 inline-block text-sm font-bold text-[#005ea8] hover:underline">
                  Read about {title.toLowerCase()} →
                </a>
              </article>
            ))}
          </div>

          <div className="mt-10 space-y-5">
            <section id="grants-101" className="scroll-mt-28 rounded-lg border border-[#d9e2e8] bg-white p-7">
              <h2 className="text-xl font-extrabold text-[#12304a]">Grants 101</h2>
              <p className="mt-3 text-sm leading-7 text-[#536b79]">
                The IDA World Support Grant is presented through a structured funding process. Applicants
                provide information about their circumstances and intended use of support, after which an
                application can be reviewed against the programme requirements. An award is only confirmed
                after the relevant review and approval stages are completed.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#536b79]">
                The portal is designed to keep each stage clear: find an opportunity, understand the
                requirements, submit information, track review updates, and view an approved award when it
                has been released for publication.
              </p>
            </section>

            <section id="eligibility" className="scroll-mt-28 rounded-lg border border-[#d9e2e8] bg-white p-7">
              <h2 className="text-xl font-extrabold text-[#12304a]">Eligibility</h2>
              <p className="mt-3 text-sm leading-7 text-[#536b79]">
                Eligibility depends on the specific support opportunity and the programme requirements in
                effect when you apply. Applicants should review the opportunity details carefully and make
                sure the information in their application is complete and accurate.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#536b79]">
                Before starting an application, have your contact details, identification or supporting
                information, and any documents requested by the opportunity available.
              </p>
            </section>

            <section id="how-to-apply" className="scroll-mt-28 rounded-lg border border-[#d9e2e8] bg-white p-7">
              <h2 className="text-xl font-extrabold text-[#12304a]">How to apply</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#536b79]">
                <li>Review the available grant information and eligibility requirements.</li>
                <li>Sign in or create an applicant account.</li>
                <li>Complete the application and provide the requested supporting information.</li>
                <li>Submit the application and monitor your account for messages or status updates.</li>
                <li>If approved, review the award information and any next steps shown in your account.</li>
              </ol>
            </section>

            <section id="grant-terms" className="scroll-mt-28 rounded-lg border border-[#d9e2e8] bg-white p-7">
              <h2 className="text-xl font-extrabold text-[#12304a]">Grant terms</h2>
              <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                <div><dt className="font-bold text-[#12304a]">Submitted</dt><dd className="mt-1 leading-6 text-[#647985]">Your application has been sent for review.</dd></div>
                <div><dt className="font-bold text-[#12304a]">Under review</dt><dd className="mt-1 leading-6 text-[#647985]">The application is being assessed by the programme team.</dd></div>
                <div><dt className="font-bold text-[#12304a]">Approved</dt><dd className="mt-1 leading-6 text-[#647985]">The application has passed the required approval stage.</dd></div>
                <div><dt className="font-bold text-[#12304a]">Award</dt><dd className="mt-1 leading-6 text-[#647985]">The approved support amount and related award information.</dd></div>
              </dl>
            </section>

            <section id="fraud-awareness" className="scroll-mt-28 rounded-lg border border-[#d9e2e8] bg-white p-7">
              <h2 className="text-xl font-extrabold text-[#12304a]">Fraud awareness</h2>
              <p className="mt-3 text-sm leading-7 text-[#536b79]">
                Be cautious of anyone asking you to pay an unexpected fee, share your password, or send
                sensitive financial information in order to receive a grant. Use the portal account and
                official contact channels to verify requests, and do not share your login credentials with
                another person.
              </p>
            </section>
          </div>
        </div>
      </main>
      <RecentAwards />
      <GrantFooter />
    </>
  );
}
