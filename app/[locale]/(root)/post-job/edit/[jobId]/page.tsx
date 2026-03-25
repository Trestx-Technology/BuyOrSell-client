"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategoryById } from "@/hooks/useCategories";
import { useUpdateAd, useAdById } from "@/hooks/useAds";
import { useMyOrganization } from "@/hooks/useOrganizations";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { PostAdPayload } from "@/interfaces/ad";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { TextInput } from "@/app/[locale]/(root)/post-ad/details/_components/TextInput";
import { TextareaInput } from "@/app/[locale]/(root)/post-ad/details/_components/TextareaInput";
import { NumberInput } from "@/app/[locale]/(root)/post-ad/details/_components/NumberInput";
import { MapComponent } from "@/app/[locale]/(root)/post-ad/details/_components/MapComponent";
import { Field } from "@/interfaces/categories.types";
import {
  DynamicFieldRenderer,
  FormValues,
} from "@/app/[locale]/(root)/post-ad/details/_components/DynamicFieldRenderer";
import { SelectInput } from "@/app/[locale]/(root)/post-ad/details/_components/SelectInput";
import { FormSkeleton } from "@/app/[locale]/(root)/post-ad/details/_components/FormSkeleton";
import {
  createPostJobSchema,
  type AddressFormValue,
} from "@/schemas/post-ad.schema";
import {
  getFieldOptions,
  shouldShowField,
} from "@/validations/post-ad.validation";
import { AD_SYSTEM_FIELDS } from "@/constants/ad.constants";
import { removeUndefinedFields } from "@/utils/remove-undefined-fields";
import { Typography } from "@/components/typography";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";
import { toast } from "sonner";

