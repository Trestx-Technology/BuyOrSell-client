"use client";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import { useLocale } from "@/hooks/useLocale";

const Page = () => {
  const router = useRouter();
  const { localePath } = useLocale();
  useEffect(() => {
    router.push(localePath("/post-ad/select"));
  }, [router, localePath]);
  return null;
};

export default Page;
