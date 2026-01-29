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
import { ImageGallery, ImageItem } from "../../details/_components/image-upload";
import { VideoUpload, type VideoItem } from "../../details/_components/video-upload";
import { FormField } from "../../details/_components/FormField";
import { TextInput } from "../../details/_components/TextInput";
import { TextareaInput } from "../../details/_components/TextareaInput";
import { NumberInput } from "../../details/_components/NumberInput";
import { BooleanInput } from "../../details/_components/BooleanInput";
import { MultipleImageInput, ImageItem as MultipleImageItem } from "../../details/_components/MultipleImageInput";
import { MapComponent } from "../../details/_components/MapComponent";
import { CheckboxInput } from "../../details/_components/CheckboxInput";
import { Field } from "@/interfaces/categories.types";
import { DynamicFieldRenderer, FormValues } from "../../details/_components/DynamicFieldRenderer";
import { SelectInput } from "../../details/_components/SelectInput";
import { FormSkeleton } from "../../details/_components/FormSkeleton";
import { createPostAdSchema, type AddressFormValue } from "@/schemas/post-ad.schema";
import { getFieldOptions, shouldShowField, isJobCategory } from "@/validations/post-ad.validation";
import { AD_SYSTEM_FIELDS } from "@/constants/ad.constants";
import { removeUndefinedFields } from "@/utils/remove-undefined-fields";
import { Typography } from "@/components/typography";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";

// type FormValues = Record<string, string | number | boolean | string[] | MultipleImageItem[] | ImageItem[] | AddressFormValue>;

