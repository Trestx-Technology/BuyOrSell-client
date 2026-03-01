"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategoryById } from "@/hooks/useCategories";
import { useCreateAd } from "@/hooks/useAds";
import { useMyOrganization } from "@/hooks/useOrganizations";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { useAuthStore } from "@/stores/authStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { Button } from "@/components/ui/button";
import { PostAdPayload } from "@/interfaces/ad";
import { ImageGallery, ImageItem } from "./image-upload";
import { VideoUpload, type VideoItem } from "./video-upload";
import { FormField } from "./FormField";
import { TextInput } from "./TextInput";
import { TextareaInput } from "./TextareaInput";
import { NumberInput } from "./NumberInput";
import { BooleanInput } from "./BooleanInput";
import {
  MultipleImageInput,
  ImageItem as MultipleImageItem,
} from "./MultipleImageInput";
import DateTimeInput from "./DateTimeInput";
import { MapComponent } from "./MapComponent";
import { CheckboxInput } from "./CheckboxInput";
import { Field } from "@/interfaces/categories.types";
import { DynamicFieldRenderer, FormValues } from "./DynamicFieldRenderer";
import { SelectInput } from "./SelectInput";
import { FormSkeleton } from "./FormSkeleton";
import {
  createPostAdSchema,
  type AddressFormValue,
} from "@/schemas/post-ad.schema";
import {
  getFieldOptions,
  shouldShowField,
  isJobCategory,
} from "@/validations/post-ad.validation";
import { AD_SYSTEM_FIELDS } from "@/constants/ad.constants";
import { removeUndefinedFields } from "@/utils/remove-undefined-fields";
import PhoneNumberInput from "@/components/global/phone-number-input";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { FormSummaryItem } from "./FormSummaryItem";
import PostStatusView, { PostStatus } from "./PostStatusView";

