"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateOrganization,
  useMyOrganization,
} from "@/hooks/useOrganizations";
import { CreateOrganizationPayload } from "@/interfaces/organization.types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormField } from "@/app/(root)/post-ad/details/_components/FormField";
import { TextInput } from "@/app/(root)/post-ad/details/_components/TextInput";
import { SelectInput } from "@/app/(root)/post-ad/details/_components/SelectInput";
import { DatePicker } from "../_components/DatePicker";
import {
  SingleImageUpload,
  SingleImageItem,
} from "../_components/SingleImageUpload";
import { BusinessHoursInput } from "../_components/BusinessHoursInput";
import { CertificatesInput } from "../_components/CertificatesInput";
import { ChipsInput } from "@/components/ui/chips-input";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { Organization } from "@/interfaces/organization.types";
import {
  ORGANIZATION_TYPE_OPTIONS,
  ORGANIZATION_STATUS_CONFIG,
  OrganizationStatus,
} from "@/constants/enums";
import { useEmirates } from "@/hooks/useLocations";
import { useRouter } from "nextjs-toploader/app";
import {
  organizationSchema,
  type OrganizationFormData,
} from "@/schemas/organization.schema";
import { OrganizationFormSkeleton } from "../_components/OrganizationFormSkeleton";
import { useLocale } from "@/hooks/useLocale";

