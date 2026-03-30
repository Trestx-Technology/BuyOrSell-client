"use client";

import React from "react";
import { Organization } from "@/interfaces/organization.types";
import { EmployerProfile } from "@/interfaces/job.types";

interface OrganizationOverviewProps {
  organization: Organization & Partial<EmployerProfile>;
}

export const OrganizationOverview = ({ organization }: OrganizationOverviewProps) => {
  return (
    <div className="py-8 text-slate-700 dark:text-gray-300 space-y-6">
      {organization.description ? (
        <p className="whitespace-pre-wrap">{organization.description}</p>
      ) : (
        <p className="text-slate-500 italic">No description provided by the organization.</p>
      )}

      {/* Info Boxes */}
      <div className="grid gap-8 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">Website</h3>
          {organization.website ? (
            <a 
              href={organization.website.startsWith('http') ? organization.website : `https://${organization.website}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-purple-600 hover:underline break-all"
            >
              {organization.website}
            </a>
          ) : (
            <p className="text-slate-500">Not specified</p>
          )}
        </div>

        {organization.industry && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">Industry</h3>
            <p>{organization.industry}</p>
          </div>
        )}

        {organization.companySize && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">Company Size</h3>
            <div className="space-y-1">
              <p>{organization.companySize}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
