import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";

/**
 * Transform AD object to JobCardProps
 * Extracts job-specific fields from extraFields or uses standard AD fields
 */
export const transformAdToJobCard = (ad: AD) => {
  // Helper to extract fields
  const getFieldValue = (fieldName: string): string => {
    if (Array.isArray(ad.extraFields)) {
      const field = ad.extraFields.find((f) =>
        f.name?.toLowerCase().includes(fieldName.toLowerCase()),
      );
      return field ? String(field.value) : "";
    }
    return String((ad.extraFields as any)?.[fieldName] || "");
  };

  const getSalaryFromAd = (type: "min" | "max"): number | undefined => {
    // 1. Check if direct properties exist (minSalary, maxSalary)
    const directValue = type === "min" ? ad.minSalary : ad.maxSalary;
    if (directValue !== undefined && directValue !== null && directValue > 0) {
      return directValue;
    }

    // 2. Fallback to extraFields
    if (Array.isArray(ad.extraFields)) {
      const salaryField = ad.extraFields.find(
        (field) =>
          field.name?.toLowerCase().includes("salary") &&
          (type === "min"
            ? field.name?.toLowerCase().includes("min")
            : field.name?.toLowerCase().includes("max")),
      );
      
      if (salaryField && salaryField.value !== undefined && salaryField.value !== null) {
        if (typeof salaryField.value === "number") return salaryField.value;
        if (typeof salaryField.value === "string") {
          const parsed = parseInt(salaryField.value.replace(/[^0-9]/g, ""));
          return isNaN(parsed) ? undefined : parsed;
        }
      }
    }
    return undefined;
  };

  const salaryMin = getSalaryFromAd("min") ?? ad.price ?? 0;
  const salaryMax = getSalaryFromAd("max") ?? 0;

  return {
    id: ad._id,
    title: ad.title || "",
    company:
      ad.organization?.tradeName || ad.organization?.legalName || "Company",
    experience: getFieldValue("experience") || "Not specified",
    location:
      typeof ad.location === "string"
        ? ad.location
        : ad.location?.city || "Location not specified",
    jobType: getFieldValue("jobType") || "Not specified",
    postedTime: formatDistanceToNow(new Date(ad.createdAt), {
      addSuffix: true,
    }),
    logo: ad.organization?.logoUrl,
    salaryMin,
    salaryMax,
    isFavorite: false,
    onFavorite: () => {},
    onShare: () => {},
  };
};
