import { AdFilters } from "@/interfaces/ad";

export type AdQueryParamsOptions = {
  categoryName?: string;
  currentPage: number;
  itemsPerPage: number;
  searchQuery?: string;
  locationQuery?: string;
  filters: Record<
    string,
    string | number | string[] | number[] | undefined | any
  >;
  sortBy?: string;
  adType?: "JOB" | "AD";
};

export const buildAdQueryParams = ({
  categoryName,
  currentPage,
  itemsPerPage,
  searchQuery,
  locationQuery,
  filters,
  sortBy,
  adType,
}: AdQueryParamsOptions): AdFilters => {
  const apiParams: AdFilters = {
    page: currentPage,
    limit: itemsPerPage,
    category: categoryName,
    adType,
  };

  // Add search query if present
  if (searchQuery?.trim()) {
    apiParams.search = searchQuery.trim();
  }

  // Add location query if present
  if (locationQuery?.trim()) {
    apiParams.location = locationQuery.trim();
  }

  // Add price filter if present (from select dropdown)
  if (filters.price && typeof filters.price === "string") {
    switch (filters.price) {
      case "under-50k":
        apiParams.maxPrice = 50000;
        break;
      case "50k-100k":
        apiParams.minPrice = 50000;
        apiParams.maxPrice = 100000;
        break;
      case "100k-200k":
        apiParams.minPrice = 100000;
        apiParams.maxPrice = 200000;
        break;
      case "200k-500k":
        apiParams.minPrice = 200000;
        apiParams.maxPrice = 500000;
        break;
      case "over-500k":
        apiParams.minPrice = 500000;
        break;
    }
  }

  // Add salary filter (for jobs)
  const salaryFilter = filters.salary as string;
  if (salaryFilter) {
    if (salaryFilter === "under-10k") {
      apiParams.maxPrice = 10000;
    } else if (salaryFilter === "10k-20k") {
      apiParams.minPrice = 10000;
      apiParams.maxPrice = 20000;
    } else if (salaryFilter === "20k-30k") {
      apiParams.minPrice = 20000;
      apiParams.maxPrice = 30000;
    } else if (salaryFilter === "30k-50k") {
      apiParams.minPrice = 30000;
      apiParams.maxPrice = 50000;
    } else if (salaryFilter === "50k-100k") {
      apiParams.minPrice = 50000;
      apiParams.maxPrice = 100000;
    } else if (salaryFilter === "over-100k") {
      apiParams.minPrice = 100000;
    }
  }

  // Add deal filter if present
  if (filters.deal === "true") {
    apiParams.deal = true;
  } else if (filters.deal === "false") {
    apiParams.deal = false;
  }

  // Add date filters if present
  if (filters.fromDate && typeof filters.fromDate === "string") {
    apiParams.fromDate = filters.fromDate;
  }
  if (filters.toDate && typeof filters.toDate === "string") {
    apiParams.toDate = filters.toDate;
  }

  // Add isFeatured filter if present
  if (filters.isFeatured === "true") {
    apiParams.isFeatured = true;
  } else if (filters.isFeatured === "false") {
    apiParams.isFeatured = false;
  }

  // Add neighbourhood filter if present
  if (filters.neighbourhood && typeof filters.neighbourhood === "string") {
    apiParams.neighbourhood = filters.neighbourhood;
  }

  // Add hasVideo filter if present
  if (filters.hasVideo === "true") {
    apiParams.hasVideo = true;
  } else if (filters.hasVideo === "false") {
    apiParams.hasVideo = false;
  }

  // Add sort
  if (sortBy && sortBy !== "default") {
    switch (sortBy) {
      case "newest":
        apiParams.sort = "createdAt:desc";
        break;
      case "oldest":
        apiParams.sort = "createdAt:asc";
        break;
      case "price-asc":
        apiParams.sort = "price:asc";
        break;
      case "price-desc":
        apiParams.sort = "price:desc";
        break;
    }
  }

  return apiParams;
};
