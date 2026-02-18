import React from "react";
import { SectionWrapper } from "../SectionWrapper";

export const Section9UAERules = () => (
  <SectionWrapper id="listing-rules" title="UAE-Only Use and Listing Rules" number="9">
    <p>
      9.1 The Platform is intended exclusively for use within the United Arab Emirates. All listings,
      communications, and transactions must relate to goods, services, jobs, properties, or events
      located in, delivered in, or performed within the UAE. We block access from outside UAE IP
      addresses where technically feasible.
    </p>
    <p>
      9.2 You may create listings only in the categories made available on the Platform. We may, at
      our discretion, re-categorise, modify, or remove listings placed in the wrong category or that do
      not fit any available category.
    </p>

    <div className="overflow-x-auto my-10 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50">
      <table className="w-full border-collapse text-base">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="border-b border-gray-100 p-6 text-left font-bold text-purple whitespace-nowrap uppercase tracking-wider text-xs">Category</th>
            <th className="border-b border-gray-100 p-6 text-left font-bold text-gray-800 uppercase tracking-wider text-xs">Must Include</th>
            <th className="border-b border-gray-100 p-6 text-left font-bold text-red-600 uppercase tracking-wider text-xs">Never List</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {[
            { cat: "Motors", must: "UAE registration docs where applicable; accurate mileage and condition", never: "Stolen vehicles, unroadworthy cars, import scams" },
            { cat: "Property", must: "Exact location (emirate/area), size in sqft, accurate photos", never: "Unlicensed brokers, off-plan without RERA approval" },
            { cat: "Jobs", must: "Legitimate salary range, clear role description", never: "Multi-level marketing, visa scams, unregulated agencies" },
            { cat: "Electronics", must: "Working condition, original accessories, warranty status", never: "Counterfeit brands, refurbished goods listed as 'new'" },
            { cat: "Home & Garden", must: "Dimensions, material, pickup/delivery terms", never: "Hazardous waste, expired or unsafe appliances" },
            { cat: "Baby & Kids", must: "Age suitability and applicable safety standards", never: "Recalled items, adult products misrepresented for children" },
            { cat: "Services", must: "Provider's valid UAE trade licence where required", never: "Unlicensed health, legal, or education services" },
            { cat: "Events", must: "Exact date, venue, and ticket terms", never: "Scalped tickets, unpermitted public gatherings" },
            { cat: "Business", must: "Legitimate business use only", never: "Pyramid schemes, unregulated investment solicitation" }
          ].map((row, i) => (
            <tr key={i} className="hover:bg-purple/[0.02] transition-colors">
              <td className="p-6 font-bold text-gray-900">{row.cat}</td>
              <td className="p-6 text-gray-700 leading-relaxed">{row.must}</td>
              <td className="p-6 text-gray-500 italic leading-relaxed">{row.never}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p>
      9.3 You must not list or promote goods, services, jobs, or opportunities that are illegal,
      restricted, or require special approvals in the UAE without holding and clearly disclosing the
      necessary licences. We may request proof and may remove listings or suspend accounts where
      proof is not provided.
    </p>
    <p>
      9.4 You must comply with all applicable UAE laws, including the Federal Law No. 5/2012
      (Combating Cybercrimes), the Consumer Protection Law (Federal Decree-Law No. 15/2020),
      the Labour Law (Federal Decree-Law No. 33/2021), and ADGM/DIFC regulations if applicable.
    </p>
    <p>
      9.5 Paid Subscription plans unlock boosted visibility, featured listings, analytics, and priority
      support within approved categories only. Subscriptions do not guarantee sales, rentals, or
      responses. We do not facilitate shipping, delivery, payment handling, recruitment, or event
      organisation on your behalf unless explicitly stated in specific Platform features.
    </p>
  </SectionWrapper>
);
