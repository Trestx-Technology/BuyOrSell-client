/**
 * Application-wide enums and constants
 * 
 * This file contains all enum values used throughout the application.
 * Each enum includes comments indicating where it's being used.
 */

// ============================================================================
// ORGANIZATION ENUMS
// ============================================================================

/**
 * Organization Type Enum
 * Used in:
 * - app/(root)/organizations/new/page.tsx (form schema, select options)
 * - app/(root)/organizations/[id]/page.tsx (form schema, select options)
 * - interfaces/organization.types.ts (Organization interface)
 */
export enum OrganizationType {
  AGENCY = "AGENCY",
  DEALERSHIP = "DEALERSHIP",
  COMPANY = "COMPANY",
}

/**
 * Organization Type Options for Select Inputs
 * Used in:
 * - app/(root)/organizations/new/page.tsx (SelectInput component)
 * - app/(root)/organizations/[id]/page.tsx (SelectInput component)
 */
export const ORGANIZATION_TYPE_OPTIONS = [
  { value: OrganizationType.AGENCY, label: "Agency" },
  { value: OrganizationType.DEALERSHIP, label: "Dealership" },
  { value: OrganizationType.COMPANY, label: "Company" },
];

/**
 * Organization Status Enum
 * Used in:
 * - app/(root)/organizations/new/page.tsx (getStatusBadge function)
 * - app/(root)/organizations/[id]/page.tsx (getStatusBadge function)
 * - app/(root)/organizations/page.tsx (getStatusBadge function)
 * - components/global/SideMenu.tsx (getStatusBadge function)
 * - interfaces/organization.types.ts (Organization interface)
 */
export enum OrganizationStatus {
  PENDING = "pending",
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

/**
 * Organization Status Configuration
 * Maps status values to display text and styling
 * Used in:
 * - app/(root)/organizations/new/page.tsx (getStatusBadge function)
 * - app/(root)/organizations/[id]/page.tsx (getStatusBadge function)
 * - app/(root)/organizations/page.tsx (getStatusBadge function)
 * - components/global/SideMenu.tsx (getStatusBadge function)
 */
export const ORGANIZATION_STATUS_CONFIG: Record<
  OrganizationStatus,
  { text: string; bgColor: string; textColor: string }
> = {
  [OrganizationStatus.PENDING]: {
    text: "Draft",
    bgColor: "bg-[#FFF4E6]",
    textColor: "text-[#B88230]",
  },
  [OrganizationStatus.ACTIVE]: {
    text: "Active",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  [OrganizationStatus.INACTIVE]: {
    text: "Inactive",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  [OrganizationStatus.SUSPENDED]: {
    text: "Suspended",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
};

// ============================================================================
// TYPE HELPERS
// ============================================================================

/**
 * Type helper for Organization Type values
 * Used in Zod schemas and type checking
 */
export type OrganizationTypeValue = `${OrganizationType}`;

/**
 * Type helper for Organization Status values
 * Used in type checking and interfaces
 */
export type OrganizationStatusValue = `${OrganizationStatus}`;

