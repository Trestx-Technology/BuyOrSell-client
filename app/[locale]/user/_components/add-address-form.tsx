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
import { FormField } from "@/app/(root)/post-ad/details/_components/FormField";
import { useLocale } from "@/hooks/useLocale";
import { useEmirates } from "@/hooks/useLocations";

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
  const { t, locale } = useLocale();
  const { data: emirates = [] } = useEmirates();
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

  const emirateOptions = emirates.map((emirate) => ({
    value: emirate.emirate,
    label: locale === "ar" ? emirate.emirateAr : emirate.emirate,
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-2xl w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          {t.user.address.addressDetails}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="home" className="text-sm font-medium cursor-pointer">
                {t.user.address.home}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="office" id="office" />
              <Label htmlFor="office" className="text-sm font-medium cursor-pointer">
                {t.user.address.office}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="text-sm font-medium cursor-pointer">
                {t.user.address.other}
              </Label>
            </div>
          </RadioGroup>
        </div>

        <FormField label="Emirates">
          <Select
            value={formData.emirates}
            onValueChange={(value) => handleInputChange("emirates", value)}
          >
            <SelectTrigger className="w-full bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select emirates" />
            </SelectTrigger>
            <SelectContent>
              {emirateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="City">
          <Input
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            error={errors.city}
            placeholder="Enter city name"
            className="bg-gray-50"
          />
        </FormField>

        <FormField label="Area">
          <Input
            value={formData.area}
            onChange={(e) => handleInputChange("area", e.target.value)}
            error={errors.area}
            placeholder="Enter area name"
            className="bg-gray-50"
          />
        </FormField>

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

        <FormField label="Street">
          <Input
            value={formData.street}
            onChange={(e) => handleInputChange("street", e.target.value)}
            error={errors.street}
            placeholder="Enter street address"
            className="bg-gray-50"
          />
        </FormField>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="primary"
            checked={formData.isPrimary}
            onCheckedChange={(checked) =>
              handleInputChange("isPrimary", !!checked)
            }
          />
          <Label htmlFor="primary" className="text-sm font-medium text-gray-900 cursor-pointer">
            Set as {t.user.address.primary.toLowerCase()} address
          </Label>
        </div>

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

