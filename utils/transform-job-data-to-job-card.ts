import { JobData } from "@/interfaces/job.types";
import { formatDistanceToNow } from "date-fns";

/**
 * Transform JobData object to JobCardProps
 */
export function transformJobDataToJobCard(job: JobData) {
  // Calculate posted time
  const postedTime = formatDistanceToNow(new Date(job.postedAt), {
    addSuffix: true,
  });

  // Get company name
  const company =
    job.organization?.tradeName ||
    job.organization?.legalName ||
    job.company ||
    "Company Name";

  // Get location
  const location = job.location || "Location not specified";

  // Get job type
  const jobType = job.jobType || "Full-time";

  // Get experience
  const experience = job.experience || "Not specified";

  // Get salary range
  const salaryMin = job.salaryMin || 0;
  const salaryMax = job.salaryMax || 0;

  // Get company logo
  const logo = job.organization?.logoUrl || undefined;

  return {
    id: job._id,
    title: job.title,
    company,
    experience,
    salaryMin,
    salaryMax,
    location,
    jobType,
    postedTime,
    logo,
    isFavorite: false,
  };
}
