"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdPostStatusDialog from "../../post-ad/_components/ad-post-status-dialog";
import { Container1080 } from "@/components/layouts/container-1080";

export default function PostJobSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const status =
    (searchParams.get("status") as "success" | "error" | "pending") ||
    "success";
  const title = searchParams.get("title") || "Job Posted Successfully";
  const message = searchParams.get("message") || "Your job listing has been submitted and is pending review.";

  const handleClose = () => {
    setIsDialogOpen(false);
    router.push("/");
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    router.push("/");
  };

  return (
    <Container1080>
      <AdPostStatusDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        status={status}
        title={title}
        message={message}
        onConfirm={handleConfirm}
      />
    </Container1080>
  );
}
