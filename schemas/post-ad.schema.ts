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
  // Base schema with required fields - using preprocess to handle undefined values
  const baseSchema = z.object({
    organization: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Organization selection is required"),
    ),
    title: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Title is required"),
    ),
    description: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Description is required"),
    ),
    price: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return 0;
        if (typeof val === "string") {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        }
        return typeof val === "number" ? val : 0;
      },
      z.number().min(0, "Price must be greater than or equal to 0"),
    ),
    phoneNumber: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Phone number is required"),
    ),
    address: z.preprocess((val) => {
      if (val === undefined || val === null) {
        return { address: "" };
      }
      return val;
    }, addressSchema),
    images: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return [];
        return Array.isArray(val) ? val : [];
      },
      z.array(z.any()).min(1, "At least one image is required"),
    ),
    video: z.preprocess(
      (val) => {
        if (val === undefined || val === null || val === "") return undefined;
        return val;
      },
      z
        .string()
        .url("Please enter a valid video URL")
        .optional()
        .or(z.literal("")),
    ),
    connectionTypes: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === "string" && val !== "") return [val];
        return [];
      },
      z.array(z.string()).min(1, "At least one connection type is required"),
    ),
    isExchange: z.union([z.boolean(), z.string()]).optional(),
    exchangeTitle: z.preprocess(
      (val) => (val === undefined || val === null ? undefined : val),
      z.string().optional(),
    ),
    exchangeDescription: z.preprocess(
      (val) => (val === undefined || val === null ? undefined : val),
      z.string().optional(),
    ),
    exchangeImages: z.preprocess((val) => {
      if (val === undefined || val === null) return undefined;
      return Array.isArray(val) ? val : [];
    }, z.array(z.any()).optional()),
    deal: z.union([z.boolean(), z.string()]).optional(),

    dealValidThru: z.preprocess(
      (val) => (val === undefined || val === null ? undefined : val),
      z.string().optional(),
    ),
    discountedPrice: z.preprocess((val) => {
      if (val === undefined || val === null) return undefined;
      if (typeof val === "string") {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? undefined : parsed;
      }
      return typeof val === "number" ? val : undefined;
    }, z.number().min(0, "Discounted price must be at least 0").optional()),
    stockQuantity: z.preprocess((val) => {
      if (val === undefined || val === null) return undefined;
      if (typeof val === "string") {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? undefined : parsed;
      }
      return typeof val === "number" ? val : undefined;
    }, z.number().optional()),
    availability: z.preprocess(
      (val) => (val === undefined || val === null ? undefined : val),
      z.string().optional(),
    ),
  });

  // Add dynamic fields from category
  const dynamicFields: Record<string, z.ZodTypeAny> = {};
  if (category?.fields) {
    category.fields.forEach((field: Field) => {
      if (
        !AD_SYSTEM_FIELDS.includes(
          field.name as (typeof AD_SYSTEM_FIELDS)[number],
        )
      ) {
        // Create schema based on field type
        let fieldSchema: z.ZodTypeAny;

        if (field.type === "number" || field.type === "int") {
          let numSchema = z.number();
          if (field.min !== undefined && field.min !== null) {
            numSchema = numSchema.min(
              field.min,
              `Value must be at least ${field.min}`,
            );
          }
          if (field.max !== undefined && field.max !== null) {
            numSchema = numSchema.max(
              field.max,
              `Value must be at most ${field.max}`,
            );
          }
          fieldSchema =
            field.required || field.requires ? numSchema : numSchema.optional();
        } else if (field.type === "bool") {
          fieldSchema =
            field.required || field.requires
              ? z.boolean()
              : z.boolean().optional();
        } else if (field.type === "checkboxes") {
          fieldSchema =
            field.required || field.requires
              ? z.array(z.string()).min(1, `${field.name} is required`)
              : z.array(z.string()).optional();
        } else {
          // For string fields (dropdown, select, etc.), handle undefined properly
          if (field.required || field.requires) {
            fieldSchema = z.preprocess(
              (val) => (val === undefined || val === null ? "" : val),
              z.string().min(1, `${field.name} is required`),
            );
          } else {
            fieldSchema = z.preprocess(
              (val) => (val === undefined || val === null ? undefined : val),
              z.union([z.string(), z.array(z.string())]).optional(),
            );
          }
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
      },
    )
    .refine(
      (data) => {
        // If deal is enabled, validate dealValidThru
        const isDeal = data.deal === true || data.deal === "true";
        if (isDeal) {
          if (
            !data.dealValidThru ||
            (data.dealValidThru as string).trim() === ""
          ) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Valid till date is required",
        path: ["dealValidThru"],
      },
    )
    .refine(
      (data) => {
        // If deal is enabled, validate discountedPrice
        const isDeal = data.deal === true || data.deal === "true";
        if (isDeal) {
          if (
            data.discountedPrice === undefined ||
            (data.discountedPrice as number) < 0
          ) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Discounted price is required",
        path: ["discountedPrice"],
      },
    )
    .refine(
      (data) => {
        // Validate that discountedPrice is less than price when deal is enabled
        const isDeal = data.deal === true || data.deal === "true";
        if (
          isDeal &&
          data.discountedPrice !== undefined &&
          data.price !== undefined
        ) {
          const discountedPrice = data.discountedPrice as number;
          const price = data.price as number;
          if (discountedPrice >= price) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Discounted price must be less than the original price",
        path: ["discountedPrice"],
      },
    );
};

/**
 * Creates a dynamic Zod schema for job posting form validation
 * @param category - The category object containing field definitions
 * @returns A Zod schema with job-specific fields
 */
export const createPostJobSchema = (category?: SubCategory) => {
  // Base schema with required fields for jobs
  const baseSchema = z.object({
    organization: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Organization selection is required"),
    ),
    title: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Job title is required"),
    ),
    description: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Job description is required"),
    ),
    // Salary fields
    minSalary: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return 0;
        if (typeof val === "string") {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        }
        return typeof val === "number" ? val : 0;
      },
      z.number().min(0, "Minimum salary must be greater than or equal to 0"),
    ),
    maxSalary: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return 0;
        if (typeof val === "string") {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        }
        return typeof val === "number" ? val : 0;
      },
      z.number().min(0, "Maximum salary must be greater than or equal to 0"),
    ),
    // Job details
    jobMode: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Job mode is required"),
    ),
    jobShift: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Job shift is required"),
    ),
    phoneNumber: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val),
      z.string().min(1, "Phone number is required"),
    ),
    address: z.preprocess((val) => {
      if (val === undefined || val === null) {
        return { address: "" };
      }
      return val;
    }, addressSchema),
    connectionTypes: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === "string" && val !== "") return [val];
        return [];
      },
      z.array(z.string()).min(1, "At least one connection type is required"),
    ),
  });

  // Add dynamic fields from category (similar to ads, jobs might have specific custom fields)
  const dynamicFields: Record<string, z.ZodTypeAny> = {};
  if (category?.fields) {
    category.fields.forEach((field: Field) => {
      // Exclude standard fields if they are already in baseSchema (though job fields differ slightly)
      // For now, checks against AD_SYSTEM_FIELDS might be kept or adjusted if JOB_SYSTEM_FIELDS exist.
      // Assuming AD_SYSTEM_FIELDS covers basic overlap or we just rely on name check.

      if (
        !AD_SYSTEM_FIELDS.includes(
          field.name as (typeof AD_SYSTEM_FIELDS)[number],
        ) &&
        !["minSalary", "maxSalary", "jobMode", "jobShift"].includes(field.name)
      ) {
        // Create schema based on field type
        let fieldSchema: z.ZodTypeAny;

        if (field.type === "number" || field.type === "int") {
          let numSchema = z.number();
          if (field.min !== undefined && field.min !== null) {
            numSchema = numSchema.min(
              field.min,
              `Value must be at least ${field.min}`,
            );
          }
          if (field.max !== undefined && field.max !== null) {
            numSchema = numSchema.max(
              field.max,
              `Value must be at most ${field.max}`,
            );
          }
          fieldSchema =
            field.required || field.requires ? numSchema : numSchema.optional();
        } else if (field.type === "bool") {
          fieldSchema =
            field.required || field.requires
              ? z.boolean()
              : z.boolean().optional();
        } else if (field.type === "checkboxes") {
          fieldSchema =
            field.required || field.requires
              ? z.array(z.string()).min(1, `${field.name} is required`)
              : z.array(z.string()).optional();
        } else {
          // For string fields (dropdown, select, etc.), handle undefined properly
          if (field.required || field.requires) {
            fieldSchema = z.preprocess(
              (val) => (val === undefined || val === null ? "" : val),
              z.string().min(1, `${field.name} is required`),
            );
          } else {
            fieldSchema = z.preprocess(
              (val) => (val === undefined || val === null ? undefined : val),
              z.union([z.string(), z.array(z.string())]).optional(),
            );
          }
        }

        dynamicFields[field.name] = fieldSchema;
      }
    });
  }

  // Merge base schema with dynamic fields
  const mergedSchema = baseSchema.extend(dynamicFields);

  return mergedSchema.refine(
    (data) => {
      // Validate minSalary <= maxSalary if both are present
      // Use explicit type guards or checks to satisfy TypeScript
      const minSalary = data.minSalary as number | undefined | null;
      const maxSalary = data.maxSalary as number | undefined | null;

      if (minSalary != null && maxSalary != null) {
        if (maxSalary < minSalary) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"],
    },
  );
};

