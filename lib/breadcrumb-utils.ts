import { BreadcrumbItem } from "@/components/ui/breadcrumbs";

export const formatLabel = (segment: string): string =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const generateCategoryBreadcrumbs = (
  slugSegments: string[]
): BreadcrumbItem[] => {
  return slugSegments.map((segment, index) => {
    const path = slugSegments.slice(0, index + 1).join("/");
    const href = `/categories/${path}`;

    return {
      id: path || `segment-${index}`,
      label: formatLabel(decodeURIComponent(segment)),
      href,
      isActive: index === slugSegments.length - 1,
    };
  });
};