export default function EditAdPage() {
      const { localePath } = useLocale();
      const { adId } = useParams<{ adId: string }>();
      const router = useRouter();
      // ... (rest of the component until handleInputChange) ...
      const { session } = useAuthStore((state) => state);
      const updateAdMutation = useUpdateAd();
      const [selectedLocation, setSelectedLocation] = useState<{
            address: string;
            coordinates: { lat: number; lng: number };
      } | null>(null);

      // Fetch Existing Ad
      const { data: adResponse, isLoading: isAdLoading, error: adError } = useAdById(adId);
      const existingAd = adResponse?.data;

      // Determine Category ID
      const categoryId = useMemo(() => {
            if (!existingAd?.category) return null;
            return typeof existingAd.category === "string"
                  ? existingAd.category
                  : existingAd.category._id;
      }, [existingAd]);

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
            return createPostAdSchema(category);
      }, [category]);

      const {
            control,
            handleSubmit,
            setValue,
            watch,
            trigger,
            reset,
            formState: { errors, isLoading: isFormLoading },
      } = useForm<FormValues>({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resolver: category ? zodResolver(formSchema as any) : undefined,
            defaultValues: {
                  images: [] as ImageItem[],
            },
            mode: "onChange",
      });

      // Populate form with existing ad data
      useEffect(() => {
            if (existingAd && category) {
                  const defaultValues: any = {
                        title: existingAd.title,
                        description: existingAd.description,
                        price: existingAd.price,
                        stockQuantity: existingAd.stockQuantity,
                        availability: existingAd.availability,
                        phoneNumber: existingAd.contactPhoneNumber || existingAd.owner?.phoneNo,
                        isFeatured: existingAd.isFeatured || existingAd.featuredStatus === "live",
                        deal: existingAd.deal,
                        discountedPrice: existingAd.discountedPrice,
                        dealValidThru: existingAd.dealValidThru,
                        isExchange: existingAd.isExchangable || existingAd.upForExchange,
                        organization: existingAd.organization?._id || "individual",
                        connectionTypes: existingAd.connectionTypes,
                        // Map images
                        images: existingAd.images?.map((url, index) => ({
                              id: `img-${index}`,
                              url: url,
                              file: null, // Since it's existing, no file object
                        })) || [],
                        video: existingAd.videoUrl,

                        // Map Exchange fields
                        exchangeTitle: existingAd.exchangeWith?.title,
                        exchangeDescription: existingAd.exchangeWith?.description,
                        exchangeImages: existingAd.exchangeWith?.imageUrl
                              ? [{ id: "ex-img-1", url: existingAd.exchangeWith.imageUrl, file: null }]
                              : [],

                        // Map Address
                        address: existingAd.address || existingAd.location, // Handle both potential fields
                  };

                  // Handle Address specifically for UI state
                  if (existingAd.address || existingAd.location) {
                        const addr = (existingAd.address || existingAd.location) as any;
                        if (addr) {
                              // Ensure coordinates are properly set
                              let coords = { lat: 0, lng: 0 };
                              if (Array.isArray(addr.coordinates) && addr.coordinates.length === 2) {
                                    coords = { lng: addr.coordinates[0], lat: addr.coordinates[1] };
                              }

                              if (addr.address) {
                                    setSelectedLocation({
                                          address: addr.address,
                                          coordinates: coords
                                    });
                              }
                        }
                  }

                  // Map Extra Fields
                  if (existingAd.extraFields) {
                        // existingAd.extraFields is typically an array of objects like { name, value, ... }
                        // or a key-value object depending on how API returns it. 
                        // Based on interface `ProductExtraFields = ProductExtraField[] | Record<string, any>;`

                        if (Array.isArray(existingAd.extraFields)) {
                              existingAd.extraFields.forEach((field: any) => {
                                    defaultValues[field.name] = field.value;
                              });
                        } else if (typeof existingAd.extraFields === 'object') {
                              Object.entries(existingAd.extraFields).forEach(([key, value]) => {
                                    defaultValues[key] = value;
                              });
                        }
                  }

                  reset(defaultValues);
            }
      }, [existingAd, category, reset]);

      // Handle input change (wrapper for setValue)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleInputChange = (field: string, value: any) => {
            setValue(field as keyof FormValues, value as FormValues[keyof FormValues], { shouldValidate: true });

            // If price changes, trigger validation for discountedPrice to show error if needed
            if (field === "price") {
                  trigger("discountedPrice");
            }

            // Clear dependent fields when parent field changes
            // Only if it's a user interaction change, not initial load.
            // However, setValue is called during typing.
            if (category?.fields) {
                  category.fields.forEach((f: Field) => {
                        if (f.dependsOn === field) {
                              // Clear the dependent field value
                              setValue(f.name as keyof FormValues, "" as FormValues[keyof FormValues], { shouldValidate: false });
                        }
                  });
            }
      };

      // Watch form values for dependent fields
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

            // Create address object structure with extracted components
            const addressObj = {
                  address: location.address,
                  coordinates: [location.coordinates.lng, location.coordinates.lat], // [lng, lat] format
                  state: location.state || "",
                  country: location.country || "",
                  zipCode: location.zipCode || "",
                  city: location.city || "",
                  street: location.street || "",
                  type: "Point",
            };

            handleInputChange("address", addressObj);
      };

      // Render field based on type
      const renderField = (field: Field) => {
            // Don't render if field should be hidden based on dependencies
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

      // Handle form submission
      const onSubmit = async (data: FormValues) => {
            // Extract image URLs from ImageItem[]
            const images = (data.images as ImageItem[]) || [];
            const imageUrls = images.map((img) => img.url || img.presignedUrl || "").filter(Boolean);

            // Calculate discountedPrice if deal is active
            const price = (data.price as number) || 0;
            const discountedPrice = (data.discountedPrice as number) || 0;
            const dealValidThru = (data.dealValidThru as string) || undefined;

            // Extract exchange data
            const isExchange = data.isExchange === true || data.isExchange === "true";
            const exchangeImages = (data.exchangeImages as MultipleImageItem[]) || [];
            // Use fileUrl (S3 URL) - this is only set after successful upload
            // Filter out blob URLs and get the first valid S3 URL
            const exchangeImageUrl = exchangeImages
                  .map((img) => {
                        // Prioritize fileUrl (set after upload), fallback to url if it's not a blob
                        const url = img.fileUrl || (img.url && !img.url.startsWith("blob:") ? img.url : null);
                        return url;
                  })
                  .filter((url): url is string => !!url)[0]; // Get first valid non-blob URL
            const exchangeTitle = (data.exchangeTitle as string) || "";
            const exchangeDescription = (data.exchangeDescription as string) || "";

            // Prepare connectionTypes array
            const connectionTypes = Array.isArray(data.connectionTypes)
                  ? data.connectionTypes
                  : data.connectionTypes
                        ? [data.connectionTypes as string]
                        : [];

            // Prepare address object
            const addressData = (data.address as AddressFormValue) || {};

            // Extract dynamic category fields (exclude system fields)
            // Format extraFields as array of field objects (matching API structure)
            // Always process extraFields regardless of category type
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


            // Get organization selection
            const organizationValue = (data.organization as string) || "";
            const isIndividual = organizationValue === "individual";

            // Determine adType based on category
            const adType: "AD" | "JOB" = isJobCategory(category?.name || "") ? "JOB" : "AD";

            // Prepare payload according to the API structure
            // Note: Partial<PostAdPayload> for update, but structure matches common fields
            const payload: Partial<PostAdPayload> = {
                  title: (data.title as string) || "",
                  description: (data.description as string) || "",
                  price: price,
                  stockQuantity: (data.stockQuantity as number) || 1,
                  availability: (data.availability as string) || "in-stock",
                  images: imageUrls,
                  videoUrl: (data.video as string) || undefined,
                  category: categoryId as string,
                  // owner: (session.user?._id as string) || "", // Usually owner shouldn't change on edit
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
                  // relatedCategories: ... // derived from category
                  featuredStatus: data.isFeatured ? "live" : "created",
                  // status: "created", // Don't reset status on edit usually?
                  userType: "RERA_LANDLORD" as const,
                  tags: [],
                  documents: [],
                  // Convert extraFields array to Record<string, unknown> format
                  extraFields: extraFields,
                  adType: adType,
                  // Only include organizationId if not posting as individual
                  ...(isIndividual ? {} : { organizationId: organizationValue }),
            };

            // Remove undefined fields
            removeUndefinedFields(payload);

            // Submit the ad update
            try {
                  await updateAdMutation.mutateAsync({ id: adId, payload });

                  // Redirect to success page with status or back to ad details
                  // router.push(`/post-ad/success?status=success&title=Ad updated successfully!`);
                  // Or simply back to user profile or ad detail
                  router.push(localePath(`/ad/${adId}`));
            } catch (error: unknown) {
                  console.error("Error updating ad", error);
            }
      };

      if (isAdLoading || isCategoryLoading) {
            return <FormSkeleton />;
      }

      if (adError || !existingAd) {
            return (
                  <section className="h-full w-full max-w-[888px] mx-auto">
                        <div className="text-center py-8">
                              <p className="text-red-500 mb-2">Failed to load ad details</p>
                              <Button
                                    onClick={() => router.back()}
                                    variant="outline"
                              >
                                    Go Back
                              </Button>
                        </div>
                  </section>
            );
      }

      if (categoryError || !category) {
            return (
                  <section className="h-full w-full max-w-[888px] mx-auto">
                        <div className="text-center py-8">
                              <p className="text-gray-500 mb-2">Category not found</p>
                              <Button
                                    onClick={() => router.back()}
                                    variant="outline"
                              >
                                    Go Back
                              </Button>
                        </div>
                  </section>
            );
      }

      return (
            <GoogleMapsProvider>

            <section className="w-full max-w-[888px] mx-auto relative">
                  {/* Main Container */}
                  <div className="flex h-full gap-10 relative">
                        {/* Left Column - Form Fields */}
                        <div className="w-full space-y-6 md:w-2/3 h-full pb-24">
                              {/* Main Section */}
                              <div className="space-y-4">
                                    <div>
                                          <Typography variant="h2" className="text-lg font-semibold text-[#1D2939] mb-2">
                                                Edit Ad
                                          </Typography>
                                          <p className="text-sm text-[#8A8A8A]">
                                                Update the details of your ad
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
                                                      const isJob = isJobCategory(category.name);
                                                      // Create options with icons and names from API
                                                      const organizationOptions = [
                                                            {
                                                                  value: "individual",
                                                                  label: "Post as Individual",
                                                                  disabled: isJob, // Disable individual option for job categories
                                                            },
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
                                                                  placeholder={
                                                                        isJob
                                                                              ? "Select organization"
                                                                              : "Select organization or post as individual"
                                                                  }
                                                                  error={errors.organization?.message as string}
                                                            />
                                                      );
                                                }}
                                          />
                                    </FormField>

                                    {/* Title */}
                                    <FormField
                                          label="Title"
                                          htmlFor="title"
                                          required
                                          error={errors.title?.message as string}
                                    >
                                          <Controller
                                                name="title"
                                                control={control}
                                                rules={{ required: "Title is required" }}
                                                render={({ field }) => (
                                                      <TextInput
                                                            value={(field.value as string) || ""}
                                                            onChange={(val) => {
                                                                  field.onChange(val);
                                                                  handleInputChange("title", val);
                                                            }}
                                                            placeholder="Enter ad title"
                                                            error={errors.title?.message as string}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Description */}
                                    <FormField
                                          label="Description"
                                          htmlFor="description"
                                          required
                                          error={errors.description?.message as string}
                                          fullWidth
                                    >
                                          <Controller
                                                name="description"
                                                control={control}
                                                rules={{ required: "Description is required" }}
                                                render={({ field }) => (
                                                      <TextareaInput
                                                            value={(field.value as string) || ""}
                                                            onChange={(val) => {
                                                                  field.onChange(val);
                                                                  handleInputChange("description", val);
                                                            }}
                                                            placeholder="Enter ad description"
                                                            rows={4}
                                                            maxLength={500}
                                                            error={errors.description?.message as string}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Image Upload */}
                                    <FormField
                                          label="Ad Images"
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
                                                            maxImages={8}
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

                                    {/* Video Upload */}
                                    <FormField
                                          label="Video"
                                          htmlFor="video"
                                          error={errors.video?.message as string}
                                          fullWidth={true}
                                    >
                                          <Controller
                                                name="video"
                                                control={control}
                                                render={({ field }) => {
                                                      // Convert string URL to VideoItem format for the component
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
                                                                        // Extract URL from video item and update form
                                                                        const videoUrl = video?.presignedUrl || video?.url || "";
                                                                        field.onChange(videoUrl);
                                                                        handleInputChange("video", videoUrl);
                                                                  }}
                                                                  maxFileSize={5}
                                                                  maxDuration={30}
                                                                  acceptedFileTypes={[
                                                                        "video/mp4",
                                                                        "video/webm",
                                                                        "video/quicktime",
                                                                        "video/x-msvideo",
                                                                  ]}
                                                            />
                                                      );
                                                }}
                                          />
                                    </FormField>

                                    {/* Price */}
                                    <FormField
                                          label="Price"
                                          htmlFor="price"
                                          required
                                          error={errors.price?.message as string}
                                    >
                                          <Controller
                                                name="price"
                                                control={control}
                                                rules={{
                                                      required: "Price is required",
                                                      min: { value: 0, message: "Price must be greater than 0" }
                                                }}
                                                render={({ field }) => (
                                                      <NumberInput
                                                            value={(field.value as number) || 0}
                                                            onChange={(val) => {
                                                                  field.onChange(val);
                                                                  handleInputChange("price", val);
                                                            }}
                                                            min={0}
                                                            placeholder="Enter price"
                                                            error={errors.price?.message as string}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Phone Number */}
                                    <FormField
                                          label="Phone Number"
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
                                          label="Address"
                                          htmlFor="address"
                                          required
                                          error={errors.address?.message as string}
                                          fullWidth
                                    >
                                          <Controller
                                                name="address"
                                                control={control}
                                                rules={{
                                                      required: "Address is required",
                                                      validate: (value) => {
                                                            if (!value || !(value as { address?: string })?.address) {
                                                                  return "Address is required";
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
                                                                        <p className="text-xs text-blue-600 mt-1">
                                                                              Coordinates: {selectedLocation.coordinates.lat.toFixed(6)},{" "}
                                                                              {selectedLocation.coordinates.lng.toFixed(6)}
                                                                        </p>
                                                                  </div>
                                                            )}
                                                      </>
                                                )}
                                          />
                                    </FormField>

                                    {/* Connection Types */}
                                    <FormField
                                          label="Connection Types"
                                          htmlFor="connectionTypes"
                                          required
                                          error={errors.connectionTypes?.message as string}
                                    >
                                          <Controller
                                                name="connectionTypes"
                                                control={control}
                                                rules={{ required: "At least one connection type is required" }}
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

                                    {/* Is Featured */}
                                    <FormField
                                          label="Is Featured"
                                          htmlFor="isFeatured"
                                          error={errors.isFeatured?.message as string}
                                    >
                                          <Controller
                                                name="isFeatured"
                                                control={control}
                                                render={({ field }) => (
                                                      <BooleanInput
                                                            value={field.value === true || field.value === "true"}
                                                            onChange={(val) => {
                                                                  field.onChange(val);
                                                                  handleInputChange("isFeatured", val);
                                                            }}
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

                              {/* Divider */}
                              <div className="border-t border-[#E2E2E2] my-8"></div>

                              {/* Exchange Section */}
                              <div className="space-y-4">
                                    <div>
                                          <h2 className="text-lg font-semibold text-[#1D2939] mb-2">
                                                Exchange Section
                                          </h2>
                                          <p className="text-sm text-[#8A8A8A]">
                                                Enable exchange option and provide details about items
                                                you&apos;re willing to exchange
                                          </p>
                                    </div>

                                    {/* Is Exchange */}
                                    <FormField
                                          label="Is Exchange"
                                          htmlFor="isExchange"
                                          error={errors.isExchange?.message as string}
                                    >
                                          <Controller
                                                name="isExchange"
                                                control={control}
                                                render={({ field }) => (
                                                      <BooleanInput
                                                            value={field.value === true || field.value === "true"}
                                                            onChange={(val) => {
                                                                  field.onChange(val);
                                                                  handleInputChange("isExchange", val);
                                                            }}
                                                      />
                                                )}
                                          />
                                    </FormField>

                                    {/* Conditional Fields - Show when isExchange is true */}
                                    {(formValues.isExchange === true ||
                                          formValues.isExchange === "true") && (
                                                <div className="space-y-3 pl-4 border-l-2 border-[#8B31E1]/20">
                                                      {/* Exchange Multiple Images */}
                                                      <FormField
                                                            label="Exchange Images"
                                                            htmlFor="exchangeImages"
                                                            fullWidth
                                                            error={errors.exchangeImages?.message as string}
                                                      >
                                                            <Controller
                                                                  name="exchangeImages"
                                                                  control={control}
                                                                  render={({ field }) => (
                                                                        <MultipleImageInput
                                                                              value={(field.value as MultipleImageItem[]) || []}
                                                                              onChange={(val) => {
                                                                                    field.onChange(val);
                                                                                    handleInputChange("exchangeImages", val);
                                                                              }}
                                                                              maxImages={1}
                                                                        />
                                                                  )}
                                                            />
                                                      </FormField>

                                                      {/* Exchange Ad Title */}
                                                      <FormField
                                                            label="Exchange Ad Title"
                                                            htmlFor="exchangeTitle"
                                                            required
                                                            error={errors.exchangeTitle?.message as string}
                                                      >
                                                            <Controller
                                                                  name="exchangeTitle"
                                                                  control={control}
                                                                  rules={{ required: "Exchange ad title is required" }}
                                                                  render={({ field }) => (
                                                                        <TextInput
                                                                              value={(field.value as string) || ""}
                                                                              onChange={(val) => {
                                                                                    field.onChange(val);
                                                                                    handleInputChange("exchangeTitle", val);
                                                                              }}
                                                                              placeholder="Enter exchange ad title"
                                                                        />
                                                                  )}
                                                            />
                                                      </FormField>

                                                      {/* Exchange Description */}
                                                      <FormField
                                                            label="Exchange Description"
                                                            htmlFor="exchangeDescription"
                                                            required
                                                            error={errors.exchangeDescription?.message as string}
                                                            fullWidth
                                                      >
                                                            <Controller
                                                                  name="exchangeDescription"
                                                                  control={control}
                                                                  rules={{ required: "Exchange description is required" }}
                                                                  render={({ field }) => (
                                                                        <TextareaInput
                                                                              value={(field.value as string) || ""}
                                                                              onChange={(val) => {
                                                                                    field.onChange(val);
                                                                                    handleInputChange("exchangeDescription", val);
                                                                              }}
                                                                              placeholder="Enter exchange description"
                                                                              rows={3}
                                                                              error={errors.exchangeDescription?.message as string}
                                                                        />
                                                                  )}
                                                            />
                                                      </FormField>
                                                </div>
                                          )}
                              </div>

                              {/* Submit Button */}
                              <div className="flex justify-end pt-6">
                                    <Button
                                          onClick={handleSubmit(onSubmit)}
                                          disabled={updateAdMutation.isPending || isFormLoading}
                                          className="w-full md:w-auto min-w-[200px]"
                                    >
                                          {updateAdMutation.isPending ? "Updating..." : "Update Ad"}
                                    </Button>
                              </div>
                        </div>

                        {/* Right Column - Preview (Optional or Skeleton) */}
                        {/* For now, just keeping structure similar to create page, maybe hiding preview for edit or reusing it */}
                        <div className="hidden md:block md:w-1/3">
                              <div className="sticky top-24 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="text-lg font-semibold mb-4">Preview</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                          Use the preview to see how your ad will look to other users.
                                    </p>
                                    {/* We could add the actual ListingCard preview here if needed */}
                              </div>
                        </div>
                  </div>
            </section>
            </GoogleMapsProvider>

      );
}
