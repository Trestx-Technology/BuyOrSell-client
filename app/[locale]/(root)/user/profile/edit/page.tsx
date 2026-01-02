"use client";

import React, { useState } from "react";
import ProfileEditForm from "../../_components/profile-edit-form";
import Link from "next/link";
import { ChevronLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container1080 } from "@/components/layouts/container-1080";

interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  address: string;
}

const ProfileEditPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t, localePath } = useLocale();
  const router = useRouter();

  const handleSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Profile updated:", data);
      toast.success(t.user.profileEdit.updateSuccess);
      router.push(localePath("/user/profile"));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t.user.profileEdit.updateFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(localePath("/user/profile"));
  };

  return (
    <Container1080>
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
          onClick={() => router.back()}
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          {t.user.profileEdit.pageTitle}
        </Typography>
      </div>
      <div className="px-4 xl:px-0 flex flex-col gap-5 py-8">
        <div className="flex items-center gap-2">
          <Link
            href={localePath("/user/profile")}
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            {t.user.profile.myProfile}
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <Link
            href={localePath("/user/profile/edit")}
            className="text-purple-600 font-semibold text-sm"
          >
            {t.user.profileEdit.editProfile}
          </Link>
        </div>

        {/* Form */}
        <ProfileEditForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </Container1080>
  );
};

export default ProfileEditPage;
