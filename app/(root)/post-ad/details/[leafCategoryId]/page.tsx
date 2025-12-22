"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategoryById } from "@/hooks/useCategories";
import { useCreateAd } from "@/hooks/useAds";
import { useMyOrganization } from "@/hooks/useOrganizations";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { PostAdPayload } from "@/interfaces/ad";
import { ImageGallery, ImageItem } from "../_components/image-upload";
import { VideoUpload, type VideoItem } from "../_components/video-upload";
import { FormField } from "../_components/FormField";
import { TextInput } from "../_components/TextInput";
import { TextareaInput } from "../_components/TextareaInput";
import { NumberInput } from "../_components/NumberInput";
import { BooleanInput } from "../_components/BooleanInput";
import { MultipleImageInput, ImageItem as MultipleImageItem } from "../_components/MultipleImageInput";
import { MapComponent } from "../_components/MapComponent";
import { CheckboxInput } from "../_components/CheckboxInput";
import { Field } from "@/interfaces/categories.types";
import DateTimeInput from "../_components/DateTimeInput";
import { DynamicFieldRenderer } from "../_components/DynamicFieldRenderer";
import { SelectInput } from "../_components/SelectInput";
import { FormSkeleton } from "../_components/FormSkeleton";
import { createPostAdSchema, type AddressFormValue } from "@/schemas/post-ad.schema";
import { getFieldOptions, shouldShowField, isJobCategory } from "@/validations/post-ad.validation";
import { AD_SYSTEM_FIELDS } from "@/constants/ad.constants";
import { removeUndefinedFields } from "@/utils/remove-undefined-fields";

type FormValues = Record<string, string | number | boolean | string[] | MultipleImageItem[] | ImageItem[] | AddressFormValue>;

