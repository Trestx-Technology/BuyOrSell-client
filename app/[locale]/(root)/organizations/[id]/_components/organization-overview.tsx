"use client";

import React from "react";
import { Organization } from "@/interfaces/organization.types";
import { EmployerProfile } from "@/interfaces/job.types";

interface OrganizationOverviewProps {
  organization: Organization & Partial<EmployerProfile>;
}

export const OrganizationOverview = ({ organization }: OrganizationOverviewProps) => {
  return (
    <div className="py-8 text-slate-700 space-y-6">
      <p>
        {organization.companyDescription ||
          "BuyorSell Dubai Is A Leading Classifieds Platform, Boasting Over 100+ Million App Downloads Across Diverse Categories, Including Cars, Bikes, Real Estate, And Electronics. BuyOrSell Is The Online Classified Marketplace Helping Them Maximize The Value Of Their Belongings And Promoting Responsible Consumption, Contributing To A Greener, More Sustainable Future."}
      </p>

      {!organization.companyDescription && (
        <p>
          BuyorSell Is Now Part Of The CarTrade Tech Group, Which Is India's Largest Online Auto Platform. It Encompasses Brands Such As CarWale, CarTrade, Shriram Automobll, BikeWale, CarTrade Exchange, And Adroit Auto. Together, These Brands Offer A Comprehensive Suite Of Tools And Services Aimed At Enhancing The Car Selling And Buying Experience, Attracting An Average Of 70 Million Monthly Unique And A Staggering 1.4 Million Listings For Auction.
        </p>
      )}

      <div>
        <p className="font-semibold mb-2">Download Our App Through The Link Below:</p>
        <div className="space-y-2 text-slate-600">
          <p>Android : Https://Play.Google.Com/Store/Search?Q=Olx&C=Apps&Hi=En-IN&Pl=1</p>
          <p>IOS: Https://Apps.Apple.Com/In/App/BuyorSell-Buy-Sell-Near-You/Id913492792</p>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid gap-8 mt-8 pt-8 border-t border-slate-200">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Website</h3>
          {organization.website ? (
            <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
              {organization.website}
            </a>
          ) : (
            <p className="text-slate-500">Not specified</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Industry</h3>
          <p>{organization.industry || "Technology, Information And Internet"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Company Size</h3>
          <div className="space-y-1">
            <p>{organization.companySize || "501-1,000 Employees"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
