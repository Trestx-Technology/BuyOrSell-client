import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { Typography } from "@/components/typography";

export const Annex1Property = () => (
  <SectionWrapper id="annex-property" title="Annex 1 — Terms: Property for Sale and Property for Rent" className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
    <p>
      The &apos;Property for Sale&apos; and &apos;Property for Rent&apos; sections of the Platform allow property owners,
      brokers, real estate agents, and real estate developers to advertise properties, and prospective
      buyers or renters to view listing information and contact the relevant party.
    </p>

    <div className="space-y-6 mt-6">
      <div>
        <Typography variant="h4" className="text-purple mb-2">Owners</Typography>
        <p>If you are a property owner, you acknowledge and agree that:</p>
        <ul className="list-disc pl-10 space-y-2 mt-2">
          <li>You warrant that you are the registered owner or landlord of the property advertised in your listing.</li>
          <li>You may only advertise properties that are currently available for sale or lease (as relevant).</li>
          <li>You may only advertise properties that can lawfully be sold or leased, subject to all applicable restrictions (such as restrictions on the number of occupiers).</li>
        </ul>
      </div>

      <div>
        <Typography variant="h4" className="text-purple mb-2">Brokers, Real Estate Agents, and Developers</Typography>
        <p>If you are a property broker, real estate agent, or real estate developer, you acknowledge and agree that:</p>
        <ul className="list-disc pl-10 space-y-2 mt-2">
          <li>You must possess a valid licence from the relevant real estate authority (e.g., RERA, ADREC) to advertise properties on the Platform, and must hold the relevant commercial licence(s) to practice this activity.</li>
          <li>If you advertise an &apos;off-plan&apos; property, you must ensure that the project is registered with and authorised by the relevant real estate authority.</li>
          <li>You may only advertise properties that are currently available for sale or lease, and that can lawfully be sold or leased, subject to all applicable restrictions.</li>
        </ul>
      </div>

      <div>
        <Typography variant="h4" className="text-purple mb-2">Buyers and Renters</Typography>
        <p>If you are a prospective buyer or renter, you acknowledge and agree that:</p>
        <ul className="list-disc pl-10 space-y-2 mt-2">
          <li>BuyOrSell only provides the Platform enabling owners, brokers, agents, and developers to advertise properties. BuyOrSell is not itself a real estate broker.</li>
          <li>BuyOrSell has no obligation to verify the accuracy or completeness of property listings. You must conduct your own due diligence and must not rely solely on the contents of any listing.</li>
        </ul>
      </div>
    </div>
  </SectionWrapper>
);

export const Annex2Motors = () => (
  <SectionWrapper id="annex-motors" title="Annex 2 — Terms: Motors" className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
    <p>
      The &apos;Motors&apos; section of the Platform allows sellers to advertise vehicles for sale, and prospective
      buyers to view vehicle information and contact the relevant seller.
    </p>

    <div className="space-y-4 mt-6">
      <Typography variant="h4" className="text-purple">Sellers</Typography>
      <p>If you are a seller, you acknowledge and agree that any vehicle you advertise on the Platform must:</p>
      <ul className="list-disc pl-10 space-y-2">
        <li>Be roadworthy;</li>
        <li>Be legally owned by you (or by the person on whose behalf you are creating the listing);</li>
        <li>Be available for sale;</li>
        <li>Be located in the UAE; and</li>
        <li>Be accurately described in your listing, including mileage, condition, and any defects.</li>
      </ul>
      <div className="bg-white p-4 rounded-xl border border-gray-200 mt-4">
        <p><strong>Proof of Ownership:</strong> BuyOrSell may request proof of ownership of the vehicle and/or proof that the vehicle is located in the UAE and has been cleared by local customs. If you do not provide such proof within the timeframe specified in our request, we may immediately remove the relevant listing without further notice and without any refund.</p>
      </div>
    </div>
  </SectionWrapper>
);

export const Annex3Jobs = () => (
  <SectionWrapper id="annex-jobs" title="Annex 3 — Terms: Jobs" className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
    <p>
      The &apos;Jobs&apos; section of the Platform allows employers and recruiters to advertise open positions,
      and job seekers to submit applications for those positions.
    </p>

    <div className="space-y-6 mt-6">
      <div>
        <Typography variant="h4" className="text-purple mb-2">Employers and Recruiters</Typography>
        <p>If you are an employer or recruiter, you acknowledge and agree that:</p>
        <ul className="list-disc pl-10 space-y-2 mt-2">
          <li>BuyOrSell is not responsible for information posted by job seekers or in their CVs, and does not guarantee the fitness of any job seeker for a given position. The &apos;CV Search&apos; feature is merely a tool to allow you to browse CVs in our database.</li>
          <li>Any fees paid are non-refundable in all circumstances, including if you fail to identify a suitable candidate.</li>
          <li>You must not post job listings that constitute visa scams, multi-level marketing schemes, or any activity that violates UAE labour laws.</li>
        </ul>
      </div>

      <div>
        <Typography variant="h4" className="text-purple mb-2">Job Seekers</Typography>
        <p>If you are a job seeker, you acknowledge and agree that:</p>
        <ul className="list-disc pl-10 space-y-2 mt-2">
          <li>By placing a job-seeking advertisement in the &apos;Jobs&apos; section, employers and recruiters will have access to your personal details and your CV.</li>
          <li>Any fees paid are non-refundable in all circumstances, including if you fail to secure a job position.</li>
          <li>BuyOrSell does not verify the legitimacy of job postings. Always conduct your own due diligence before accepting a job offer or sharing personal or financial information.</li>
        </ul>
      </div>
    </div>
  </SectionWrapper>
);
