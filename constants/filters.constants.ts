
import { FilterConfig } from "@/components/common/filter-control";

export const getStaticFilterConfig = (t: any): FilterConfig[] => [
  {
    key: "price",
    label: t.categories.filters.price,
    type: "range",
    min: 0,
    max: 1000000,
    step: 1000,
    isStatic: true,
    unit: "AED",
  },
  {
    key: "deal",
    label: t.categories.filters.deal,
    type: "select",
    options: [
      { value: "true", label: t.categories.boolean.yes },
      { value: "false", label: t.categories.boolean.no },
    ],
    placeholder: t.categories.placeholders.select,
    isStatic: true,
  },
  {
    key: "fromDate",
    label: t.categories.filters.fromDate,
    type: "calendar",
    placeholder: t.categories.placeholders.selectStartDate,
    isStatic: true,
  },
  {
    key: "toDate",
    label: t.categories.filters.toDate,
    type: "calendar",
    placeholder: t.categories.placeholders.selectEndDate,
    isStatic: true,
  },
  {
    key: "isFeatured",
    label: t.categories.filters.featured,
    type: "select",
    options: [
      { value: "true", label: t.categories.boolean.yes },
      { value: "false", label: t.categories.boolean.no },
    ],
    placeholder: t.categories.placeholders.select,
    isStatic: true,
  },
  {
    key: "neighbourhood",
    label: t.categories.filters.neighbourhood,
    type: "select",
    options: [
      { value: "dubai", label: t.categories.locations.dubai },
      { value: "abu-dhabi", label: t.categories.locations.abuDhabi },
      { value: "sharjah", label: t.categories.locations.sharjah },
      { value: "ajman", label: t.categories.locations.ajman },
      { value: "ras-al-khaimah", label: t.categories.locations.rasAlKhaimah },
      { value: "fujairah", label: t.categories.locations.fujairah },
      { value: "umm-al-quwain", label: t.categories.locations.ummAlQuwain },
    ],
    placeholder: t.categories.placeholders.select,
    isStatic: true,
  },
  {
    key: "hasVideo",
    label: t.categories.filters.hasVideo,
    type: "select",
    options: [
      { value: "true", label: t.categories.boolean.yes },
      { value: "false", label: t.categories.boolean.no },
    ],
    placeholder: t.categories.placeholders.select,
    isStatic: true,
  },
];
