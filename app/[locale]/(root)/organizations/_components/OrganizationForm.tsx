"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { TextInput } from "@/app/[locale]/(root)/post-ad/details/_components/TextInput";
import { SelectInput } from "@/app/[locale]/(root)/post-ad/details/_components/SelectInput";
import { TextareaInput } from "@/app/[locale]/(root)/post-ad/details/_components/TextareaInput";
import { DatePicker } from "./DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SingleImageUpload, SingleImageItem } from "./SingleImageUpload";
import { BusinessHoursInput } from "./BusinessHoursInput";
import { CertificatesInput } from "./CertificatesInput";
import { ChipsInput } from "@/components/ui/chips-input";
import { Typography } from "@/components/typography";
import { OrganizationType, ORGANIZATION_TYPE_OPTIONS } from "@/constants/enums";
import { COUNTRY_OPTIONS } from "@/constants/country.constants";
import {
  organizationSchema,
  type OrganizationFormData,
} from "@/schemas/organization.schema";
import { useLocale } from "@/hooks/useLocale";
import { Organization } from "@/interfaces/organization.types";
import { useEmirates, useCountries } from "@/hooks/useLocations";
import { cn } from "@/lib/utils";

export interface OrganizationFormProps {
  initialData?: Organization;
  onSubmit: (data: OrganizationFormData) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  isEdit?: boolean;
}

