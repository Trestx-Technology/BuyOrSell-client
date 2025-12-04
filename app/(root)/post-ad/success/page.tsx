"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdPostStatusDialog from "../_components/ad-post-status-dialog";

export default function PostAdSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  
  const status = (searchParams.get("status") as "success" | "error" | "pending") || "success";
  const title = searchParams.get("title") || undefined;
  const message = searchParams.get("message") || undefined;

  const handleClose = () => {
    setIsDialogOpen(false);
    router.push("/");
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AdPostStatusDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        status={status}
        title={title}
        message={message}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

