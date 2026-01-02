import { JobCardProps } from "@/app/[locale]/(root)/jobs/my-profile/_components/job-card";
import { AD } from "@/interfaces/ad";

/**
 * Transform AD object to JobCardProps
 * Extracts job-specific fields from extraFields or uses standard AD fields
 */
export function transformAdToJobCard(ad: AD): JobCardProps {
  // Extract job-specific fields from extraFields
  const extraFields = ad.extraFields || [];
  const extraFieldsMap: Record<string, string | string[] | number | boolean> = {};
  
  if (Array.isArray(extraFields)) {
    extraFields.forEach((field) => {
      if (typeof field === "object" && field !== null && "name" in field && "value" in field) {
        extraFieldsMap[field.name] = field.value;
      }
    });
  }

  // Extract company name from organization or extraFields
  const company =
    ad.organization?.tradeName ||
    ad.organization?.legalName ||
    (extraFieldsMap["company"] as string) ||
    (extraFieldsMap["Company"] as string) ||
    "Company Name";

  // Extract experience from extraFields
  const experience =
    (extraFieldsMap["experience"] as string) ||
    (extraFieldsMap["Experience Required"] as string) ||
    (extraFieldsMap["Experience"] as string) ||
    "Not specified";

  // Extract salary range
  const salaryMin =
    (typeof extraFieldsMap["salaryMin"] === "number"
      ? extraFieldsMap["salaryMin"]
      : typeof extraFieldsMap["salaryFrom"] === "number"
      ? extraFieldsMap["salaryFrom"]
      : typeof extraFieldsMap["Salary From"] === "number"
      ? extraFieldsMap["Salary From"]
      : ad.price) || 0;

  const salaryMax =
    (typeof extraFieldsMap["salaryMax"] === "number"
      ? extraFieldsMap["salaryMax"]
      : typeof extraFieldsMap["salaryTo"] === "number"
      ? extraFieldsMap["salaryTo"]
      : typeof extraFieldsMap["Salary To"] === "number"
      ? extraFieldsMap["Salary To"]
      : ad.price) || ad.price || 0;

  // Extract location
  const location =
    (typeof ad.location === "string"
      ? ad.location
      : ad.location?.city && ad.location?.state
      ? `${ad.location.city}, ${ad.location.state}`
      : ad.location?.city || ad.location?.state || "") ||
    (typeof ad.address === "object" && ad.address !== null
      ? ad.address.city && ad.address.state
        ? `${ad.address.city}, ${ad.address.state}`
        : ad.address.city || ad.address.state || ""
      : "") ||
    "Location not specified";

  // Extract job type
  const jobType =
    (extraFieldsMap["jobType"] as string) ||
    (extraFieldsMap["Job Type"] as string) ||
    (extraFieldsMap["Type"] as string) ||
    "Full-time";

  // Calculate posted time
  const postedTime = calculatePostedTime(ad.createdAt);

  // Get company logo
  const logo = ad.organization?.logoUrl || undefined;

  return {
    id: ad._id,
    title: ad.title,
    company,
    experience,
    salaryMin: typeof salaryMin === "number" ? salaryMin : 0,
    salaryMax: typeof salaryMax === "number" ? salaryMax : 0,
    location,
    jobType,
    postedTime,
    logo,
    isFavorite: false,
  };
}

/**
 * Calculate human-readable time since post
 */
function calculatePostedTime(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now.getTime() - created.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}hr${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  } else {
    return `${Math.floor(diffInMonths / 12)} year${Math.floor(diffInMonths / 12) > 1 ? "s" : ""} ago`;
  }
}