export default function LeafCategoryPage() {
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
  
  // Get the category from the response
  // API returns CategoriesApiResponse with data as SubCategory[]
  // For single category, we take the first item
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
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: category ? zodResolver(formSchema as any) : undefined,
    defaultValues: {
      images: [] as ImageItem[],
    },
    mode: "onChange",
  });
  
  console.log("errors: ", errors);



  // Handle input change (wrapper for setValue)
  const handleInputChange = (field: string, value: string | number | boolean | string[] | MultipleImageItem[] | AddressFormValue) => {
    setValue(field as keyof FormValues, value as FormValues[keyof FormValues], { shouldValidate: true });
    
    // If price changes, trigger validation for discountedPrice to show error if needed
    if (field === "price") {
      trigger("discountedPrice");
    }
    
    // Clear dependent fields when parent field changes
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
      const categoryName = category?.name || categoryArray[categoryArray.length - 1]?.name || "";
      const adType: "AD" | "JOB" = isJobCategory(categoryName) ? "JOB" : "AD";

      // Prepare payload according to the API structure
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
        // Convert extraFields array to Record<string, unknown> format
        extraFields: extraFields,
        adType: adType,
        // Only include organizationId if not posting as individual
        ...(isIndividual ? {} : { organizationId: organizationValue }),
      };

      // Remove undefined fields
      removeUndefinedFields(payload);

      // Submit the ad
      try {
        await createAdMutation.mutateAsync(payload);
        
        // Redirect to success page with status
        router.push(`/post-ad/success?status=success&title=Ad created successfully!`);
      } catch (error: unknown) {

        console.error("Error creating ad", error);
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
            onClick={() => router.push("/post-ad/select")}
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
            onClick={() => router.push("/post-ad/select")}
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
      {/* Breadcrumbs */}

      {/* Main Container */}
      <div className="flex h-full gap-10 relative">
        {/* Left Column - Form Fields */}
        <div className="w-full space-y-6 md:w-2/3 h-full pb-24">
          {/* Main Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1D2939] mb-2">
                Basic Information
              </h2>
              <p className="text-sm text-[#8A8A8A]">
                Fill in the basic details of your ad
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
                  // Check if category is a job (case-insensitive)
                  const isJob = categoryArray.some((cat) => isJobCategory(cat.name));

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
                        placeholder="Enter exchange ad description"
                        rows={4}
                        maxLength={500}
                      />
                    )}
                  />
                </FormField>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#E2E2E2] my-8"></div>

          {/* Deal Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1D2939] mb-2">
                Deal Section
              </h2>
              <p className="text-sm text-[#8A8A8A]">
                Create special deals and discounts for your ad
              </p>
            </div>

            {/* Deal */}
            <FormField label="Deal" htmlFor="deal" error={errors.deal?.message as string}>
              <Controller
                name="deal"
                control={control}
                render={({ field }) => (
                  <BooleanInput
                    value={field.value === true || field.value === "true"}
                    onChange={(val) => {
                      field.onChange(val);
                      handleInputChange("deal", val);
                    }}
                  />
                )}
              />
            </FormField>

            {/* Conditional Fields - Show when deal is true */}
            {(formValues.deal === true || formValues.deal === "true") && (
              <div className="space-y-3 pl-4 border-l-2 border-[#8B31E1]/20">
                {/* Valid Till */}
                <FormField
                  label="Valid Till"
                  htmlFor="dealValidThru"
                  required
                  error={errors.dealValidThru?.message as string}
                >
                  <Controller
                    name="dealValidThru"
                    control={control}
                    rules={{ required: "Valid till date is required" }}
                    render={({ field }) => (
                      <DateTimeInput
                        value={(field.value as string) || ""}
                        onChange={(val) => {
                          field.onChange(val);
                          handleInputChange("dealValidThru", val);
                        }}
                        placeholder="Select valid till date and time"
                      />
                    )}
                  />
                </FormField>

                {/* Discounted Price */}
                <FormField
                  label="Discounted Price"
                  htmlFor="discountedPrice"
                  required
                  error={errors.discountedPrice?.message as string}
                >
                  <Controller
                    name="discountedPrice"
                    control={control}
                    rules={{ 
                      required: "Discounted price is required",
                      min: { value: 0, message: "Price must be at least 0" },
                      validate: (value) => {
                        const currentPrice = Number(formValues.price) || 0;
                        if (typeof value === 'number' && value > 0 && currentPrice > 0) {
                          if (value >= currentPrice) {
                            return `Discounted price (${value}) must be less than the original price (${currentPrice})`;
                          }
                        }
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <NumberInput
                        value={(field.value as number) || 0}
                        onChange={(val) => {
                          field.onChange(val);
                          handleInputChange("discountedPrice", val);
                          // Trigger validation when price changes
                          const currentPrice = Number(formValues.price) || 0;
                          if (typeof val === 'number' && val >= currentPrice && currentPrice > 0) {
                            // Validation will be triggered automatically by react-hook-form
                          }
                        }}
                        min={0}
                        placeholder="Enter discounted price"
                      />
                    )}
                  />
                </FormField>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Image Upload Area */}
        <div className="sticky top-0 bg-gray-100 hidden md:flex flex-1 p-6 w-1/3 max-h-[800px] rounded-lg border-2 border-dashed border-gray-300 items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white sticky bottom-0 left-0 right-0 max-w-[1080px] mx-auto md:border-t px-5 py-5">
        <div className="flex w-full justify-between max-w-[888px] mx-auto gap-3">
          <Button
            className="w-full"
            onClick={() => {
              // Go back to the category selection page
              // We can't navigate to specific parent without storing IDs
              router.push("/post-ad/select");
            }}
            variant={"outline"}
          >
            Back
          </Button>
          <Button 
            className="w-full" 
            onClick={handleSubmit(onSubmit)} 
            variant={"primary"}
            disabled={createAdMutation.isPending}
          >
            {createAdMutation.isPending ? "Creating..." : "Continue"}
          </Button>
        </div>
      </footer>
    </section>
  );
}

