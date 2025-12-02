"use client";

import React from "react";
import { useMyOrganization,  } from "@/hooks/useOrganizations";
import { Organization } from "@/interfaces/organization.types";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { Plus, Building2,  } from "lucide-react";
import Image from "next/image";
import { OrganizationsListSkeleton } from "./_components/OrganizationsListSkeleton";

const OrganizationsListPage = () => {
  const { data: organizationsData, isLoading } = useMyOrganization();
  const organizations = organizationsData?.data || [];

  // Get organization type display
  const getOrganizationType = (type: string | undefined): string => {
    if (!type) return "ORGANIZATION";
    return type.toUpperCase();
  };

  // Format location
  const getLocation = (org: Organization): string => {
    const city = org.city || "";
    const country = org.country || "AE";
    return city ? `${city}, ${country}` : country;
  };

  // Get status badge
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();
    
    const statusConfig: Record<string, { text: string; bgColor: string; textColor: string }> = {
      pending: { text: "Draft", bgColor: "bg-[#FFF4E6]", textColor: "text-[#B88230]" },
      active: { text: "Active", bgColor: "bg-green-100", textColor: "text-green-700" },
      inactive: { text: "Inactive", bgColor: "bg-gray-100", textColor: "text-gray-700" },
      suspended: { text: "Suspended", bgColor: "bg-red-100", textColor: "text-red-700" },
    };
    
    const config = statusConfig[statusLower];
    if (!config) return null;
    
    return (
      <div className={`px-2 py-1 ${config.bgColor} rounded-md`}>
        <Typography
          variant="xs-regular-inter"
          className={`text-xs font-medium ${config.textColor}`}
        >
          {config.text}
        </Typography>
      </div>
    );
  };

  return (
      <div className="max-w-[1080px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-end md:justify-between mb-6">
          <div className="hidden md:block">
            <Typography
              variant="lg-black-inter"
              className="text-lg md:text-2xl font-semibold text-[#1D2939] mb-2"
            >
              My Organizations
            </Typography>
            <Typography
              variant="sm-regular-inter"
              className="text-xs md:text-sm text-[#8A8A8A]"
            >
              Manage your organizations and create new ones
            </Typography>
          </div>
          <Link href="/organizations/new">
            <Button
              variant="filled"
                                      size="sm"
                                      iconPosition="left"
              icon={<Plus className="block w-5 h-5" />}
            >
              <span className="hidden md:block">Create New</span> Organization
            </Button>
          </Link>
        </div>

        {/* Organizations Grid */}
        {isLoading ? (
          <OrganizationsListSkeleton />
        ) : organizations.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E5E5E5] p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography
              variant="md-semibold-inter"
              className="text-lg font-semibold text-[#1D2939] mb-2"
            >
              No Organizations Found
            </Typography>
            <Typography
              variant="sm-regular-inter"
              className="text-sm text-[#8A8A8A] mb-6"
            >
              Create your first organization to get started
            </Typography>
            <Link href="/organizations/new">
              <Button variant="filled" size="lg" icon={<Plus className="w-5 h-5" />}>
                Create Organization
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <Link
              href={`/organizations/${org._id}`}
                key={org._id}
                className="bg-white rounded-lg border border-[#E5E5E5] p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {org.logoUrl ? (
                      <Image
                        src={org.logoUrl}
                        alt={org.tradeName || org.legalName}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-purple/20 rounded-full flex items-center justify-center">
                        <Typography
                          variant="sm-semibold-inter"
                          className="text-purple font-semibold"
                        >
                          {(org.tradeName || org.legalName || "O").charAt(0).toUpperCase()}
                        </Typography>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Typography
                        variant="sm-semibold-inter"
                        className="text-sm font-semibold text-[#1D2939] truncate"
                      >
                        {org.tradeName || org.legalName}
                      </Typography>
                      <Typography
                        variant="xs-regular-inter"
                        className="text-xs text-[#8A8A8A] truncate"
                      >
                        {getOrganizationType(org.type)} • {getLocation(org)}
                      </Typography>
                    </div>
                  </div>
                  {getStatusBadge(org.status)}
                </div>
                {org.verified && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Verified
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
  );
};

export default OrganizationsListPage;