export default function LeafCategoryContent() {
  const { localePath } = useLocale();
  const { leafCategoryId } = useParams<{ leafCategoryId: string }>();
  const router = useRouter();
  const { session } = useAuthStore((state) => state);
  const {
    categoryArray,
    addToCategoryArray,
    clearCategoryArray,
    setActiveCategory,
    currentStep,
    setStep,
  } = useAdPostingStore((state) => state);
  const { canFeatureAd, getAvailableFeaturedAdsCount } = useSubscriptionStore();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");
  const initialTitle = searchParams.get("title");
  const initialImagesParam = searchParams.get("images");
  const categoryPathParam = searchParams.get("categoryPath");

  // Hydrate store from URL params if available (handling AI redirection)
  useMemo(() => {
    if (categoryPathParam) {
      try {
        const hierarchy = JSON.parse(decodeURIComponent(categoryPathParam));
        // Check if we need to update the store (avoid infinite loops if already matches)
        const currentIds = categoryArray.map((c) => c.id).join(",");
        const newIds = hierarchy.map((c: any) => c.id).join(",");

        if (currentIds !== newIds) {
          clearCategoryArray();
          hierarchy.forEach((cat: any) => {
            addToCategoryArray({
              id: cat.id,
              name: cat.name,
            });
          });
          if (hierarchy.length > 0) {
            setActiveCategory(hierarchy[hierarchy.length - 1].id);
          }
        }
      } catch (error) {
        console.error("Failed to parse category hierarchy from URL", error);
      }
    }
  }, [
    categoryPathParam,
    clearCategoryArray,
    addToCategoryArray,
    setActiveCategory,
    categoryArray,
  ]);
  const createAdMutation = useCreateAd();
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);
  const [postStatus, setPostStatus] = useState<PostStatus>("idle");

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

  const adTypeCheck = useMemo(() => {
    return category?.name && isJobCategory(category.name) ? "JOB" : "AD";
  }, [category]);

  const availableFeaturedAds = useMemo(() => {
    if (!category) return 0;
    return getAvailableFeaturedAdsCount(adTypeCheck, category.name);
  }, [category, adTypeCheck, getAvailableFeaturedAdsCount]);

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
      deal: false,
      dealValidThru: "",
      discountedPrice: 0,
    },
    mode: "onChange",
  });

  // Pre-fill description from AI prompt if available
  useMemo(() => {
    if (initialPrompt && category) {
      setValue("description", initialPrompt);
    }
    if (initialTitle && category) {
      setValue("title", initialTitle);
    }
  }, [initialPrompt, initialTitle, category, setValue]);

  // Pre-fill images from AI redirect if available
  useMemo(() => {
    if (initialImagesParam && category) {
      try {
        const imageUrls = JSON.parse(decodeURIComponent(initialImagesParam));
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          const imageItems: ImageItem[] = imageUrls.map((url: string) => ({
            id: `ai-${Math.random().toString(36).substr(2, 9)}`,
            url: url,
            presignedUrl: url,
            name: "Uploaded Image",
            uploading: false,
          }));
          setValue("images", imageItems);
        }
      } catch (error) {
        console.error("Failed to parse images from URL", error);
      }
    }
  }, [initialImagesParam, category, setValue]);

  // Handle input change (wrapper for setValue)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
    setValue(field as keyof FormValues, value as FormValues[keyof FormValues], {
      shouldValidate: true,
    });

    // If price changes, trigger validation for discountedPrice to show error if needed
    if (field === "price") {
      trigger("discountedPrice");
    }

    // Clear dependent fields when parent field changes
    if (category?.fields) {
      category.fields.forEach((f: Field) => {
        if (f.dependsOn === field) {
          // Clear the dependent field value
          setValue(
            f.name as keyof FormValues,
            "" as FormValues[keyof FormValues],
            { shouldValidate: false },
          );
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
    const imageUrls = images
      .map((img) => img.url || img.presignedUrl || "")
      .filter(Boolean);

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
        const url =
          img.fileUrl ||
          (img.url && !img.url.startsWith("blob:") ? img.url : null);
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
            field.name as (typeof AD_SYSTEM_FIELDS)[number],
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
    const categoryName =
      category?.name || categoryArray[categoryArray.length - 1]?.name || "";
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
      connectionTypes: connectionTypes as
        | ("chat" | "call" | "whatsapp")[]
        | undefined,
      deal: data.deal === true || data.deal === "true",
      discountedPrice:
        data.deal && discountedPrice > 0 ? discountedPrice : undefined,
      dealValidThru: data.deal && dealValidThru ? dealValidThru : undefined,
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
        coordinates: Array.isArray(addressData.coordinates)
          ? addressData.coordinates
          : null,
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
      setPostStatus("loading");
      setStep(4);
      const response = await createAdMutation.mutateAsync(payload);
      router.push(localePath(`/success?id=${response.data._id}`));
    } catch (error: unknown) {
      console.error("Error creating ad", error);
      setPostStatus("error");
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
            onClick={() => router.push(localePath("/post-ad/select"))}
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
            onClick={() => router.push(localePath("/post-ad/select"))}
            variant="outline"
          >
            Back to Categories
          </Button>
        </div>
      </section>
    );
  }

  if (currentStep === 4 && postStatus !== "idle") {
    return (
      <GoogleMapsProvider>
        <section className="w-full max-w-[888px] mx-auto relative min-h-[400px]">
          <PostStatusView
            status={postStatus}
            onRetry={() => {
              setPostStatus("idle");
              setStep(3);
            }}
          />
        </section>
      </GoogleMapsProvider>
    );
  }

  return (
    <GoogleMapsProvider>
      <section className="w-full max-w-[888px] mx-auto relative">
        {/* Breadcrumbs */}

        {/* Main Container */}
        <div className="flex h-full gap-10 relative">
          {/* Left Column - Form Fields */}
          <div className="w-full space-y-6 md:w-2/3 h-full pb-24">
            {/* Main Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1D2939] dark:text-white mb-2">
                  Basic Information
                </h2>
                <p className="text-sm text-[#8A8A8A] dark:text-gray-400">
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
                    const isJob = categoryArray.some((cat) =>
                      isJobCategory(cat.name),
                    );

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
                      maxLength={2000}
                      error={errors.description?.message as string}
                      showAI={true}
                      categoryPath={
                        categoryArray.map((c) => c.name).join(" > ") ||
                        category?.name ||
                        "General"
                      }
                    />
                  )}
                />
              </FormField>

              {/* Image Upload */}
              <FormField
                label="Ad Images"
                htmlFor="images"
                required
                fullWidth={true}
                error={errors.images?.message as string}
              >
                <Controller
                  name="images"
                  control={control}
                  rules={{
                    validate: (value) => {
                      const images = value as ImageItem[];
                      if (!images || images.length === 0) {
                        return "At least one image is required";
                      }
                      return true;
                    },
                  }}
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
                          const videoUrl =
                            video?.presignedUrl || video?.url || "";
                          field.onChange(videoUrl);
                          handleInputChange("video", videoUrl);
                        }}
                        maxFileSize={5}
                        maxDuration={300}
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
                label="Price (in Dirhams)"
                htmlFor="price"
                required
                error={errors.price?.message as string}
              >
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: "Price is required",
                    min: { value: 0, message: "Price must be greater than 0" },
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
                    <PhoneNumberInput
                      value={(field.value as string) || ""}
                      onPhoneChange={(val) => {
                        field.onChange(val);
                        handleInputChange("phoneNumber", val);
                      }}
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
                    },
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
                            <strong>Selected:</strong>{" "}
                            {selectedLocation.address}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Coordinates:{" "}
                            {selectedLocation.coordinates.lat.toFixed(6)},{" "}
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
                  rules={{
                    required: "At least one connection type is required",
                  }}
                  render={({ field }) => (
                    <CheckboxInput
                      value={
                        Array.isArray(field.value)
                          ? (field.value as string[])
                          : field.value
                            ? [field.value as string]
                            : []
                      }
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
                      return renderField(field);
                    })
                    .filter(Boolean)}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#E2E2E2] dark:border-gray-800 my-8"></div>

            {/* Exchange Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1D2939] dark:text-white mb-2">
                  Exchange Section
                </h2>
                <p className="text-sm text-[#8A8A8A] dark:text-gray-400">
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

              {/* Exchange Details - Conditionlly Rendered */}
              {watch("isExchange") && (
                <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <FormField
                    label="Exchange Title"
                    htmlFor="exchangeTitle"
                    required
                    error={errors.exchangeTitle?.message as string}
                  >
                    <Controller
                      name="exchangeTitle"
                      control={control}
                      rules={{
                        required: watch("isExchange")
                          ? "Exchange title is required"
                          : false,
                      }}
                      render={({ field }) => (
                        <TextInput
                          value={(field.value as string) || ""}
                          onChange={(val) => {
                            field.onChange(val);
                            handleInputChange("exchangeTitle", val);
                          }}
                          placeholder="What items do you want to exchange?"
                          error={errors.exchangeTitle?.message as string}
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Exchange Description"
                    htmlFor="exchangeDescription"
                    error={errors.exchangeDescription?.message as string}
                    fullWidth
                  >
                    <Controller
                      name="exchangeDescription"
                      control={control}
                      render={({ field }) => (
                        <TextareaInput
                          value={(field.value as string) || ""}
                          onChange={(val) => {
                            field.onChange(val);
                            handleInputChange("exchangeDescription", val);
                          }}
                          placeholder="Describe the items you want directly"
                          rows={3}
                          maxLength={500}
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Exchange Images"
                    htmlFor="exchangeImages"
                    fullWidth={true}
                    error={errors.exchangeImages?.message as string}
                  >
                    <Controller
                      name="exchangeImages"
                      control={control}
                      render={({ field }) => (
                        <MultipleImageInput
                          value={(field.value as MultipleImageItem[]) || []}
                          onChange={(newImages) => {
                            field.onChange(newImages);
                            handleInputChange("exchangeImages", newImages);
                          }}
                          maxImages={4}
                          maxFileSize={5}
                          acceptedFileTypes={["image/jpeg", "image/png"]}
                        />
                      )}
                    />
                  </FormField>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#E2E2E2] dark:border-gray-800 my-8"></div>

            {/* Deals Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1D2939] dark:text-white mb-2">
                  Deals
                </h2>
                <p className="text-sm text-[#8A8A8A] dark:text-gray-400">
                  Create a special deal to attract more buyers
                </p>
              </div>

              <FormField
                label="Enable Deal"
                htmlFor="deal"
                error={errors.deal?.message as string}
              >
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

              {watch("deal") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <FormField
                    label="Discount Percentage (%)"
                    htmlFor="discountedPrice"
                    required
                    error={errors.discountedPrice?.message as string}
                  >
                    <Controller
                      name="discountedPrice"
                      control={control}
                      rules={{
                        required: watch("deal")
                          ? "Discount percentage is required"
                          : false,
                        min: { value: 1, message: "Minimum 1%" },
                        max: { value: 99, message: "Maximum 99%" },
                        validate: (value) => {
                          if (!watch("deal")) return true;

                          // Validate specific logic if needed
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <NumberInput
                          value={(field.value as number) || 0}
                          onChange={(val) => {
                            field.onChange(val);
                            handleInputChange("discountedPrice", val);
                          }}
                          min={0}
                          max={100}
                          placeholder="e.g. 20"
                          error={errors.discountedPrice?.message as string}
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Deal Valid Through"
                    htmlFor="dealValidThru"
                    required
                    error={errors.dealValidThru?.message as string}
                  >
                    <Controller
                      name="dealValidThru"
                      control={control}
                      rules={{
                        required: watch("deal")
                          ? "Validity date is required"
                          : false,
                      }}
                      render={({ field }) => (
                        <DateTimeInput
                          value={(field.value as string) || ""}
                          onChange={(val: string) => {
                            field.onChange(val);
                            handleInputChange("dealValidThru", val);
                          }}
                          placeholder="Select expiry date"
                        />
                      )}
                    />
                  </FormField>
                </div>
              )}
            </div>
            {/* Navigation Buttons (Moved to bottom of form) */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mt-8 hidden md:block">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Ready to post?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Review your ad details carefully before publishing.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 py-6 text-lg font-medium rounded-full border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#7052FB] hover:bg-[#5b3fd4] text-white py-6 text-lg font-medium rounded-full shadow-lg shadow-[#7052FB]/20 transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleSubmit(onSubmit)}
                  disabled={createAdMutation.isPending}
                >
                  {createAdMutation.isPending ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    "Post Ad Now"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Sponsored Ad & Tips (Desktop fixed) */}
          <div className="hidden md:block w-1/3 relative">
            <div className="sticky top-24 space-y-4">
              {/* Quick Tips Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <span className="bg-blue-200 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    i
                  </span>
                  Quick Tips
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-disc list-inside">
                  <li>Use high-quality images</li>
                  <li>Provide a detailed description</li>
                  <li>Verify your location on the map</li>
                </ul>
              </div>

              {/* Form Summary Container */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="bg-purple/10 text-purple p-1.5 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  Ad Summary
                </h4>
                <div className="space-y-3 text-sm">
                  <FormSummaryItem
                    label="Title"
                    value={formValues.title}
                    error={!!errors.title}
                  />
                  <FormSummaryItem
                    label="Price"
                    value={formValues.price}
                    type="price"
                    error={!!errors.price}
                  />
                  <FormSummaryItem
                    label="Discounted Price"
                    value={formValues.discountedPrice}
                    type="price"
                    error={!!errors.discountedPrice}
                  />
                  <FormSummaryItem
                    label="Location"
                    value={formValues.address}
                    type="location"
                    error={!!errors.address}
                  />

                  {/* Rendering dynamic fields from the category */}
                  {category?.fields
                    ?.filter((f: Field) => !f.hidden)
                    .map((f: Field) => {
                      const val = (formValues as any)[f.name];
                      return (
                        <FormSummaryItem
                          key={f.name}
                          label={f.name}
                          value={val}
                          error={!!errors[f.name]}
                        />
                      );
                    })}

                  <FormSummaryItem
                    label="Images"
                    value={formValues.images}
                    type="images"
                    error={!!errors.images}
                  />
                  <FormSummaryItem
                    label="Contact Methods"
                    value={formValues.connectionTypes}
                    error={!!errors.connectionTypes}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Footer Sticky Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-50 md:hidden">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 py-6 rounded-full border-gray-200 dark:border-gray-800"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              className="flex-[2] bg-[#7052FB] hover:bg-[#5b3fd4] text-white py-6 rounded-full shadow-lg shadow-[#7052FB]/20"
              onClick={handleSubmit(onSubmit)}
              disabled={createAdMutation.isPending}
            >
              {createAdMutation.isPending ? "Publishing..." : "Post Ad Now"}
            </Button>
          </div>
        </div>
      </section>
    </GoogleMapsProvider>
  );
}
