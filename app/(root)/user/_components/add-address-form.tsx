"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormField } from "../../post-ad/details/_components/FormField";

interface AddressFormData {
  emirates: string;
  city: string;
  area: string;
  pincode: string;
  street: string;
  addressType: "home" | "office" | "other";
  isPrimary: boolean;
}

interface AddAddressFormProps {
  onSubmit?: (data: AddressFormData) => void;
  isLoading?: boolean;
}

export default function AddAddressForm({
  onSubmit,
  isLoading = false,
}: AddAddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    emirates: "Dubai",
    city: "",
    area: "",
    pincode: "",
    street: "",
    addressType: "home",
    isPrimary: false,
  });

  const [errors, setErrors] = useState<Partial<AddressFormData>>({});

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressFormData> = {};

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.area.trim()) {
      newErrors.area = "Area is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{5}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 5-digit pincode";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Address Details</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Type Selection */}
        <div className="space-y-3">
          <RadioGroup
            value={formData.addressType}
            onValueChange={(value: "home" | "office" | "other") =>
              handleInputChange("addressType", value)
            }
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="home" id="home" />
              <Label
                htmlFor="home"
                className="text-sm font-medium cursor-pointer"
              >
                Home
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="office" id="office" />
              <Label
                htmlFor="office"
                className="text-sm font-medium cursor-pointer"
              >
                Office
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label
                htmlFor="other"
                className="text-sm font-medium cursor-pointer"
              >
                Other
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Emirates Dropdown */}
        <FormField label="Emirates">
          <Select
            value={formData.emirates}
            onValueChange={(value) => handleInputChange("emirates", value)}
          >
            <SelectTrigger className="w-full bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select emirates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dubai">Dubai</SelectItem>
              <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
              <SelectItem value="Sharjah">Sharjah</SelectItem>
              <SelectItem value="Ajman">Ajman</SelectItem>
              <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
              <SelectItem value="Fujairah">Fujairah</SelectItem>
              <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {/* City Input */}
        <FormField label="City">
          <Input
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            error={errors.city}
            placeholder="Enter city name"
            className="bg-gray-50"
          />
        </FormField>

        {/* Area Input */}
        <FormField label="Area">
          <Input
            value={formData.area}
            onChange={(e) => handleInputChange("area", e.target.value)}
            error={errors.area}
            placeholder="Enter area name"
            className="bg-gray-50"
          />
        </FormField>

        {/* Pincode Input */}
        <FormField label="Pincode">
          <Input
            value={formData.pincode}
            onChange={(e) => handleInputChange("pincode", e.target.value)}
            error={errors.pincode}
            placeholder="00000"
            className="bg-gray-50"
            maxLength={5}
          />
        </FormField>

        {/* Street Input */}
        <FormField label="Street">
          <Input
            value={formData.street}
            onChange={(e) => handleInputChange("street", e.target.value)}
            error={errors.street}
            placeholder="Enter street address"
            className="bg-gray-50"
          />
        </FormField>

        {/* Set as Primary Checkbox */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="primary"
            checked={formData.isPrimary}
            onCheckedChange={(checked) =>
              handleInputChange("isPrimary", !!checked)
            }
          />
          <Label
            htmlFor="primary"
            className="text-sm font-medium text-gray-900 cursor-pointer"
          >
            Set as primary address
          </Label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Address"}
          </Button>
        </div>
      </form>
    </div>
  );
}
