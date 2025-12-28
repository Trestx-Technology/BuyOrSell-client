"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Organization } from "@/interfaces/organization.types";

interface EmployerInfoProps {
  employer: Organization;
}

export default function EmployerInfo({ employer }: EmployerInfoProps) {
  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl mb-6"
      >
        About Company
      </Typography>

      <div className="space-y-6">
        {/* Company Description */}
        {employer.legalName && (
          <div>
            <Typography
              variant="body-small"
              className="text-dark-blue font-medium text-sm mb-2"
            >
              Legal Name
            </Typography>
            <Typography
              variant="body-large"
              className="text-[#8A8A8A] text-base"
            >
              {employer.legalName}
            </Typography>
          </div>
        )}

        {/* Address */}
        {employer.addressLine1 && (
          <div>
            <Typography
              variant="body-small"
              className="text-dark-blue font-medium text-sm mb-2"
            >
              Address
            </Typography>
            <Typography
              variant="body-large"
              className="text-[#8A8A8A] text-base"
            >
              {employer.addressLine1}
              {employer.addressLine2 && `, ${employer.addressLine2}`}
              {employer.city && `, ${employer.city}`}
              {employer.emirate && `, ${employer.emirate}`}
            </Typography>
          </div>
        )}

        {/* Trade License */}
        {employer.tradeLicenseNumber && (
          <div>
            <Typography
              variant="body-small"
              className="text-dark-blue font-medium text-sm mb-2"
            >
              Trade License Number
            </Typography>
            <Typography
              variant="body-large"
              className="text-[#8A8A8A] text-base"
            >
              {employer.tradeLicenseNumber}
            </Typography>
          </div>
        )}

        {/* TRN */}
        {employer.trn && (
          <div>
            <Typography
              variant="body-small"
              className="text-dark-blue font-medium text-sm mb-2"
            >
              TRN
            </Typography>
            <Typography
              variant="body-large"
              className="text-[#8A8A8A] text-base"
            >
              {employer.trn}
            </Typography>
          </div>
        )}

        {/* RERA Number */}
        {employer.reraNumber && (
          <div>
            <Typography
              variant="body-small"
              className="text-dark-blue font-medium text-sm mb-2"
            >
              RERA Number
            </Typography>
            <Typography
              variant="body-large"
              className="text-[#8A8A8A] text-base"
            >
              {employer.reraNumber}
            </Typography>
          </div>
        )}

        {/* Contact Person */}
        {employer.contactName && (
          <div>
            <Typography
              variant="body-small"
              className="text-dark-blue font-medium text-sm mb-2"
            >
              Contact Person
            </Typography>
            <Typography
              variant="body-large"
              className="text-[#8A8A8A] text-base"
            >
              {employer.contactName}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

