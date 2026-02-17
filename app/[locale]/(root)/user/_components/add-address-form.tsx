"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { useLocale } from "@/hooks/useLocale";
import { useEmirates, useCities, useAreas } from "@/hooks/useLocations";
import { addressSchema, type AddressFormData } from "@/schemas/address.schema";

interface AddAddressFormProps {
  onSubmit?: (data: AddressFormData) => void;
  isLoading?: boolean;
  initialValues?: Partial<AddressFormData>;
}

export default function AddAddressForm({
  onSubmit,
  isLoading = false,
  initialValues,
}: AddAddressFormProps) {
  const { t, locale } = useLocale();
  const { data: emirates = [] } = useEmirates();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      emirate: initialValues?.emirate || "",
      city: initialValues?.city || "",
      area: initialValues?.area || "",
      pincode: initialValues?.pincode || "",
      street: initialValues?.street || "",
      addressType: initialValues?.addressType || "home",
      isPrimary: initialValues?.isPrimary || false,
    },
  });

  const selectedEmirate = watch("emirate");
  const { data: citiesData = [] } = useCities({
    emirate: selectedEmirate || undefined,
  });
  const { data: areasData = [] } = useAreas(selectedEmirate || undefined);

  // Track previous emirate to detect changes (not initial set)
  const previousEmirateRef = useRef<string | null>(null);

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      reset({
        emirate: initialValues.emirate || "",
        city: initialValues.city || "",
        area: initialValues.area || "",
        pincode: initialValues.pincode || "",
        street: initialValues.street || "",
        addressType: initialValues.addressType || "home",
        isPrimary: initialValues.isPrimary || false,
      });
      // Mark that we've initialized so we don't clear on the first emirate change
      previousEmirateRef.current = initialValues.emirate || "";
    }
  }, [initialValues, reset]);

  // Reset city and area when emirate changes (but not during initial load)
  useEffect(() => {
    // Only clear city/area if emirate actually changes from one value to another
    // Skip if this is the first time (previousEmirateRef.current is null) or if it's the same value
    if (
      selectedEmirate &&
      previousEmirateRef.current !== null &&
      previousEmirateRef.current !== selectedEmirate
    ) {
      setValue("city", "");
      setValue("area", "");
    }
    // Update the ref after the effect runs (only if emirate has a value)
    if (selectedEmirate) {
      previousEmirateRef.current = selectedEmirate;
    }
  }, [selectedEmirate, setValue]);

  const emirateOptions = emirates.map((emirate) => ({
    value: emirate.emirate,
    label: locale === "ar" ? emirate.emirateAr : emirate.emirate,
  }));

  // Handle cities - can be string[] or object[] with {city, cityAr}
  const cityOptions = (
    citiesData as (string | { city: string; cityAr?: string })[]
  ).map((city) => {
    if (typeof city === "string") {
      return { value: city, label: city };
    }
    return {
      value: city.city,
      label: locale === "ar" ? city.cityAr || city.city : city.city,
    };
  });

  // Handle areas - can be string[] or object[] with {area, areaAr}
  const areaOptions = (
    areasData as (string | { area: string; areaAr?: string })[]
  ).map((area) => {
    if (typeof area === "string") {
      return { value: area, label: area };
    }
    return {
      value: area.area,
      label: locale === "ar" ? area.areaAr || area.area : area.area,
    };
  });

  const onSubmitForm = (data: AddressFormData) => {
    onSubmit?.(data);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 max-w-2xl w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t.user.address.addressDetails}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 dark:text-white">
            Address Type
          </Label>
          {errors.addressType && (
            <p className="text-sm text-red-600">{errors.addressType.message}</p>
          )}
          <Controller
            name="addressType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label
                    htmlFor="home"
                    className="text-sm font-medium cursor-pointer"
                  >
                    {t.user.address.home}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="office" id="office" />
                  <Label
                    htmlFor="office"
                    className="text-sm font-medium cursor-pointer"
                  >
                    {t.user.address.office}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label
                    htmlFor="other"
                    className="text-sm font-medium cursor-pointer"
                  >
                    {t.user.address.other}
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        <FormField label="Emirates" error={errors.emirate?.message}>
          <Controller
            name="emirate"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
            )}
          />
        </FormField>

        <FormField label="City" error={errors.city?.message}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!selectedEmirate}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue
                    placeholder={
                      selectedEmirate ? "Select city" : "Select emirate first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Area" error={errors.area?.message}>
          <Controller
            name="area"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!selectedEmirate}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue
                    placeholder={
                      selectedEmirate ? "Select area" : "Select emirate first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {areaOptions.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Pincode" error={errors.pincode?.message}>
          <Controller
            name="pincode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={errors.pincode?.message}
                placeholder="00000"
                className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                maxLength={6}
              />
            )}
          />
        </FormField>

        <FormField label="Street" error={errors.street?.message}>
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={errors.street?.message}
                placeholder="Enter street address"
                className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
              />
            )}
          />
        </FormField>

        <div className="flex items-center space-x-3">
          <Controller
            name="isPrimary"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="primary"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label
            htmlFor="primary"
            className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
          >
            Set as {t.user.address.primary.toLowerCase()} address
          </Label>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Saving..." : "Save Address"}
          </Button>
        </div>
      </form>
    </div>
  );
}
