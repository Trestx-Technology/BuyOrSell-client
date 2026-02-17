import { BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { unSlugify } from "@/utils/slug-utils";

export const formatLabel = (segment: string): string => unSlugify(segment);

export const generateBreadcrumbs = (
  slugSegments: string[],
  basePath: string
): BreadcrumbItem[] => {
  return slugSegments.map((segment, index) => {
    const path = slugSegments.slice(0, index + 1).join("/");
    const href = `${basePath}/${path}`;

    return {
      id: path || `segment-${index}`,
      label: formatLabel(decodeURIComponent(segment)),
      href,
      isActive: index === slugSegments.length - 1,
    };
  });
};

export const generateCategoryBreadcrumbs = (
  slugSegments: string[]
): BreadcrumbItem[] => {
  return generateBreadcrumbs(slugSegments, "/categories");
};


export const generateExchangeBreadcrumbs = (
  slugSegments: string[],
): BreadcrumbItem[] => {
  return generateBreadcrumbs(slugSegments, "/exchange");
};
