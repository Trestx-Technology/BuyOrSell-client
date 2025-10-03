"use client";

import React, { useState } from "react";
import ProfileEditForm from "../../_components/profile-edit-form";
import Link from "next/link";
import { ChevronLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";

interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  address: string;
}

const ProfileEditPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Profile updated:", data);
      // Here you would typically make an API call to update the profile
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to profile page
    console.log("Cancel edit");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          Edit Profile
        </Typography>
      </div>
      <div className="px-4 xl:px-0 flex flex-col gap-5 py-8">
        <div className="flex items-center gap-2">
          <Link
            href={"/user/profile"}
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            My Profile
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <Link
            href={"/user/profile/edit"}
            className="text-purple-600 font-semibold text-sm"
          >
            Edit Profile
          </Link>
        </div>

        {/* Form */}
        <ProfileEditForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProfileEditPage;
