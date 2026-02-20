"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useUpdateOrganization,
  useMyOrganization,
  useOrganizationById,
} from "@/hooks/useOrganizations";
import { UpdateOrganizationPayload } from "@/interfaces/organization.types";
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
import { OrganizationFormSkeleton } from "../../_components/OrganizationFormSkeleton";
import { OrganizationForm } from "../../_components/OrganizationForm";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Container1080 } from "@/components/layouts/container-1080";

const EditOrganizationPage = () => {
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;
  const session = useAuthStore((state) => state.session);
  const updateOrganizationMutation = useUpdateOrganization();
  const { data: organizationsData, isLoading: isLoadingOrgs } =
    useMyOrganization();
  const organizations = organizationsData?.data || [];

  const {
    data: organizationData,
    isLoading: isLoadingOrg,
    error: orgError,
  } = useOrganizationById(organizationId);
  const organization = organizationData?.data as Organization | undefined;
  const { t, localePath } = useLocale();

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      if (!session?.user?._id) {
        toast.error(t.organizations.errors.pleaseLoginToUpdate);
        return;
      }

      if (!organizationId) {
        toast.error(t.organizations.errors.organizationIdMissing);
        return;
      }

      const payload: UpdateOrganizationPayload = {
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

      await updateOrganizationMutation.mutateAsync({
        id: organizationId,
        data: payload,
      });

      toast.success(t.organizations.errors.organizationUpdatedSuccess);
      router.push(localePath("/organizations/my"));
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t.organizations.errors.failedToUpdate;
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

    const statusTranslationMap: Record<
      OrganizationStatus,
      keyof typeof t.organizations.status
    > = {
      [OrganizationStatus.PENDING]: "draft",
      [OrganizationStatus.ACTIVE]: "active",
      [OrganizationStatus.INACTIVE]: "inactive",
      [OrganizationStatus.SUSPENDED]: "suspended",
    };

    const translationKey = statusTranslationMap[statusLower];
    const statusText = translationKey
      ? t.organizations.status[translationKey]
      : config.text;

    return (
      <div className={`px-2 py-1 ${config.bgColor} rounded-md`}>
        <Typography
          variant="xs-regular-inter"
          className={`text-xs font-medium ${config.textColor}`}
        >
          {statusText}
        </Typography>
      </div>
    );
  };

  if (isLoadingOrg) {
    return <OrganizationFormSkeleton />;
  }

  if (orgError || !organization) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Typography
            variant="lg-black-inter"
            className="text-2xl font-semibold text-[#1D2939] dark:text-white mb-2"
          >
            {t.organizations.errors.organizationNotFound}
          </Typography>
          <Typography
            variant="sm-regular-inter"
            className="text-sm text-[#8A8A8A] dark:text-gray-400 mb-4"
          >
            {t.organizations.errors.organizationNotFoundDescription}
          </Typography>
          <Link href={localePath("/organizations/my")}>
            <Button variant="filled" size="sm">
              {t.organizations.form.backToOrganizations}
            </Button>
          </Link>
        </div>
      </div>
    );
  }


  if (organization.owner._id !== session.user?._id) {
    toast.error("You are not authorized to edit this organization");
    router.push(localePath("/organizations/my"));
    return null;
  }

  return (
    <Container1080>
      {/* Header */}

      <MobileStickyHeader title="Edit Organization" />
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
          variant="md-black-inter"
          className="text-xl font-semibold text-[#1D2939] dark:text-white mb-2"
        >
          {t.organizations.form.editOrganization}
        </Typography>
        <Typography
          variant="sm-regular-inter"
          className="text-sm text-[#8A8A8A] dark:text-gray-400"
        >
          {t.organizations.form.updateDetails}
        </Typography>
      </div>

      <div className="px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <OrganizationForm
            isEdit
            initialData={organization}
            onSubmit={onSubmit}
            isLoading={updateOrganizationMutation.isPending}
          />
        </div>

        {/* Organizations List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-[#E5E5E5] dark:border-gray-800 p-4 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <Typography
                variant="md-semibold-inter"
                className="text-base font-semibold text-[#1D2939] dark:text-gray-100"
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
                    className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded"
                  />
                ))}
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                <Typography
                  variant="xs-regular-inter"
                    className="text-xs text-[#8A8A8A] dark:text-gray-400"
                >
                  {t.organizations.form.noOrganizationsYet}
                </Typography>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {organizations.slice(0, 5).map((org) => (
                  <div
                    key={org._id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-purple/20"
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
                        <div className="w-10 h-10 bg-purple/20 dark:bg-purple/10 rounded-full flex items-center justify-center flex-shrink-0">
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
                        className="text-xs font-semibold text-[#1D2939] dark:text-gray-100 truncate"
                      >
                        {org.tradeName || org.legalName}
                      </Typography>
                      <Typography
                        variant="xs-regular-inter"
                        className="text-xs text-[#8A8A8A] dark:text-gray-400 truncate"
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

export default EditOrganizationPage;
