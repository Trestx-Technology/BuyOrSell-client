import { FilterConfig } from "@/app/[locale]/(root)/categories/_components/ads-filter";

/**
 * Default filter configuration for jobs listing page
 */
export const defaultJobFilters: FilterConfig[] = [
  {
    key: "location",
    label: "Location",
    type: "select",
    options: [
      { value: "dubai", label: "Dubai" },
      { value: "abu-dhabi", label: "Abu Dhabi" },
      { value: "sharjah", label: "Sharjah" },
      { value: "ajman", label: "Ajman" },
      { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
      { value: "fujairah", label: "Fujairah" },
      { value: "umm-al-quwain", label: "Umm Al Quwain" },
    ],
    placeholder: "Dubai",
  },
  {
    key: "salary",
    label: "Salary Range",
    type: "select",
    options: [
      { value: "under-10k", label: "Under 10,000" },
      { value: "10k-20k", label: "10,000 - 20,000" },
      { value: "20k-30k", label: "20,000 - 30,000" },
      { value: "30k-50k", label: "30,000 - 50,000" },
      { value: "50k-100k", label: "50,000 - 100,000" },
      { value: "over-100k", label: "Over 100,000" },
    ],
    placeholder: "Select Salary Range",
  },
  {
    key: "jobType",
    label: "Job Type",
    type: "select",
    options: [
      { value: "full-time", label: "Full Time" },
      { value: "part-time", label: "Part Time" },
      { value: "contract", label: "Contract" },
      { value: "temporary", label: "Temporary" },
      { value: "internship", label: "Internship" },
    ],
    placeholder: "Any Type",
  },
  {
    key: "workMode",
    label: "Work Mode",
    type: "select",
    options: [
      { value: "remote", label: "Remote" },
      { value: "on-site", label: "On-Site" },
      { value: "hybrid", label: "Hybrid" },
    ],
    placeholder: "Any Mode",
  },
  {
    key: "experience",
    label: "Experience",
    type: "select",
    options: [
      { value: "entry", label: "Entry Level" },
      { value: "mid", label: "Mid Level" },
      { value: "senior", label: "Senior Level" },
      { value: "executive", label: "Executive" },
    ],
    placeholder: "Any Experience",
  },
];

/**
 * Default filter configuration for jobseekers listing page
 */
export const defaultJobseekerFilters: FilterConfig[] = [
  {
    key: "location",
    label: "Location",
    type: "select",
    options: [
      { value: "dubai", label: "Dubai" },
      { value: "abu-dhabi", label: "Abu Dhabi" },
      { value: "sharjah", label: "Sharjah" },
      { value: "ajman", label: "Ajman" },
      { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
      { value: "fujairah", label: "Fujairah" },
      { value: "umm-al-quwain", label: "Umm Al Quwain" },
    ],
    placeholder: "Dubai",
  },
  {
    key: "salary",
    label: "Salary Range",
    type: "select",
    options: [
      { value: "under-10k", label: "Under 10,000" },
      { value: "10k-20k", label: "10,000 - 20,000" },
      { value: "20k-30k", label: "20,000 - 30,000" },
      { value: "30k-50k", label: "30,000 - 50,000" },
      { value: "50k-100k", label: "50,000 - 100,000" },
      { value: "over-100k", label: "Over 100,000" },
    ],
    placeholder: "Select Salary Range",
  },
  {
    key: "jobType",
    label: "Job Type",
    type: "select",
    options: [
      { value: "full-time", label: "Full Time" },
      { value: "part-time", label: "Part Time" },
      { value: "contract", label: "Contract" },
      { value: "temporary", label: "Temporary" },
      { value: "internship", label: "Internship" },
    ],
    placeholder: "Any Type",
  },
  {
    key: "workMode",
    label: "Work Mode",
    type: "select",
    options: [
      { value: "remote", label: "Remote" },
      { value: "on-site", label: "On-Site" },
      { value: "hybrid", label: "Hybrid" },
    ],
    placeholder: "Any Mode",
  },
  {
    key: "experience",
    label: "Experience",
    type: "select",
    options: [
      { value: "entry", label: "Entry Level" },
      { value: "mid", label: "Mid Level" },
      { value: "senior", label: "Senior Level" },
      { value: "executive", label: "Executive" },
    ],
    placeholder: "Any Experience",
  },
];