const NewOrganizationPage = () => {
  const router = useRouter();
  const { session } = useAuthStore((state) => state);
  const createOrganizationMutation = useCreateOrganization();
  const { data: organizationsData, isLoading: isLoadingOrgs } =
    useMyOrganization();
  const organizations = organizationsData?.data || [];
  const { data: emirates = [], isLoading: isLoadingEmirates } = useEmirates();
  const [logoImage, setLogoImage] = useState<SingleImageItem | null>(null);
  const { locale, t, localePath } = useLocale();

  const emirateOptions = emirates.map((emirate) => ({
    value: emirate.emirate, // Use English name as value for consistency
    label: locale === "ar" ? emirate.emirateAr : emirate.emirate, // Show localized label
  }));

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      country: "AE",
      type: undefined,
      emirate: "",
      tradeLicenseNumber: "",
      tradeLicenseExpiry: "",
      trn: "",
      legalName: "",
      tradeName: "",
      reraNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      poBox: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      logoUrl: "",
      businessHours: [],
      certificates: [],
      languages: [],
      brands: [],
      dealershipCodes: [],
    },
  });

  // Update logoUrl when image is uploaded
  React.useEffect(() => {
    if (logoImage?.presignedUrl) {
      setValue("logoUrl", logoImage.presignedUrl);
    }
  }, [logoImage, setValue]);

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
        trn: data.trn,
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
        logoUrl: data.logoUrl || undefined,
        businessHours:
          data.businessHours?.map((bh) => ({
            day: bh.day.toString(),
            open: bh.open,
            close: bh.close,
            isClosed: bh.closed,
            allDay: bh.allDay,
          })) || undefined,
        certificates:
          data.certificates?.map((cert) => ({
            name: cert.name,
            issuedBy: cert.issuer,
            issueDate: cert.issuedOn,
            expiryDate: cert.expiresOn || undefined,
            certificateUrl: cert.url || undefined,
          })) || undefined,
        languages:
          data.languages && data.languages.length > 0
            ? data.languages
            : undefined,
        brands: data.brands && data.brands.length > 0 ? data.brands : undefined,
        dealershipCodes:
          data.dealershipCodes && data.dealershipCodes.length > 0
            ? data.dealershipCodes
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

  // Show skeleton while emirates are loading
  if (isLoadingEmirates) {
    return <OrganizationFormSkeleton />;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={localePath("/organizations/my")}
          className="inline-flex items-center gap-2 text-purple hover:text-purple/80 mb-4"
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg border border-[#E5E5E5] p-6 space-y-6"
          >
            {/* Basic Information */}
            <div>
              <Typography
                variant="md-semibold-inter"
                className="text-lg font-semibold text-[#1D2939] mb-4"
              >
                {t.organizations.form.basicInformation}
              </Typography>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t.organizations.form.organizationType}
                    htmlFor="type"
                    required
                    error={errors.type?.message}
                  >
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          value={field.value}
                          onChange={field.onChange}
                          options={ORGANIZATION_TYPE_OPTIONS}
                          placeholder={
                            t.organizations.form.selectOrganizationType
                          }
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label={t.organizations.form.country}
                    htmlFor="country"
                    required
                    error={errors.country?.message}
                  >
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.country}
                          disabled
                        />
                      )}
                    />
                  </FormField>
                </div>

                <FormField
                  label={t.organizations.form.emirate}
                  htmlFor="emirate"
                  required
                  error={errors.emirate?.message}
                >
                  <Controller
                    name="emirate"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        value={field.value}
                        onChange={field.onChange}
                        options={emirateOptions}
                        placeholder={
                          isLoadingEmirates
                            ? t.organizations.form.loadingEmirates
                            : t.organizations.form.selectEmirate
                        }
                        disabled={isLoadingEmirates}
                      />
                    )}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t.organizations.form.legalName}
                    htmlFor="legalName"
                    required
                    error={errors.legalName?.message}
                  >
                    <Controller
                      name="legalName"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.enterLegalName}
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label={t.organizations.form.tradeName}
                    htmlFor="tradeName"
                    required
                    error={errors.tradeName?.message}
                  >
                    <Controller
                      name="tradeName"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.enterTradeName}
                        />
                      )}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* License Information */}
            <div>
              <Typography
                variant="md-semibold-inter"
                className="text-lg font-semibold text-[#1D2939] mb-4"
              >
                {t.organizations.form.licenseInformation}
              </Typography>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t.organizations.form.tradeLicenseNumber}
                    htmlFor="tradeLicenseNumber"
                    required
                    error={errors.tradeLicenseNumber?.message}
                  >
                    <Controller
                      name="tradeLicenseNumber"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={
                            t.organizations.form.enterTradeLicenseNumber
                          }
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label={t.organizations.form.tradeLicenseExpiry}
                    htmlFor="tradeLicenseExpiry"
                    required
                    error={errors.tradeLicenseExpiry?.message}
                  >
                    <Controller
                      name="tradeLicenseExpiry"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.selectExpiryDate}
                        />
                      )}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t.organizations.form.trn}
                    htmlFor="trn"
                    required
                    error={errors.trn?.message}
                  >
                    <Controller
                      name="trn"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.enterTRN}
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label={t.organizations.form.reraNumber}
                    htmlFor="reraNumber"
                    error={errors.reraNumber?.message}
                  >
                    <Controller
                      name="reraNumber"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.enterRERANumber}
                        />
                      )}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <Typography
                variant="md-semibold-inter"
                className="text-lg font-semibold text-[#1D2939] mb-4"
              >
                {t.organizations.form.addressInformation}
              </Typography>
              <div className="space-y-4">
                <FormField
                  label={t.organizations.form.addressLine1}
                  htmlFor="addressLine1"
                  required
                  error={errors.addressLine1?.message}
                >
                  <Controller
                    name="addressLine1"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t.organizations.form.enterAddressLine1}
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label={t.organizations.form.addressLine2}
                  htmlFor="addressLine2"
                  error={errors.addressLine2?.message}
                >
                  <Controller
                    name="addressLine2"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder={t.organizations.form.enterAddressLine2}
                      />
                    )}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t.organizations.form.city}
                    htmlFor="city"
                    required
                    error={errors.city?.message}
                  >
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.enterCity}
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label={t.organizations.form.poBox}
                    htmlFor="poBox"
                    error={errors.poBox?.message}
                  >
                    <Controller
                      name="poBox"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.enterPOBox}
                        />
                      )}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <Typography
                variant="md-semibold-inter"
                className="text-lg font-semibold text-[#1D2939] mb-4"
              >
                {t.organizations.form.contactInformation}
              </Typography>
              <div className="space-y-4">
                <FormField
                  label={t.organizations.form.contactName}
                  htmlFor="contactName"
                  required
                  error={errors.contactName?.message}
                >
                  <Controller
                    name="contactName"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t.organizations.form.enterContactName}
                      />
                    )}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t.organizations.form.contactEmail}
                    htmlFor="contactEmail"
                    required
                    error={errors.contactEmail?.message}
                  >
                    <Controller
                      name="contactEmail"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.enterContactEmail}
                          type="email"
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label={t.organizations.form.contactPhone}
                    htmlFor="contactPhone"
                    required
                    error={errors.contactPhone?.message}
                  >
                    <Controller
                      name="contactPhone"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t.organizations.form.enterContactPhone}
                          type="tel"
                        />
                      )}
                    />
                  </FormField>
                </div>

                <FormField
                  label={t.organizations.form.website}
                  htmlFor="website"
                  error={errors.website?.message}
                >
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder={t.organizations.form.enterWebsiteURL}
                        type="url"
                      />
                    )}
                  />
                </FormField>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <Typography
                variant="md-semibold-inter"
                className="text-lg font-semibold text-[#1D2939] mb-4"
              >
                {t.organizations.form.additionalInformation}
              </Typography>
              <div className="space-y-6">
                {/* Logo Upload */}
                <FormField
                  label={t.organizations.form.organizationLogo}
                  htmlFor="logoUrl"
                  error={errors.logoUrl?.message}
                >
                  <SingleImageUpload
                    image={logoImage}
                    onImageChange={setLogoImage}
                    maxFileSize={5}
                    acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]}
                    label={t.organizations.form.uploadLogo}
                  />
                </FormField>

                {/* Business Hours */}
                <FormField
                  label={t.organizations.form.businessHours}
                  htmlFor="businessHours"
                  error={errors.businessHours?.message}
                >
                  <Controller
                    name="businessHours"
                    control={control}
                    render={({ field }) => (
                      <BusinessHoursInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormField>

                {/* Certificates */}
                <FormField
                  label={t.organizations.form.certificates}
                  htmlFor="certificates"
                  error={errors.certificates?.message}
                >
                  <Controller
                    name="certificates"
                    control={control}
                    render={({ field }) => (
                      <CertificatesInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormField>

                {/* Languages */}
                <FormField
                  label={t.organizations.form.languages}
                  htmlFor="languages"
                  error={errors.languages?.message}
                >
                  <Controller
                    name="languages"
                    control={control}
                    render={({ field }) => (
                      <ChipsInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder={t.organizations.form.addLanguages}
                        allowDuplicates={false}
                      />
                    )}
                  />
                </FormField>

                {/* Brands */}
                <FormField
                  label={t.organizations.form.brands}
                  htmlFor="brands"
                  error={errors.brands?.message}
                >
                  <Controller
                    name="brands"
                    control={control}
                    render={({ field }) => (
                      <ChipsInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder={t.organizations.form.addBrands}
                        allowDuplicates={false}
                      />
                    )}
                  />
                </FormField>

                {/* Dealership Codes */}
                <FormField
                  label={t.organizations.form.dealershipCodes}
                  htmlFor="dealershipCodes"
                  error={errors.dealershipCodes?.message}
                >
                  <Controller
                    name="dealershipCodes"
                    control={control}
                    render={({ field }) => (
                      <ChipsInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder={t.organizations.form.addDealershipCodes}
                        allowDuplicates={false}
                      />
                    )}
                  />
                </FormField>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="filled"
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t.organizations.form.creating
                  : t.organizations.form.createOrganization}
              </Button>
              <Link href={localePath("/organizations/my")}>
                <Button type="button" variant="outline" size="sm">
                  {t.organizations.form.cancel}
                </Button>
              </Link>
            </div>
          </form>
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
                        {getOrganizationType(org.type)} • {getLocation(org)}
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
    </div>
  );
};

export default NewOrganizationPage;
