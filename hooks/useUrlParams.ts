import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useUrlParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrlParams = useCallback(
    (updates: Record<string, any>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          (Array.isArray(value) ? value.length > 0 : true)
        ) {
          if (Array.isArray(value)) {
            params.set(key, value.join(","));
          } else {
            params.set(key, String(value));
          }
        } else {
          params.delete(key);
        }
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const updateUrlParam = useCallback(
    (key: string, value: any) => {
      updateUrlParams({ [key]: value });
    },
    [updateUrlParams],
  );

  const clearUrlQueries = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return { updateUrlParam, updateUrlParams, clearUrlQueries, searchParams };
};
