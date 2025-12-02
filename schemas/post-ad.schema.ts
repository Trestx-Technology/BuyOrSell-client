import { z } from "zod";
import { Field } from "@/interfaces/categories.types";
import { SubCategory } from "@/interfaces/categories.types";
import { AD_SYSTEM_FIELDS } from "@/constants/ad.constants";

// Address object type for form values
export type AddressFormValue = {
  state?: string;
  country?: string;
  zipCode?: string;
  city?: string;
  street?: string;
  address?: string;
  coordinates?: number[];
  type?: string;
};

// Create Zod schema for address validation
export const addressSchema = z.object({
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  coordinates: z.array(z.number()).optional(),
  type: z.string().optional(),
});

/**
 * Creates a dynamic Zod schema for post-ad form validation based on category fields
 * @param category - The category object containing field definitions
 * @returns A Zod schema with base fields and dynamic category-specific fields
 */
export const createPostAdSchema = (category?: SubCategory) => {
  // Base schema with required fields
  const baseSchema = z.object({
    organization: z.string().min(1, "Organization selection is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: addressSchema,
    images: z.array(z.any()).min(1, "At least one image is required"),
    video: z.string().url("Please enter a valid video URL").optional().or(z.literal("")),
    connectionTypes: z
      .union([z.string(), z.array(z.string())])
      .refine(
        (val) => {
          if (Array.isArray(val)) return val.length > 0;
          return !!val;
        },
        "Connection type is required"
      ),
    isFeatured: z.union([z.boolean(), z.string()]).optional(),
    isExchange: z.union([z.boolean(), z.string()]).optional(),
    exchangeTitle: z.string().optional(),
    exchangeDescription: z.string().optional(),
    exchangeImages: z.array(z.any()).optional(),
    deal: z.union([z.boolean(), z.string()]).optional(),
    validity: z.string().optional(),
    dealValidThru: z.string().optional(),
    discountedPercent: z.number().min(0).max(100).optional(),
    stockQuantity: z.number().optional(),
    availability: z.string().optional(),
  });

  // Add dynamic fields from category
  const dynamicFields: Record<string, z.ZodTypeAny> = {};
  if (category?.fields) {
    category.fields.forEach((field: Field) => {
      if (!AD_SYSTEM_FIELDS.includes(field.name as typeof AD_SYSTEM_FIELDS[number])) {
        // Create schema based on field type
        let fieldSchema: z.ZodTypeAny;

        if (field.type === "number" || field.type === "int") {
          let numSchema = z.number();
          if (field.min !== undefined && field.min !== null) {
            numSchema = numSchema.min(
              field.min,
              `Value must be at least ${field.min}`
            );
          }
          if (field.max !== undefined && field.max !== null) {
            numSchema = numSchema.max(
              field.max,
              `Value must be at most ${field.max}`
            );
          }
          fieldSchema =
            field.required || field.requires
              ? numSchema
              : numSchema.optional();
        } else if (field.type === "checkboxes") {
          fieldSchema =
            field.required || field.requires
              ? z.array(z.string()).min(1, `${field.name} is required`)
              : z.array(z.string()).optional();
        } else {
          fieldSchema =
            field.required || field.requires
              ? z.string().min(1, `${field.name} is required`)
              : z.union([z.string(), z.array(z.string())]).optional();
        }

        dynamicFields[field.name] = fieldSchema;
      }
    });
  }

  // Merge base schema with dynamic fields
  const mergedSchema = baseSchema.extend(dynamicFields);

  // Add conditional validation using refine
  return mergedSchema
    .refine(
      (data) => {
        // If exchange is enabled, validate exchange fields
        const isExchange =
          data.isExchange === true || data.isExchange === "true";
        if (isExchange) {
          if (
            !data.exchangeTitle ||
            (data.exchangeTitle as string).trim() === ""
          ) {
            return false;
          }
          if (
            !data.exchangeDescription ||
            (data.exchangeDescription as string).trim() === ""
          ) {
            return false;
          }
        }
        return true;
      },
      {
        message:
          "Exchange ad title and description are required when exchange is enabled",
        path: ["exchangeTitle"],
      }
    )
    .refine(
      (data) => {
        // If deal is enabled, validate deal fields
        const isDeal = data.deal === true || data.deal === "true";
        if (isDeal) {
          if (!data.validity || (data.validity as string).trim() === "") {
            return false;
          }
          if (
            !data.dealValidThru ||
            (data.dealValidThru as string).trim() === ""
          ) {
            return false;
          }
          if (
            data.discountedPercent === undefined ||
            (data.discountedPercent as number) < 0 ||
            (data.discountedPercent as number) > 100
          ) {
            return false;
          }
        }
        return true;
      },
      {
        message:
          "Deal fields (validity, dealValidThru, discountedPercent) are required when deal is enabled",
        path: ["validity"],
      }
    );
};

