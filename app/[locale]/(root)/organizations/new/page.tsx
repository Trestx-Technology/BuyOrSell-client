"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  useCreateOrganization,
  useMyOrganization,
} from "@/hooks/useOrganizations";
import { CreateOrganizationPayload } from "@/interfaces/organization.types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { Organization } from "@/interfaces/organization.types";
import {
  ORGANIZATION_STATUS_CONFIG,
  OrganizationStatus,
} from "@/constants/enums";
import { OrganizationFormData } from "@/schemas/organization.schema";
import { useLocale } from "@/hooks/useLocale";
import { OrganizationForm } from "../_components/OrganizationForm";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

const NewOrganizationPage = () => {
  const router = useRouter();
  const { session } = useAuthStore((state) => state);
  const createOrganizationMutation = useCreateOrganization();
  const { data: organizationsData, isLoading: isLoadingOrgs } =
    useMyOrganization();
  const organizations = organizationsData?.data || [];
  const { t, localePath } = useLocale();

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      if (!session?.user?._id) {
        toast.error(t.organizations.errors.pleaseLoginToCreate);
        return;
      }

      const payload: CreateOrganizationPayload = {
        type: data.type,
        country: data.country,
        emirate: data.emirate,
        tradeLicenseNumber: data.tradeLicenseNumber,
        tradeLicenseExpiry: data.tradeLicenseExpiry,
        tradeLicenseUrl: data.tradeLicenseUrl,
        ownerDocsUrl: data.ownerDocsUrl,
        poaUrl: data.poaUrl || undefined,
        trn: data.trn || undefined,
        legalName: data.legalName,
        tradeName: data.tradeName,
        reraNumber: data.reraNumber || undefined,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || undefined,
        city: data.city,
        poBox: data.poBox || undefined,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        website: data.website || undefined,
        description: data.description || undefined,
        logoUrl: data.logoUrl || undefined,
        businessHours:
          data.businessHours?.map((bh) => ({
            day: bh.day === 7 ? 0 : bh.day,
            open: bh.open,
            close: bh.close,
            closed: bh.closed,
            allDay: bh.allDay,
          })) || undefined,
        certificates:
          data.certificates?.map((cert) => ({
            name: cert.name,
            issuer: cert.issuer,
            issuedOn: cert.issuedOn,
            expiresOn: cert.expiresOn || undefined,
            url: cert.url || undefined,
          })) || undefined,
        languages:
          data.languages && data.languages.length > 0
            ? data.languages
            : undefined,
      };

      await createOrganizationMutation.mutateAsync(payload);
      toast.success(t.organizations.errors.organizationCreatedSuccess);
      router.push(localePath("/organizations/my"));
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t.organizations.errors.failedToCreate;
      toast.error(errorMessage);
    }
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
    const statusLower = status.toLowerCase() as OrganizationStatus;

    const config = ORGANIZATION_STATUS_CONFIG[statusLower];
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
    <Container1080>
      <MobileStickyHeader title="Create New Organization" />
      {/* Header */}
      <div className="my-6 px-4">
        <Link
          href={localePath("/organizations/my")}
          className="hidden sm:inline-flex items-center gap-2 text-purple hover:text-purple/80 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <Typography variant="sm-regular-inter" className="text-sm">
            {t.organizations.form.backToOrganizations}
          </Typography>
        </Link>
        <Typography
          variant="lg-black-inter"
          className="text-2xl font-semibold text-[#1D2939] mb-2"
        >
          {t.organizations.form.createNewOrganization}
        </Typography>
        <Typography
          variant="sm-regular-inter"
          className="text-sm text-[#8A8A8A]"
        >
          {t.organizations.form.fillDetailsToCreate}
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <OrganizationForm
            onSubmit={onSubmit}
            isLoading={createOrganizationMutation.isPending}
          />
        </div>

        {/* Organizations List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-[#E5E5E5] p-4 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <Typography
                variant="md-semibold-inter"
                className="text-base font-semibold text-[#1D2939]"
              >
                {t.organizations.form.myOrganizations}
              </Typography>
              <Link href={localePath("/organizations/my")}>
                <Button variant="ghost" size="sm" className="text-purple">
                  {t.organizations.form.viewAll}
                </Button>
              </Link>
            </div>

            {isLoadingOrgs ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-gray-200 h-16 rounded"
                  />
                ))}
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <Typography
                  variant="xs-regular-inter"
                  className="text-xs text-[#8A8A8A]"
                >
                  {t.organizations.form.noOrganizationsYet}
                </Typography>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {organizations.slice(0, 5).map((org) => (
                  <div
                    key={org._id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-purple/20"
                  >
                    {org.logoUrl ? (
                      <Image
                        src={org.logoUrl}
                        alt={org.tradeName || org.legalName}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Typography
                          variant="xs-semibold-inter"
                          className="text-purple font-semibold text-xs"
                        >
                          {(org.tradeName || org.legalName || "O")
                            .charAt(0)
                            .toUpperCase()}
                        </Typography>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Typography
                        variant="xs-semibold-inter"
                        className="text-xs font-semibold text-[#1D2939] truncate"
                      >
                        {org.tradeName || org.legalName}
                      </Typography>
                      <Typography
                        variant="xs-regular-inter"
                        className="text-xs text-[#8A8A8A] truncate"
                      >
                        {org.type} • {getLocation(org)}
                      </Typography>
                    </div>
                    {getStatusBadge(org.status)}
                  </div>
                ))}
                {organizations.length > 5 && (
                  <Link href={localePath("/organizations/my")}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      {t.organizations.form.viewAllCount.replace(
                        "{count}",
                        organizations.length.toString()
                      )}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container1080>
  );
};

export default NewOrganizationPage;
