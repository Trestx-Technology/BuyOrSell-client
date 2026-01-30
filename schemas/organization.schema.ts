import { z } from "zod";
import { OrganizationType } from "@/constants/enums";

// Business hours schema
export const businessHourSchema = z.object({
  day: z.number().min(1).max(7),
  open: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  close: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  closed: z.boolean(),
  allDay: z.boolean(),
});

// Certificate schema
export const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issuedOn: z.string().min(1, "Issue date is required"),
  expiresOn: z.string().optional(),
  fileId: z.string().optional(),
  url: z.string().optional(),
});

// Organization form schema
export const organizationSchema = z.object({
  type: z.nativeEnum(OrganizationType, {
    message: "Organization type must be one of: AGENCY, DEALERSHIP, COMPANY",
  }),
  country: z.string().min(1, "Country is required"),
  emirate: z.string().min(1, "Emirate is required"),
  tradeLicenseNumber: z.string().min(1, "Trade license number is required"),
  tradeLicenseExpiry: z.string().min(1, "Trade license expiry is required"),
  trn: z
    .string()
    .min(1, "TRN is required")
    .regex(/^\d{15}$/, "TRN must be exactly 15 digits"),
  legalName: z.string().min(1, "Legal name is required"),
  tradeName: z.string().min(1, "Trade name is required"),
  reraNumber: z.string().optional(),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  poBox: z.string().optional(),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  businessHours: z.array(businessHourSchema).optional(),
  certificates: z.array(certificateSchema).optional(),
  languages: z.array(z.string()).optional(),
  brands: z.array(z.string()).optional(),
  dealershipCodes: z.array(z.string()).optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

