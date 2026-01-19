"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategoryById } from "@/hooks/useCategories";
import { useCreateAd } from "@/hooks/useAds";
import { useMyOrganization } from "@/hooks/useOrganizations";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { PostAdPayload } from "@/interfaces/ad";
import { ImageGallery, ImageItem } from "@/app/[locale]/(root)/post-ad/details/_components/image-upload";
import { VideoUpload, type VideoItem } from "@/app/[locale]/(root)/post-ad/details/_components/video-upload";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { TextInput } from "@/app/[locale]/(root)/post-ad/details/_components/TextInput";
import { TextareaInput } from "@/app/[locale]/(root)/post-ad/details/_components/TextareaInput";
import { NumberInput } from "@/app/[locale]/(root)/post-ad/details/_components/NumberInput";
import { BooleanInput } from "@/app/[locale]/(root)/post-ad/details/_components/BooleanInput";
import { MultipleImageInput, ImageItem as MultipleImageItem } from "@/app/[locale]/(root)/post-ad/details/_components/MultipleImageInput";
import { MapComponent } from "@/app/[locale]/(root)/post-ad/details/_components/MapComponent";
import { CheckboxInput } from "@/app/[locale]/(root)/post-ad/details/_components/CheckboxInput";
import { Field } from "@/interfaces/categories.types";
import DateTimeInput from "@/app/[locale]/(root)/post-ad/details/_components/DateTimeInput";
import { DynamicFieldRenderer } from "@/app/[locale]/(root)/post-ad/details/_components/DynamicFieldRenderer";
import { SelectInput } from "@/app/[locale]/(root)/post-ad/details/_components/SelectInput";
import { FormSkeleton } from "@/app/[locale]/(root)/post-ad/details/_components/FormSkeleton";
import { createPostAdSchema, type AddressFormValue } from "@/schemas/post-ad.schema";
import { getFieldOptions, shouldShowField, isJobCategory } from "@/validations/post-ad.validation";
import { AD_SYSTEM_FIELDS } from "@/constants/ad.constants";
import { removeUndefinedFields } from "@/utils/remove-undefined-fields";

type FormValues = Record<string, string | number | boolean | string[] | MultipleImageItem[] | ImageItem[] | AddressFormValue>;

