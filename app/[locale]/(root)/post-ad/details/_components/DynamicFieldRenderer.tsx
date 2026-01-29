"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import { Field } from "@/interfaces/categories.types";
import { FormField } from "./FormField";
import { TextInput } from "./TextInput";
import { TextareaInput } from "./TextareaInput";
import { SelectInput } from "./SelectInput";
import { NumberInput } from "./NumberInput";
import { CheckboxInput } from "./CheckboxInput";
import { SelectableTabsInput } from "./SelectableTabsInput";
import { SearchableDropdownInput } from "./SearchableDropdownInput";
import { BooleanInput } from "./BooleanInput";
import { ColorPickerInput } from "./ColorPickerInput";
import { MultipleImageInput, ImageItem as MultipleImageItem } from "./MultipleImageInput";
import { MapComponent } from "./MapComponent";
import { ImageItem } from "./image-upload";

export type FormValues = Record<string, string | number | boolean | string[] | MultipleImageItem[] | ImageItem[] | {
  state?: string;
  country?: string;
  zipCode?: string;
  city?: string;
  street?: string;
  address?: string;
  coordinates?: number[];
  type?: string;
} | undefined | null>;

interface DynamicFieldRendererProps {
  field: Field;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  options: { value: string; label: string }[];
  formValues: FormValues;
  onInputChange: (field: string, value: string | number | boolean | string[] | MultipleImageItem[] | {
    state?: string;
    country?: string;
    zipCode?: string;
    city?: string;
    street?: string;
    address?: string;
    coordinates?: number[];
    type?: string;
  }) => void;
  selectedLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  } | null;
  onLocationSelect: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
    state?: string;
    country?: string;
    zipCode?: string;
    city?: string;
    street?: string;
  }) => void;
}

export const DynamicFieldRenderer = ({
  field,
  control,
  errors,
  options,
  onInputChange,
  selectedLocation,
  onLocationSelect,
}: DynamicFieldRendererProps) => {
  const fieldError = errors[field.name]?.message as string | undefined;

  switch (field.type) {
    case "string":
    case "text":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <TextInput
                value={(formField.value as string) || ""}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
                placeholder={field.value || field.default || `Enter ${field.name}`}
                error={fieldError}
              />
            )}
          />
        </FormField>
      );

    case "textArea":
    case "testArea":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
          fullWidth
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <TextareaInput
                value={(formField.value as string) || ""}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
                placeholder={field.value || field.default || `Enter ${field.name}`}
                rows={4}
                maxLength={field.max}
                error={fieldError}
              />
            )}
          />
        </FormField>
      );

    case "int":
    case "number":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
              min: field.min !== undefined ? { value: field.min, message: `Value must be at least ${field.min}` } : undefined,
              max: field.max !== undefined ? { value: field.max, message: `Value must be at most ${field.max}` } : undefined,
            }}
            render={({ field: formField }) => (
              <NumberInput
                value={(formField.value as number) || 0}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
                min={field.min}
                max={field.max}
                placeholder={field.value || field.default}
                error={fieldError}
              />
            )}
          />
        </FormField>
      );

    case "dropdown":
    case "selection":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <SelectInput
                value={(formField.value as string) || ""}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
                options={options}
                placeholder={field.value || field.default || `Select ${field.name}`}
                error={fieldError}
              />
            )}
          />
        </FormField>
      );

    case "searchableDropdown":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <SearchableDropdownInput
                value={(formField.value as string) || ""}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
                options={options}
                placeholder={field.value || field.default || `Select ${field.name}`}
                error={fieldError}
              />
            )}
          />
        </FormField>
      );

    case "selectableTabs":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
          fullWidth
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <SelectableTabsInput
                value={typeof formField.value === "string" ? formField.value : ""}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
                options={options}
              />
            )}
          />
        </FormField>
      );

    case "checkboxes":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
          fullWidth
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <CheckboxInput
                value={Array.isArray(formField.value) ? (formField.value as string[]) : []}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
                options={options}
                columns={2}
              />
            )}
          />
        </FormField>
      );

    case "bool":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <BooleanInput
                value={formField.value === true || formField.value === "true" || formField.value === "True"}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
              />
            )}
          />
        </FormField>
      );

    case "color":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <ColorPickerInput
                value={(formField.value as string) || ""}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
              />
            )}
          />
        </FormField>
      );

    case "image":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
          fullWidth
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <MultipleImageInput
                value={(formField.value as MultipleImageItem[]) || []}
                onChange={(val) => {
                  formField.onChange(val);
                  onInputChange(field.name, val);
                }}
                maxImages={field.max || 8}
              />
            )}
          />
        </FormField>
      );

    case "location":
      return (
        <FormField
          key={field.name}
          label={field.name}
          htmlFor={field.name}
          required={field.required || field.requires || false}
          error={fieldError}
          fullWidth
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: (field.required || field.requires) ? `${field.name} is required` : false,
            }}
            render={() => (
              <>
                <MapComponent
                  onLocationSelect={onLocationSelect}
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
      );

    case "file":
      // Handle file upload - can be added later
      return null;

    default:
      return null;
  }
};

