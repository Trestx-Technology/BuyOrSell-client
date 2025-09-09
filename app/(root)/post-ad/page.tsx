"use client";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/post-ad/select");
  }, []);
  return null;
};

export default Page;