export default function JobLeafCategoryPage() {
      const { localePath } = useLocale();
      const { leafCategoryId } = useParams<{ leafCategoryId: string }>();
      const router = useRouter();
      const { session } = useAuthStore((state) => state);
      const { categoryArray } = useAdPostingStore((state) => state);
      const createAdMutation = useCreateAd();
      const [selectedLocation, setSelectedLocation] = useState<{
            address: string;
            coordinates: { lat: number; lng: number };
      } | null>(null);

      // Fetch category by ID
      const {
            data: categoryData,
            isLoading,
            error,
      } = useCategoryById(leafCategoryId as string);

      const category = categoryData?.data;

      // Fetch organizations
      const { data: organizationsData } = useMyOrganization();
      const organizations = organizationsData?.data || [];

      // Build dynamic Zod schema based on category fields
      const formSchema = useMemo(() => {
            return createPostAdSchema(category);
      }, [category]);

      const {
            control,
            handleSubmit,
            setValue,
            watch,
            trigger,
            formState: { errors, isValid, isSubmitting },
      } = useForm<FormValues>({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resolver: category ? zodResolver(formSchema as any) : undefined,
            defaultValues: {
                  images: [] as ImageItem[],
            },
            mode: "onChange",
      });

      // Handle input change (wrapper for setValue)
      const handleInputChange = (field: string, value: string | number | boolean | string[] | MultipleImageItem[] | AddressFormValue) => {
            setValue(field as keyof FormValues, value as FormValues[keyof FormValues], { shouldValidate: true });

            if (field === "price") {
                  trigger("discountedPrice");
            }

            if (category?.fields) {
                  category.fields.forEach((f: Field) => {
                        if (f.dependsOn === field) {
                              setValue(f.name as keyof FormValues, "" as FormValues[keyof FormValues], { shouldValidate: false });
                        }
                  });
            }
      };

      const formValues = watch();

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

      const renderField = (field: Field) => {
            if (!shouldShowField(field, formValues)) {
                  return null;
            }

            const options = getFieldOptions(field, formValues);

            return (
                  <DynamicFieldRenderer
                        key={field.name}
                        field={field}
                        control={control}
                        errors={errors}
                        options={options}
                        formValues={formValues}
                        onInputChange={handleInputChange}
                        selectedLocation={selectedLocation}
                        onLocationSelect={handleLocationSelect}
                  />
            );
      };

      const onSubmit = async (data: FormValues) => {
            const images = (data.images as ImageItem[]) || [];
            const imageUrls = images.map((img) => img.url || img.presignedUrl || "").filter(Boolean);

            const price = (data.price as number) || 0;
            const discountedPrice = (data.discountedPrice as number) || 0;
            const dealValidThru = (data.dealValidThru as string) || undefined;

            const isExchange = data.isExchange === true || data.isExchange === "true";
            const exchangeImages = (data.exchangeImages as MultipleImageItem[]) || [];
            const exchangeImageUrl = exchangeImages
                  .map((img) => {
                        const url = img.fileUrl || (img.url && !img.url.startsWith("blob:") ? img.url : null);
                        return url;
                  })
                  .filter((url): url is string => !!url)[0];
            const exchangeTitle = (data.exchangeTitle as string) || "";
            const exchangeDescription = (data.exchangeDescription as string) || "";

            const connectionTypes = Array.isArray(data.connectionTypes)
                  ? data.connectionTypes
                  : data.connectionTypes
                        ? [data.connectionTypes as string]
                        : [];

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
                                    field.name as (typeof AD_SYSTEM_FIELDS)[number]
                              ) &&
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

            // Always JOB for post-job flow
            const adType = "JOB";

            const payload: PostAdPayload = {
                  title: (data.title as string) || "",
                  description: (data.description as string) || "",
                  price: price,
                  stockQuantity: (data.stockQuantity as number) || 1,
                  availability: (data.availability as string) || "in-stock",
                  images: imageUrls,
                  videoUrl: (data.video as string) || undefined,
                  category: leafCategoryId as string,
                  owner: (session.user?._id as string) || "",
                  contactPhoneNumber: (data.phoneNumber as string) || "",
                  connectionTypes: connectionTypes as ("chat" | "call" | "whatsapp")[] | undefined,
                  deal: data.deal === true || data.deal === "true",
                  discountedPrice:
                        data.deal && discountedPrice > 0 ? discountedPrice : undefined,
                  dealValidThru:
                        data.deal && dealValidThru ? dealValidThru : undefined,
                  isExchangable: isExchange,
                  exchangeWith:
                        isExchange && exchangeTitle
                              ? {
                                    title: exchangeTitle,
                                    description: exchangeDescription || undefined,
                                    imageUrl: exchangeImageUrl || undefined,
                              }
                              : undefined,
                  address: {
                        state: addressData.state || "",
                        country: addressData.country || "",
                        zipCode: addressData.zipCode || "",
                        city: addressData.city || "",
                        address: addressData.address || null,
                        coordinates: Array.isArray(addressData.coordinates) ? addressData.coordinates : null,
                  },
                  relatedCategories: categoryArray.map((cat) => cat.name),
                  featuredStatus: data.isFeatured ? "live" : "created",
                  status: "created",
                  userType: "RERA_LANDLORD" as const,
                  tags: [],
                  documents: [],
                  extraFields: extraFields,
                  adType: adType,
                  ...(isIndividual ? {} : { organizationId: organizationValue }),
            };

            removeUndefinedFields(payload);

            try {
                  await createAdMutation.mutateAsync(payload);
                  router.push(localePath(`/post-job/success?status=success&title=Job posted successfully!`));
            } catch (error: unknown) {
                  console.error("Error creating job", error);
            }
      };

      if (isLoading) {
            return <FormSkeleton />;
      }

      if (error) {
            return (
                  <section className="h-full w-full max-w-[888px] mx-auto">
                        <div className="text-center py-8">
                              <p className="text-red-500 mb-2">Failed to load category</p>
                              <Button
                                    onClick={() => router.push(localePath("/post-job/select"))}
                                    variant="outline"
                              >
                                    Back to Categories
                              </Button>
                        </div>
                  </section>
            );
      }

      if (!category) {
            return (
                  <section className="h-full w-full max-w-[888px] mx-auto">
                        <div className="text-center py-8">
                              <p className="text-gray-500 mb-2">Category not found</p>
                              <Button
                                    onClick={() => router.push(localePath("/post-job/select"))}
                                    variant="outline"
                              >
                                    Back to Categories
                              </Button>
                        </div>
                  </section>
            );
      }

      return (
            <section className="w-full max-w-[888px] mx-auto relative">
                  <div className="flex h-full gap-10 relative">
                        <div className="w-full space-y-6 md:w-2/3 h-full pb-24">
                              <div className="space-y-4">
                                    <div>
                                          <h2 className="text-lg font-semibold text-[#1D2939] mb-2">
                                                Job Information
                                          </h2>
                                          <p className="text-sm text-[#8A8A8A]">
                                                Fill in the details of the job vacancy
                                          </p>
                                    </div>

                                    {/* Organization Selection */}
                                    <FormField
                                          label="Organization"
                                          htmlFor="organization"
                                          required
                                          error={errors.organization?.message as string}
                                    >
                                          <Controller
                                                name="organization"
                                                control={control}
                                                rules={{ required: "Organization selection is required" }}
                                                render={({ field }) => {
                                                      const organizationOptions = [
                                                            {
                                                                  value: "individual",
                                                                  label: "Post as Individual",
                                                                  disabled: true, // Jobs must imply organization usually, but if not constraint, keep as is. Logic says check hasOrganization.
                                                            },
                                                            ...organizations.map((org) => ({
                                                                  value: org._id,
                                                                  label: `${org.tradeName || org.legalName}${org.verified ? " (Verified)" : ""}`,
                                                                  icon: org.logoUrl,
                                                            })),
                                                      ]// Remove individual if disabled

                                                      return (
                                                            <SelectInput
                                                                  value={field.value as string}
                                                                  onChange={(value) => {
                                                                        field.onChange(value);
                                                                        handleInputChange("organization", value);
                                                                  }}
                                                                  options={organizationOptions}
                                                                  placeholder="Select organization"
                                                                  error={errors.organization?.message as string}
                                                            />
                                                      );
                                                }}
                                          />
                                    </FormField>

                                    {/* Title */}
                                    <FormField
                                          label="Job Title"
                                          htmlFor="title"
                                          required
                                          error={errors.title?.message as string}
                                    >
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
                                                            error={errors.title?.message as string}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Description */}
                                    <FormField
                                          label="Job Description"
                                          htmlFor="description"
                                          required
                                          error={errors.description?.message as string}
                                          fullWidth
                                    >
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
                                                            maxLength={2000}
                                                            error={errors.description?.message as string}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Image Upload - Optional for jobs? Usually yes, company logo or office */}
                                    <FormField
                                          label="Images (Optional)"
                                          htmlFor="images"
                                          fullWidth={true}
                                    >
                                          <Controller
                                                name="images"
                                                control={control}
                                                render={({ field }) => (
                                                      <ImageGallery
                                                            images={(field.value as ImageItem[]) || []}
                                                            onImagesChange={(newImages) => {
                                                                  field.onChange(newImages);
                                                                  handleInputChange("images", newImages);
                                                            }}
                                                            maxImages={4}
                                                            maxFileSize={100}
                                                            acceptedFileTypes={[
                                                                  "image/jpeg",
                                                                  "image/png",
                                                                  "image/gif",
                                                            ]}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Video Upload - Optional */}
                                    <FormField
                                          label="Video (Optional)"
                                          htmlFor="video"
                                          error={errors.video?.message as string}
                                          fullWidth={true}
                                    >
                                          <Controller
                                                name="video"
                                                control={control}
                                                render={({ field }) => {
                                                      const videoItem: VideoItem | null = field.value
                                                            ? {
                                                                  id: "video-1",
                                                                  url: field.value as string,
                                                                  presignedUrl: field.value as string,
                                                            }
                                                            : null;

                                                      return (
                                                            <VideoUpload
                                                                  video={videoItem}
                                                                  onVideoChange={(video: VideoItem | null) => {
                                                                        const videoUrl = video?.presignedUrl || video?.url || "";
                                                                        field.onChange(videoUrl);
                                                                        handleInputChange("video", videoUrl);
                                                                  }}
                                                                  maxFileSize={5}
                                                                  maxDuration={60}
                                                                  acceptedFileTypes={[
                                                                        "video/mp4",
                                                                        "video/webm",
                                                                  ]}
                                                            />
                                                      );
                                                }}
                                          />
                                    </FormField>

                                    {/* Salary (Price) */}
                                    <FormField
                                          label="Salary (AED)"
                                          htmlFor="price"
                                          required
                                          error={errors.price?.message as string}
                                    >
                                          <Controller
                                                name="price"
                                                control={control}
                                                rules={{
                                                      required: "Salary is required",
                                                      min: { value: 0, message: "Salary must be greater than 0" }
                                                }}
                                                render={({ field }) => (
                                                      <NumberInput
                                                            value={(field.value as number) || 0}
                                                            onChange={(val) => {
                                                                  field.onChange(val);
                                                                  handleInputChange("price", val);
                                                            }}
                                                            min={0}
                                                            placeholder="Enter salary amount"
                                                            error={errors.price?.message as string}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Phone Number */}
                                    <FormField
                                          label="Contact Phone Number"
                                          htmlFor="phoneNumber"
                                          required
                                          error={errors.phoneNumber?.message as string}
                                    >
                                          <Controller
                                                name="phoneNumber"
                                                control={control}
                                                rules={{ required: "Phone number is required" }}
                                                render={({ field }) => (
                                                      <TextInput
                                                            value={(field.value as string) || ""}
                                                            onChange={(val) => {
                                                                  field.onChange(val);
                                                                  handleInputChange("phoneNumber", val);
                                                            }}
                                                            placeholder="Enter phone number"
                                                            type="tel"
                                                            error={errors.phoneNumber?.message as string}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Address */}
                                    <FormField
                                          label="Job Location"
                                          htmlFor="address"
                                          required
                                          error={errors.address?.message as string}
                                          fullWidth
                                    >
                                          <Controller
                                                name="address"
                                                control={control}
                                                rules={{
                                                      required: "Location is required",
                                                      validate: (value) => {
                                                            if (!value || !(value as { address?: string })?.address) {
                                                                  return "Location is required";
                                                            }
                                                            return true;
                                                      }
                                                }}
                                                render={() => (
                                                      <>
                                                            <MapComponent
                                                                  onLocationSelect={handleLocationSelect}
                                                                  initialLocation={selectedLocation || undefined}
                                                                  height="300px"
                                                                  className="rounded-lg"
                                                            />
                                                            {selectedLocation && (
                                                                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                                                        <p className="text-sm text-blue-800">
                                                                              <strong>Selected:</strong> {selectedLocation.address}
                                                                        </p>
                                                                  </div>
                                                            )}
                                                      </>
                                                )}
                                          />
                                    </FormField>

                                    {/* Connection Types */}
                                    <FormField
                                          label="Contact Methods"
                                          htmlFor="connectionTypes"
                                          required
                                          error={errors.connectionTypes?.message as string}
                                    >
                                          <Controller
                                                name="connectionTypes"
                                                control={control}
                                                rules={{ required: "At least one contact method is required" }}
                                                render={({ field }) => (
                                                      <CheckboxInput
                                                            value={Array.isArray(field.value) ? (field.value as string[]) : field.value ? [field.value as string] : []}
                                                            onChange={(val) => {
                                                                  field.onChange(val);
                                                                  handleInputChange("connectionTypes", val);
                                                            }}
                                                            options={[
                                                                  { value: "call", label: "Call" },
                                                                  { value: "chat", label: "Chat" },
                                                                  { value: "whatsapp", label: "WhatsApp" },
                                                            ]}
                                                            columns={3}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Dynamic Fields from Category */}
                                    {category.fields && category.fields.length > 0 && (
                                          <div className="space-y-3">
                                                {category.fields
                                                      .filter((field) => !field.hidden)
                                                      .map((field) => {
                                                            return renderField(field)
                                                      })
                                                      .filter(Boolean)}
                                          </div>
                                    )}
                              </div>

                              {/* Submit Button */}
                              <div className="flex justify-end pt-6">
                                    <Button
                                          onClick={handleSubmit(onSubmit)}
                                          disabled={isSubmitting || !isValid}
                                          className="w-full md:w-auto min-w-[200px]"
                                    >
                                          {isSubmitting ? "Posting Job..." : "Post Job"}
                                    </Button>
                              </div>
                        </div>

                        {/* Right Column - Info */}
                        <div className="hidden md:block md:w-1/3">
                              <div className="sticky top-24 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="text-lg font-semibold mb-4">Posting Tips</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-500 space-y-2">
                                          <li>Provide a clear and concise job title.</li>
                                          <li>Describe the roles and responsibilities in detail.</li>
                                          <li>Mention required qualifications and experience.</li>
                                          <li>Include salary range to attract relevant candidates.</li>
                                    </ul>
                              </div>
                        </div>
                  </div>
            </section>
      );
}