export const OrganizationForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText,
  isEdit = false,
}: OrganizationFormProps) => {
  const { locale, t } = useLocale();
  const { data: emirates = [], isLoading: isLoadingEmirates } = useEmirates();
  const { data: countries = [], isLoading: isLoadingCountries } =
    useCountries();
  const [logoImage, setLogoImage] = useState<SingleImageItem | null>(null);
  const [tradeLicenseImage, setTradeLicenseImage] =
    useState<SingleImageItem | null>(null);
  const [ownerDocImage, setOwnerDocImage] = useState<SingleImageItem | null>(
    null,
  );
  const [poaImage, setPoaImage] = useState<SingleImageItem | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const emirateOptions = emirates.map((emirate) => ({
    value: emirate.emirate,
    label: locale === "ar" ? emirate.emirateAr : emirate.emirate,
  }));

  // Merge static COUNTRY_OPTIONS with dynamic data from hook
  // Use a map to ensure unique values by country code
  const countryOptionsMap = new Map();

  // Add static options first
  COUNTRY_OPTIONS.forEach((option) => {
    countryOptionsMap.set(option.value, {
      value: option.value,
      label: locale === "ar" ? option.labelAr : option.label,
    });
  });

  // Supplement with dynamic data from API if available
  if (countries.length > 0) {
    countries.forEach((c) => {
      // If code already exists, the static label might be better/translated
      // But if it's new, add it
      if (!countryOptionsMap.has(c.country)) {
        countryOptionsMap.set(c.country, {
          value: c.country,
          label: locale === "ar" ? c.countryAr : c.country,
        });
      }
    });
  }

  const countryOptions = Array.from(countryOptionsMap.values()).sort((a, b) => {
    // Keep UAE at the top
    if (a.value === "AE") return -1;
    if (b.value === "AE") return 1;
    return a.label.localeCompare(b.label);
  });

  const filteredCountryOptions = countryOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
      option.value.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      country: "AE",
      type: undefined,
      emirate: "",
      tradeLicenseNumber: "",
      tradeLicenseExpiry: "",
      tradeLicenseUrl: "",
      ownerDocUrl: "",
      poaUrl: "",
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
      description: "",
      businessHours: [],
      certificates: [],
      languages: [],
    },
  });

  // Update logoUrl when image is uploaded
  useEffect(() => {
    if (logoImage?.presignedUrl)
      setValue("logoUrl", logoImage.presignedUrl, { shouldValidate: true });
  }, [logoImage, setValue]);

  useEffect(() => {
    if (tradeLicenseImage?.presignedUrl)
      setValue("tradeLicenseUrl", tradeLicenseImage.presignedUrl, {
        shouldValidate: true,
      });
  }, [tradeLicenseImage, setValue]);

  useEffect(() => {
    if (ownerDocImage?.presignedUrl)
      setValue("ownerDocUrl", ownerDocImage.presignedUrl, {
        shouldValidate: true,
      });
  }, [ownerDocImage, setValue]);

  useEffect(() => {
    if (poaImage?.presignedUrl)
      setValue("poaUrl", poaImage.presignedUrl, { shouldValidate: true });
    else if (poaImage === null)
      setValue("poaUrl", "", { shouldValidate: true });
  }, [poaImage, setValue]);

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData && !isLoadingEmirates && emirates.length > 0) {
      // Set logo image if exists
      if (initialData.logoUrl) {
        setLogoImage({
          id: "logo",
          url: initialData.logoUrl,
          presignedUrl: initialData.logoUrl,
        });
      }

      if (initialData.tradeLicenseUrl) {
        setTradeLicenseImage({
          id: "trade-license",
          url: initialData.tradeLicenseUrl,
          presignedUrl: initialData.tradeLicenseUrl,
        });
      }

      if (initialData.ownerDocUrl) {
        setOwnerDocImage({
          id: "owner-docs",
          url: initialData.ownerDocUrl,
          presignedUrl: initialData.ownerDocUrl,
        });
      }

      if (initialData.poaUrl) {
        setPoaImage({
          id: "poa",
          url: initialData.poaUrl,
          presignedUrl: initialData.poaUrl,
        });
      }

      // Transform business hours from API format to form format
      const businessHours =
        initialData.businessHours?.map((bh: any) => {
          const dayValue =
            typeof bh.day === "string" ? parseInt(bh.day) : (bh.day as number);
          return {
            day: dayValue === 0 ? 7 : dayValue, // Map Sunday (0) to 7
            open: bh.open || "09:00",
            close: bh.close || "18:00",
            closed: bh.isClosed ?? bh.closed ?? false,
            allDay: bh.allDay || false,
          };
        }) || [];

      // Transform certificates from API format to form format
      const certificates =
        initialData.certificates?.map((cert) => ({
          name: cert.name,
          issuer: cert.issuer,
          issuedOn: cert.issuedOn,
          expiresOn: cert.expiresOn || "",
          fileId: cert.fileId || "",
          url: cert.url || "",
        })) || [];

      // Ensure organization type matches enum value exactly
      const orgType = initialData.type?.toUpperCase();
      const validType =
        orgType &&
        Object.values(OrganizationType).includes(orgType as OrganizationType)
          ? (orgType as OrganizationType)
          : undefined;

      // Ensure emirate value matches one of the available options
      const validEmirate = initialData.emirate
        ? emirates.find(
            (e) =>
              e.emirate.toLowerCase() === initialData.emirate?.toLowerCase(),
          )?.emirate || ""
        : "";

      reset({
        type: validType,
        country: initialData.country || "AE",
        emirate: validEmirate,
        tradeLicenseNumber: initialData.tradeLicenseNumber || "",
        tradeLicenseExpiry: initialData.tradeLicenseExpiry || "",
        tradeLicenseUrl: initialData.tradeLicenseUrl || "",
        ownerDocUrl: initialData.ownerDocUrl || "",
        poaUrl: initialData.poaUrl || "",
        trn: initialData.trn || "",
        legalName: initialData.legalName || "",
        tradeName: initialData.tradeName || "",
        reraNumber: initialData.reraNumber || "",
        addressLine1: initialData.addressLine1 || "",
        addressLine2: initialData.addressLine2 || "",
        city: initialData.city || "",
        poBox: initialData.poBox || "",
        contactName: initialData.contactName || "",
        contactEmail: initialData.contactEmail || "",
        contactPhone: initialData.contactPhone || "",
        website: initialData.website || "",
        logoUrl: initialData.logoUrl || "",
        description: initialData.description || "",
        businessHours,
        certificates,
        languages: initialData.languages || [],
      });

      // Secondary update for selects after potential reset async behavior
      setTimeout(() => {
        if (validType) setValue("type", validType);
        if (validEmirate) setValue("emirate", validEmirate);
      }, 0);
    }
  }, [initialData, reset, emirates, isLoadingEmirates, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-gray-900 rounded-lg border border-[#E5E5E5] dark:border-gray-800 p-6 space-y-6"
    >
      {/* Basic Information */}
      <div>
        <Typography
          variant="md-semibold-inter"
          className="text-lg font-semibold text-[#1D2939] dark:text-gray-100 mb-4"
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
                    placeholder={t.organizations.form.selectOrganizationType}
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
                  <Popover open={isCountryOpen} onOpenChange={setIsCountryOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full h-12 flex items-center justify-between bg-white dark:bg-gray-900",
                          "border-[#D8B1FF] rounded-lg px-3 text-[#8B31E1] dark:text-[#D8B1FF] text-xs font-medium border",
                          "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                          errors.country && "border-red-500",
                          isLoadingCountries && "opacity-50 cursor-not-allowed",
                        )}
                        disabled={isLoadingCountries}
                      >
                        <span>
                          {countryOptions.find(
                            (opt) => opt.value === field.value,
                          )?.label || t.organizations.form.selectCountry}
                        </span>
                        <Search className="size-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 w-[var(--radix-popover-trigger-width)] bg-white dark:bg-gray-900 border-[#D8B1FF] dark:border-purple/50 overflow-hidden"
                      align="start"
                    >
                      <div className="p-2 border-b dark:border-gray-800">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                          <input
                            autoFocus
                            placeholder={t.common.search}
                            className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 rounded-md outline-none focus:ring-1 focus:ring-purple/30 dark:text-gray-200"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountryOptions.length > 0 ? (
                          filteredCountryOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className={cn(
                                "w-full text-left px-3 py-2 text-xs transition-colors",
                                "hover:bg-purple/10 dark:hover:bg-purple/20",
                                field.value === option.value
                                  ? "bg-purple/10 text-purple font-medium"
                                  : "text-gray-700 dark:text-gray-300",
                              )}
                              onClick={() => {
                                field.onChange(option.value);
                                if (option.value !== "AE") {
                                  setValue("emirate", "");
                                }
                                setIsCountryOpen(false);
                                setCountrySearch("");
                              }}
                            >
                              {option.label}
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-xs text-gray-500">
                            No country found
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </FormField>
          </div>

          {watch("country") === "AE" && (
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
                    value={field.value || ""}
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
          )}

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
          className="text-lg font-semibold text-[#1D2939] dark:text-gray-100 mb-4"
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
                    placeholder={t.organizations.form.enterTradeLicenseNumber}
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
                    allowFutureDates={true}
                  />
                )}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label={t.organizations.form.trn}
              htmlFor="trn"
              error={errors.trn?.message}
            >
              <Controller
                name="trn"
                control={control}
                render={({ field }) => (
                  <TextInput
                    value={field.value || ""}
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
          className="text-lg font-semibold text-[#1D2939] dark:text-gray-100 mb-4"
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
          className="text-lg font-semibold text-[#1D2939] dark:text-gray-100 mb-4"
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
          className="text-lg font-semibold text-[#1D2939] dark:text-gray-100 mb-4"
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

          {/* Documents Upload */}
          <FormField
            label="Trade License Image"
            htmlFor="tradeLicenseUrl"
            required
            error={errors.tradeLicenseUrl?.message}
          >
            <SingleImageUpload
              image={tradeLicenseImage}
              onImageChange={setTradeLicenseImage}
              maxFileSize={10}
              acceptedFileTypes={["image/jpeg", "image/png"]}
              label="Upload Trade License"
            />
          </FormField>

          <FormField
            label="Owner Documents"
            htmlFor="ownerDocUrl"
            required
            error={errors.ownerDocUrl?.message}
          >
            <SingleImageUpload
              image={ownerDocImage}
              onImageChange={setOwnerDocImage}
              maxFileSize={10}
              acceptedFileTypes={["application/pdf"]}
              label="Upload Owner Docs"
            />
          </FormField>

          <FormField
            label="POA (if applicable)"
            htmlFor="poaUrl"
            error={errors.poaUrl?.message}
          >
            <SingleImageUpload
              image={poaImage}
              onImageChange={setPoaImage}
              maxFileSize={10}
              acceptedFileTypes={["image/jpeg", "image/png", "application/pdf"]}
              label="Upload POA"
            />
          </FormField>

          {/* Description */}
          <FormField
            label={t.organizations.form.description || "Description"}
            htmlFor="description"
            error={errors.description?.message}
            fullWidth
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextareaInput
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={
                    t.organizations.form.enterDescription ||
                    "Describe your organization..."
                  }
                  rows={5}
                  showAI={true}
                  categoryPath={`Organization > ${watch("type") || "About"}`}
                />
              )}
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
                  options={[
                    { value: "English", label: "English" },
                    { value: "Arabic", label: "Arabic" },
                    { value: "French", label: "French" },
                    { value: "Spanish", label: "Spanish" },
                    { value: "Hindi", label: "Hindi" },
                    { value: "Urdu", label: "Urdu" },
                    { value: "Bengali", label: "Bengali" },
                    { value: "Tagalog", label: "Tagalog" },
                  ]}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder={t.organizations.form.addLanguages}
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
          disabled={isSubmitting || isLoading}
          isLoading={isSubmitting || isLoading}
        >
          {submitButtonText ||
            (isSubmitting
              ? isEdit
                ? t.organizations.form.updating
                : t.organizations.form.creating
              : isEdit
                ? t.organizations.form.updateOrganization
                : t.organizations.form.createOrganization)}
        </Button>
      </div>
    </form>
  );
};
