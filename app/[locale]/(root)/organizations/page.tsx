"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";

export default function OrganizationsPage() {
  const router = useRouter();
  const { localePath } = useLocale();

  useEffect(() => {
    router.replace(localePath("/organizations/my"));
  }, [router, localePath]);

  return null;
}