export default function EditJobPage() {
  const { localePath, locale } = useLocale();
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const { session } = useAuthStore((state) => state);
  const updateAdMutation = useUpdateAd();

  // Fetch Existing Job (Ad of type JOB)
  const {
    data: adResponse,
    isLoading: isAdLoading,
    error: adError,
  } = useAdById(jobId);
  const existingJob = adResponse?.data;

  // Determine Category ID
  const categoryId = useMemo(() => {
    if (!existingJob?.category) return null;
    return typeof existingJob.category === "string"
      ? existingJob.category
      : existingJob.category._id;
  }, [existingJob]);

  // Fetch category by ID
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useCategoryById(categoryId || "");

  const category = categoryData?.data;

  // Fetch organizations
  const { data: organizationsData } = useMyOrganization();
  const organizations = organizationsData?.data || [];

  // Build dynamic Zod schema based on category fields
  const formSchema = useMemo(() => {
    return createPostJobSchema(category);
  }, [category]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: category ? zodResolver(formSchema as any) : undefined,
    defaultValues: {
      minSalary: 0,
      maxSalary: 0,
      address: { address: "" },
    },
    mode: "onChange",
  });

  // Compute initial location synchronously
  const initialAdLocation = useMemo(() => {
    if (!existingJob) return null;
    const rawAddr = existingJob.address || existingJob.location;
    if (!rawAddr) return null;

    if (typeof rawAddr === "string") {
      return {
        address: rawAddr,
        coordinates: { lat: 0, lng: 0 },
      };
    } else {
      let coords = { lat: 0, lng: 0 };
      if (
        Array.isArray(rawAddr.coordinates) &&
        rawAddr.coordinates.length === 2
      ) {
        coords = {
          lng: rawAddr.coordinates[0],
          lat: rawAddr.coordinates[1],
        };
      }

      if (rawAddr.address) {
        return {
          address: rawAddr.address,
          coordinates: coords,
        };
      }
    }
    return null;
  }, [existingJob]);

  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(initialAdLocation);

  // Populate form with existing job data
  useEffect(() => {
    if (existingJob && category) {
      const defaultValues: any = {
        title: existingJob.title,
        description: existingJob.description,
        minSalary: existingJob.minSalary || 0,
        maxSalary: existingJob.maxSalary || 0,
        jobMode: existingJob.jobMode,
        jobShift: existingJob.jobShift,
        phoneNumber: existingJob.contactPhoneNumber || existingJob.owner?.phoneNo,
        organization: existingJob.organization?._id || "individual",
        connectionTypes: existingJob.connectionTypes || ["chat", "call", "whatsapp"],
        
        // Map Address
        address: (() => {
          const addr = existingJob.address || existingJob.location;
          if (!addr) return { address: "" };
          if (typeof addr === "string") return { address: addr };
          return {
            ...addr,
            address: addr.address || "",
          };
        })(),
      };

      if (initialAdLocation) {
        setSelectedLocation(initialAdLocation);
      }

      // Map Extra Fields
      if (existingJob.extraFields) {
        if (Array.isArray(existingJob.extraFields)) {
          existingJob.extraFields.forEach((field: any) => {
            defaultValues[field.name] = field.value;
          });
        } else if (typeof existingJob.extraFields === "object") {
          Object.entries(existingJob.extraFields).forEach(([key, value]) => {
            defaultValues[key] = value;
          });
        }
      }

      reset(defaultValues);
    }
  }, [existingJob, category, reset, initialAdLocation]);

  // Ownership Check
  useEffect(() => {
    if (!isAdLoading && existingJob && session?.user?._id) {
      const ownerId =
        typeof existingJob.owner === "string"
          ? existingJob.owner
          : existingJob.owner?._id;
      if (ownerId && ownerId !== session.user._id) {
        toast.error("You are not authorized to edit this job");
        router.push(localePath("/"));
      }
    }
  }, [existingJob, session, isAdLoading, router, localePath]);

  // Handle input change
  const handleInputChange = (field: string, value: any) => {
    setValue(field as keyof FormValues, value as FormValues[keyof FormValues], {
      shouldValidate: true,
    });

    if (category?.fields) {
      category.fields.forEach((f: Field) => {
        if (f.dependsOn === field) {
          setValue(
            f.name as keyof FormValues,
            "" as FormValues[keyof FormValues],
            { shouldValidate: false },
          );
        }
      });
    }
  };

  const formValues = watch();

  // Handle location select
  const handleLocationSelect = (location: {
    address: string;
    coordinates: { lat: number; lng: number };
    state?: string;
    country?: string;
    zipCode?: string;
    city?: string;
    street?: string;
  }) => {
    setSelectedLocation({
      address: location.address,
      coordinates: location.coordinates,
    });

    const addressObj = {
      address: location.address,
      coordinates: [location.coordinates.lng, location.coordinates.lat],
      state: location.state || "",
      country: location.country || "",
      zipCode: location.zipCode || "",
      city: location.city || "",
      street: location.street || "",
      type: "Point",
    };

    handleInputChange("address", addressObj);
  };

  // Render field
  const renderField = (field: Field) => {
    if (!shouldShowField(field, formValues)) {
      return null;
    }

    const options = getFieldOptions(field, formValues, locale);

    return (
      <DynamicFieldRenderer
        key={field.name}
        field={field}
        control={control}
        errors={errors}
        options={options}
        formValues={formValues}
        onInputChange={handleInputChange}
        selectedLocation={selectedLocation || initialAdLocation || null}
        onLocationSelect={handleLocationSelect}
      />
    );
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    const addressData = (data.address as AddressFormValue) || {};

    const extraFields: Array<{
      name: string;
      type: string;
      value: string | string[];
      optionalArray?: string[];
    }> = [];

    if (category?.fields) {
      category.fields.forEach((field: Field) => {
        if (
          !AD_SYSTEM_FIELDS.includes(
            field.name as (typeof AD_SYSTEM_FIELDS)[number],
          ) &&
          !["minSalary", "maxSalary", "jobMode", "jobShift"].includes(field.name) &&
          data[field.name] !== undefined &&
          data[field.name] !== null &&
          data[field.name] !== ""
        ) {
          const fieldValue = data[field.name];
          extraFields.push({
            name: field.name,
            type: field.type,
            value: fieldValue as string | string[],
            optionalArray: field.optionalArray || [],
          });
        }
      });
    }

    const organizationValue = (data.organization as string) || "";
    const isIndividual = organizationValue === "individual";

    const payload: Partial<PostAdPayload> = {
      title: (data.title as string) || "",
      description: (data.description as string) || "",
      minSalary: (data.minSalary as number) || 0,
      maxSalary: (data.maxSalary as number) || 0,
      jobMode: (data.jobMode as string) || "",
      jobShift: (data.jobShift as string) || "",
      contactPhoneNumber: (data.phoneNumber as string) || "",
      connectionTypes: (data.connectionTypes as any) || ["chat", "call", "whatsapp"],
      address: {
        state: addressData.state || "",
        country: addressData.country || "",
        zipCode: addressData.zipCode || "",
        city: addressData.city || "",
        address: addressData.address || null,
        coordinates: Array.isArray(addressData.coordinates)
          ? addressData.coordinates
          : null,
      },
      extraFields: extraFields,
      adType: "JOB",
      ...(isIndividual ? {} : { organizationId: organizationValue }),
    };

    removeUndefinedFields(payload);

    try {
      await updateAdMutation.mutateAsync({ id: jobId, payload });
      toast.success("Job updated successfully!");
      router.push(localePath(`/jobs/listing/${jobId}`));
    } catch (error: unknown) {
      console.error("Error updating job", error);
    }
  };

  if (isAdLoading || isCategoryLoading) {
    return <FormSkeleton />;
  }

  if (adError || !existingJob) {
    return (
      <section className="h-full w-full max-w-[888px] mx-auto">
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Failed to load job details</p>
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </section>
    );
  }

  return (
    <GoogleMapsProvider>
      <section className="w-full max-w-[888px] mx-auto relative">
        <div className="flex h-full gap-10 relative">
          <div className="w-full space-y-6 h-full pb-24">
            <div>
              <Typography variant="h2" className="text-lg font-semibold text-[#1D2939] dark:text-white mb-2">
                Edit Job
              </Typography>
              <p className="text-sm text-[#8A8A8A] dark:text-gray-400">
                Update the details of your job vacancy
              </p>
            </div>

            {/* Organization Selection */}
            <FormField label="Organization" htmlFor="organization" required error={errors.organization?.message as string}>
              <Controller
                name="organization"
                control={control}
                rules={{ required: "Organization selection is required" }}
                render={({ field }) => {
                  const organizationOptions = [
                    { value: "individual", label: "Post as Individual", disabled: true },
                    ...organizations.map((org) => ({
                      value: org._id,
                      label: `${org.tradeName || org.legalName}${org.verified ? " (Verified)" : ""}`,
                      icon: org.logoUrl,
                    })),
                  ];

                  return (
                    <SelectInput
                      value={field.value as string}
                      onChange={(value) => {
                        field.onChange(value);
                        handleInputChange("organization", value);
                      }}
                      options={organizationOptions}
                      placeholder="Select organization"
                    />
                  );
                }}
              />
            </FormField>

            {/* Title */}
            <FormField label="Job Title" htmlFor="title" required error={errors.title?.message as string}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Job title is required" }}
                render={({ field }) => (
                  <TextInput
                    value={(field.value as string) || ""}
                    onChange={(val) => {
                      field.onChange(val);
                      handleInputChange("title", val);
                    }}
                    placeholder="Enter job title"
                  />
                )}
              />
            </FormField>

            {/* Description */}
            <FormField label="Job Description" htmlFor="description" required error={errors.description?.message as string} fullWidth>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Job description is required" }}
                render={({ field }) => (
                  <TextareaInput
                    value={(field.value as string) || ""}
                    onChange={(val) => {
                      field.onChange(val);
                      handleInputChange("description", val);
                    }}
                    placeholder="Enter job description"
                    rows={6}
                    maxLength={10000}
                    showAI={true}
                  />
                )}
              />
            </FormField>

            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Min Salary (AED)" htmlFor="minSalary" required error={errors.minSalary?.message as string}>
                <Controller
                  name="minSalary"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      value={(field.value as number) || 0}
                      onChange={(val) => {
                        field.onChange(val);
                        handleInputChange("minSalary", val);
                      }}
                      min={0}
                    />
                  )}
                />
              </FormField>
              <FormField label="Max Salary (AED)" htmlFor="maxSalary" required error={errors.maxSalary?.message as string}>
                <Controller
                  name="maxSalary"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      value={(field.value as number) || 0}
                      onChange={(val) => {
                        field.onChange(val);
                        handleInputChange("maxSalary", val);
                      }}
                      min={0}
                    />
                  )}
                />
              </FormField>
            </div>

            {/* Mode & Shift */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Job Mode" htmlFor="jobMode" required error={errors.jobMode?.message as string}>
                <Controller
                  name="jobMode"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      value={field.value as string}
                      onChange={(val) => handleInputChange("jobMode", val)}
                      options={[
                        { value: "on-site", label: "On-Site" },
                        { value: "remote", label: "Remote" },
                        { value: "hybrid", label: "Hybrid" },
                      ]}
                    />
                  )}
                />
              </FormField>
              <FormField label="Job Shift" htmlFor="jobShift" required error={errors.jobShift?.message as string}>
                <Controller
                  name="jobShift"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      value={field.value as string}
                      onChange={(val) => handleInputChange("jobShift", val)}
                      options={[
                        { value: "Day", label: "Day" },
                        { value: "Night", label: "Night" },
                        { value: "Rotational", label: "Rotational" },
                      ]}
                    />
                  )}
                />
              </FormField>
            </div>

            {/* Dynamic Fields */}
            {category?.fields?.map((field) => renderField(field))}

            {/* Address */}
            <FormField label="Job Location" htmlFor="address" required error={errors.address?.message as string} fullWidth>
              <Controller
                name="address"
                control={control}
                render={() => (
                  <MapComponent
                    onLocationSelect={handleLocationSelect}
                    initialLocation={selectedLocation || initialAdLocation || undefined}
                  />
                )}
              />
            </FormField>

            {/* Phone Number */}
            <FormField label="Contact Phone Number" htmlFor="phoneNumber" required error={errors.phoneNumber?.message as string}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextInput
                    value={(field.value as string) || ""}
                    onChange={(val) => handleInputChange("phoneNumber", val)}
                    placeholder="Enter phone number"
                  />
                )}
              />
            </FormField>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button onClick={handleSubmit(onSubmit)} disabled={updateAdMutation.isPending} className="w-full md:w-auto px-12">
                {updateAdMutation.isPending ? "Updating..." : "Update Job"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </GoogleMapsProvider>
  );
}
