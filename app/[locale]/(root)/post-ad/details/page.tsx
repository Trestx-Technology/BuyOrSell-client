/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { ImageGallery, ImageItem } from "./_components/image-upload";
import { FormField } from "./_components/FormField";
import { TextInput } from "./_components/TextInput";
import { TextareaInput } from "./_components/TextareaInput";
import { SelectInput } from "./_components/SelectInput";
import { NumberInput } from "./_components/NumberInput";
import { CheckboxInput } from "./_components/CheckboxInput";
import { MapComponent } from "./_components/MapComponent";
import { Button } from "@/components/ui/button";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";

// Mock form schema based on category - in real app, this would come from API
const formSchemas = {
  cars: {
    title: {
      type: "text",
      label: "Car Title",
      required: true,
      placeholder: "e.g., 2020 Honda City VX",
    },
    description: {
      type: "textarea",
      label: "Description",
      required: true,
      placeholder: "Describe your car...",
    },
    brand: {
      type: "select",
      label: "Brand",
      required: true,
      options: ["Honda", "Toyota", "Maruti", "Hyundai", "Tata", "Mahindra"],
    },
    model: {
      type: "text",
      label: "Model",
      required: true,
      placeholder: "e.g., City",
    },
    year: {
      type: "number",
      label: "Year",
      required: true,
      min: 1990,
      max: 2024,
    },
    mileage: { type: "number", label: "Mileage (km)", required: true, min: 0 },
    fuel: {
      type: "select",
      label: "Fuel Type",
      required: true,
      options: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
    },
    transmission: {
      type: "select",
      label: "Transmission",
      required: true,
      options: ["Manual", "Automatic", "CVT"],
    },
    condition: {
      type: "select",
      label: "Condition",
      required: true,
      options: ["Excellent", "Good", "Fair", "Poor"],
    },
    color: {
      type: "text",
      label: "Color",
      required: true,
      placeholder: "e.g., White",
    },
    features: {
      type: "checkbox",
      label: "Features",
      options: [
        "AC",
        "Power Steering",
        "Power Windows",
        "Central Locking",
        "Music System",
        "Airbags",
        "ABS",
        "Alloy Wheels",
      ],
    },
  },
  properties: {
    title: {
      type: "text",
      label: "Property Title",
      required: true,
      placeholder: "e.g., 2 BHK Apartment in Downtown",
    },
    description: {
      type: "textarea",
      label: "Description",
      required: true,
      placeholder: "Describe your property...",
    },
    propertyType: {
      type: "select",
      label: "Property Type",
      required: true,
      options: ["Apartment", "House", "Villa", "Plot", "Commercial"],
    },
    bedrooms: {
      type: "number",
      label: "Bedrooms",
      required: true,
      min: 1,
      max: 10,
    },
    bathrooms: {
      type: "number",
      label: "Bathrooms",
      required: true,
      min: 1,
      max: 10,
    },
    area: { type: "number", label: "Area (sq ft)", required: true, min: 100 },
    floor: {
      type: "number",
      label: "Floor",
      required: false,
      min: 0,
      max: 100,
    },
    totalFloors: {
      type: "number",
      label: "Total Floors",
      required: false,
      min: 1,
      max: 100,
    },
    age: {
      type: "number",
      label: "Property Age (years)",
      required: false,
      min: 0,
      max: 100,
    },
    furnished: {
      type: "select",
      label: "Furnishing",
      required: true,
      options: ["Furnished", "Semi-Furnished", "Unfurnished"],
    },
    features: {
      type: "checkbox",
      label: "Features",
      options: [
        "Parking",
        "Lift",
        "Security",
        "Garden",
        "Gym",
        "Swimming Pool",
        "Power Backup",
        "Water Supply",
      ],
    },
  },
  furniture: {
    title: {
      type: "text",
      label: "Item Title",
      required: true,
      placeholder: "e.g., 3 Seater Sofa in Excellent Condition",
    },
    description: {
      type: "textarea",
      label: "Description",
      required: true,
      placeholder: "Describe your furniture...",
    },
    condition: {
      type: "select",
      label: "Condition",
      required: true,
      options: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    material: {
      type: "text",
      label: "Material",
      required: true,
      placeholder: "e.g., Wood, Leather, Fabric",
    },
    dimensions: {
      type: "text",
      label: "Dimensions",
      required: false,
      placeholder: "e.g., 6ft x 3ft x 2ft",
    },
    color: {
      type: "text",
      label: "Color",
      required: true,
      placeholder: "e.g., Brown",
    },
    age: {
      type: "number",
      label: "Age (months)",
      required: false,
      min: 0,
      max: 120,
    },
    features: {
      type: "checkbox",
      label: "Features",
      options: [
        "Reclining",
        "Storage",
        "Modular",
        "Antique",
        "Handmade",
        "Branded",
      ],
    },
  },
  electronics: {
    title: {
      type: "text",
      label: "Product Title",
      required: true,
      placeholder: "e.g., iPhone 13 Pro Max 256GB",
    },
    description: {
      type: "textarea",
      label: "Description",
      required: true,
      placeholder: "Describe your product...",
    },
    brand: {
      type: "text",
      label: "Brand",
      required: true,
      placeholder: "e.g., Apple, Samsung, Sony",
    },
    model: {
      type: "text",
      label: "Model",
      required: true,
      placeholder: "e.g., iPhone 13 Pro Max",
    },
    condition: {
      type: "select",
      label: "Condition",
      required: true,
      options: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    warranty: {
      type: "select",
      label: "Warranty",
      required: true,
      options: ["Under Warranty", "Expired", "No Warranty"],
    },
    age: {
      type: "number",
      label: "Age (months)",
      required: false,
      min: 0,
      max: 60,
    },
    features: {
      type: "checkbox",
      label: "Features",
      options: [
        "Original Box",
        "Charger",
        "Earphones",
        "Screen Guard",
        "Case",
        "Bill Available",
      ],
    },
  },
  jobs: {
    title: {
      type: "text",
      label: "Job Title",
      required: true,
      placeholder: "e.g., Senior React Developer",
    },
    description: {
      type: "textarea",
      label: "Job Description",
      required: true,
      placeholder: "Describe the job role...",
    },
    company: {
      type: "text",
      label: "Company",
      required: true,
      placeholder: "e.g., Tech Corp",
    },
    experience: {
      type: "select",
      label: "Experience Required",
      required: true,
      options: [
        "0-1 years",
        "1-3 years",
        "3-5 years",
        "5-10 years",
        "10+ years",
      ],
    },
    jobType: {
      type: "select",
      label: "Job Type",
      required: true,
      options: [
        "Full-time",
        "Part-time",
        "Contract",
        "Freelance",
        "Internship",
      ],
    },
    workMode: {
      type: "select",
      label: "Work Mode",
      required: true,
      options: ["On-site", "Remote", "Hybrid"],
    },
    skills: {
      type: "text",
      label: "Required Skills",
      required: true,
      placeholder: "e.g., React, Node.js, MongoDB",
    },
    location: {
      type: "text",
      label: "Job Location",
      required: true,
      placeholder: "e.g., Mumbai, Maharashtra",
    },
    features: {
      type: "checkbox",
      label: "Benefits",
      options: [
        "Health Insurance",
        "WFH",
        "Flexible Hours",
        "Learning Budget",
        "Stock Options",
        "Gym Membership",
      ],
    },
  },
  services: {
    title: {
      type: "text",
      label: "Service Title",
      required: true,
      placeholder: "e.g., Professional House Cleaning Service",
    },
    description: {
      type: "textarea",
      label: "Service Description",
      required: true,
      placeholder: "Describe your service...",
    },
    serviceType: {
      type: "select",
      label: "Service Type",
      required: true,
      options: ["Home Services", "Professional", "Personal", "Business"],
    },
    experience: {
      type: "number",
      label: "Years of Experience",
      required: true,
      min: 0,
      max: 50,
    },
    availability: {
      type: "select",
      label: "Availability",
      required: true,
      options: ["Immediate", "Within a week", "Within a month", "Flexible"],
    },
    serviceArea: {
      type: "text",
      label: "Service Area",
      required: true,
      placeholder: "e.g., South Mumbai, Andheri",
    },
    features: {
      type: "checkbox",
      label: "Service Features",
      options: [
        "24/7 Available",
        "Insured",
        "Licensed",
        "Free Consultation",
        "Satisfaction Guarantee",
        "Emergency Service",
      ],
    },
  },
  fashion: {
    title: {
      type: "text",
      label: "Item Title",
      required: true,
      placeholder: "e.g., Designer Dress Size M",
    },
    description: {
      type: "textarea",
      label: "Description",
      required: true,
      placeholder: "Describe your fashion item...",
    },
    brand: {
      type: "text",
      label: "Brand",
      required: true,
      placeholder: "e.g., Zara, H&M, Local Brand",
    },
    size: {
      type: "text",
      label: "Size",
      required: true,
      placeholder: "e.g., M, L, XL, 32, 34",
    },
    condition: {
      type: "select",
      label: "Condition",
      required: true,
      options: ["New with Tags", "Like New", "Good", "Fair", "Poor"],
    },
    color: {
      type: "text",
      label: "Color",
      required: true,
      placeholder: "e.g., Black, Blue, Red",
    },
    material: {
      type: "text",
      label: "Material",
      required: false,
      placeholder: "e.g., Cotton, Silk, Denim",
    },
    age: {
      type: "number",
      label: "Age (months)",
      required: false,
      min: 0,
      max: 60,
    },
    features: {
      type: "checkbox",
      label: "Features",
      options: [
        "Original Tags",
        "Dry Cleaned",
        "Alterations Done",
        "Vintage",
        "Designer",
        "Limited Edition",
      ],
    },
  },
};

export default function DynamicFormPage() {
  const { currentStep, activeCategory } = useAdPostingStore((state) => state);
  // const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  const formSchema =
    formSchemas[activeCategory as keyof typeof formSchemas] || formSchemas.cars;

  const handleInputChange = (field: string, value: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    setFormValues((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationSelect = (location: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => {
    setSelectedLocation(location);
    handleInputChange("location", location.address);
  };

  // const validateForm = () => {
  //   const newErrors: Record<string, string> = {};

  //   Object.entries(formSchema).forEach(([field, config]) => {
  //     if ('required' in config && config.required && (!formValues[field] || formValues[field] === "")) {
  //       newErrors[field] = `${config.label} is required`;
  //     }

  //     if (config.type === "number" && formValues[field]) {
  //       const numValue = Number(formValues[field]);
  //       if (isNaN(numValue)) {
  //         newErrors[field] = `${config.label} must be a valid number`;
  //       } else if ('min' in config && config.min !== undefined && numValue < config.min) {
  //         newErrors[field] = `${config.label} must be at least ${config.min}`;
  //       } else if ('max' in config && config.max !== undefined && numValue > config.max) {
  //         newErrors[field] = `${config.label} must be at most ${config.max}`;
  //       }
  //     }
  //   });

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleNext = () => {
  //   if (validateForm()) {
  //     updateFormData({
  //       title: formValues.title,
  //       description: formValues.description,
  //       features: { ...formValues },
  //     });
  //     router.push("/post-ad/images");
  //   }
  // };

  // const handleBack = () => {
  //   router.push("/post-ad");
  // };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderField = (field: string, config: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    const value = formValues[field] || "";
    const error = errors[field];

    switch (config.type) {
      case "text":
        return (
          <FormField
            key={field}
            label={config.label}
            htmlFor={field}
            required={config.required}
            error={error}
          >
            <TextInput
              value={value as string}
              onChange={(value) => handleInputChange(field, value)}
              placeholder={config.placeholder}
            />
          </FormField>
        );

      case "textarea":
        return (
          <FormField
            key={field}
            label={config.label}
            htmlFor={field}
            required={config.required}
            error={error}
            fullWidth
          >
            <TextareaInput
              value={value as string}
              onChange={(value) => handleInputChange(field, value)}
              placeholder={config.placeholder}
              rows={4}
              maxLength={1000}
            />
          </FormField>
        );

      case "number":
        return (
          <FormField
            key={field}
            label={config.label}
            htmlFor={field}
            required={config.required}
            error={error}
          >
            <NumberInput
              value={value as number}
              onChange={(value) => handleInputChange(field, value)}
              placeholder={config.placeholder}
              min={"min" in config ? config.min : undefined}
              max={"max" in config ? config.max : undefined}
              unit={"unit" in config ? config.unit : undefined}
            />
          </FormField>
        );

      case "select":
        return (
          <FormField
            key={field}
            label={config.label}
            htmlFor={field}
            required={config.required}
            error={error}
          >
            <SelectInput
              value={value as string}
              onChange={(value) => handleInputChange(field, value)}
              options={config.options.map((option: string) => ({
                value: option,
                label: option,
              }))}
              placeholder={`Select ${config.label.toLowerCase()}`}
            />
          </FormField>
        );

      case "checkbox":
        return (
          <FormField
            key={field}
            label={config.label}
            htmlFor={field}
            required={config.required}
            error={error}
            fullWidth
          >
            <CheckboxInput
              value={Array.isArray(value) ? (value as string[]) : []}
              onChange={(value) => handleInputChange(field, value)}
              options={config.options.map((option: string) => ({
                value: option,
                label: option,
              }))}
              columns={2}
            />
          </FormField>
        );

      default:
        return null;
    }
  };

  return (
    <GoogleMapsProvider>
      <section className="h-full w-full max-w-[888px] mx-auto">
        {/* Main Container */}
        <div className="flex-1 w-full max-w-[888px] mx-auto mb-5">
          <div className="flex h-fit gap-10">
            {/* Left Column - Categories */}
            <div className="w-full space-y-3 md:w-2/3 h-full">
              <FormField
                label="Ad Images or Video"
                htmlFor="images"
                fullWidth={true}
              >
                <ImageGallery
                  images={images}
                  onImagesChange={(images) => setImages(images)}
                  maxImages={8}
                  gridCols={4}
                  maxFileSize={100}
                  acceptedFileTypes={[
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "video/mp4",
                  ]}
                />
              </FormField>

              <FormField
                label="Title"
                htmlFor="title"
                fullWidth={true}
                required={true}
                error={errors.title}
              >
                <TextInput
                  value={formValues.title || ""}
                  onChange={(value) => handleInputChange("title", value)}
                  placeholder="Enter ad title"
                />
              </FormField>
              {/* Location Selection */}

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

              {Object.entries(formSchema).length > 0 ? (
                Object.entries(formSchema).map(([field, config]) => {
                  return renderField(field, config);
                })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No form fields available. Please select a category first.</p>
                </div>
              )}
            </div>

            {/* Right Column - Image Upload Area */}
            <div className="sticky top-0 bg-gray-100 hidden md:flex flex-1 p-6 w-1/3 max-h-[800px] rounded-lg border-2 border-dashed border-gray-300  items-center justify-center">
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
        </div>
        <footer className="w-full bg-white sticky  bottom-0 left-0 right-0 max-w-[1080px] mx-auto md:border-t px-5 py-5">
          <div className="flex w-full justify-between max-w-[888px] mx-auto gap-3">
            <Button className="w-full" variant={"outline"}>
              Back
            </Button>
            <Button className="w-full" variant={"primary"}>
              Next
            </Button>
          </div>
        </footer>
      </section>
    </GoogleMapsProvider>
  );
}
