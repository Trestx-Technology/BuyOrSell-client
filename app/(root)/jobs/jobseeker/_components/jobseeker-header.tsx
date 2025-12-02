"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone, Download, MessageCircle } from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User } from "@/interfaces/user.types";
import { JobseekerProfile } from "@/interfaces/job.types";
import { UseFormReturn } from "react-hook-form";

interface JobseekerHeaderProps {
  jobseeker?: JobseekerProfile | User;
  onContact?: () => void;
  onDownloadResume?: () => void;
  form?: UseFormReturn<JobseekerProfile>;
  isEditMode?: boolean;
}

export default function JobseekerHeader({
  jobseeker,
  onContact,
  onDownloadResume,
  form,
  isEditMode = false,
}: JobseekerHeaderProps) {
  const profile = jobseeker as JobseekerProfile | undefined;
  const resumeUrl = profile?.resumeUrl;

  if (isEditMode && form) {
    const { register, watch } = form;
    const professionalTitle = watch("professionalTitle") || "";
    const currentCompany = watch("currentCompany") || "";
    const name = jobseeker?.name || "";

    return (
      <div className="relative w-full">
        {/* Cover Image */}
        <div className="w-full h-64 bg-gradient-to-r from-purple to-purple/80 relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-purple to-purple/80" />
        </div>

        {/* Profile Info Card */}
        <div className="max-w-[1280px] mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="size-32 bg-[#FAFAFC] rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                  {jobseeker?.image ? (
                    <Image
                      src={jobseeker.image}
                      alt={name || "Jobseeker"}
                      width={120}
                      height={120}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-purple font-bold text-4xl">
                      {(name || "J").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                {name && (
                  <div>
                    <label className="text-sm font-medium text-dark-blue mb-2 block">
                      Full Name
                    </label>
                    <Typography variant="body-large" className="text-dark-blue font-semibold">
                      {name}
                    </Typography>
                    <Typography variant="body-small" className="text-[#8A8A8A] text-xs mt-1">
                      Name cannot be changed here
                    </Typography>
                  </div>
                )}
                <Input
                  {...register("professionalTitle")}
                  label="Professional Title"
                  placeholder="e.g., Software Engineer, UI/UX Designer"
                />
                <Input
                  {...register("currentCompany")}
                  label="Current Company"
                  placeholder="e.g., Company Name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <div className="w-full h-64 bg-gradient-to-r from-purple to-purple/80 relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-purple to-purple/80" />
      </div>

      {/* Profile Info Card */}
      <div className="max-w-[1280px] mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="size-32 bg-[#FAFAFC] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                {jobseeker?.image ? (
                  <Image
                    src={jobseeker.image}
                    alt={jobseeker.name || "Jobseeker"}
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-purple font-bold text-4xl">
                    {(jobseeker?.name || "J").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Typography
                      variant="h1"
                      className="text-dark-blue font-bold text-3xl"
                    >
                      {jobseeker?.name}
                    </Typography>
                    {jobseeker?.isVerified && (
                      <Badge className="bg-green-100 text-green-800 px-2 py-1">
                        Verified
                      </Badge>
                    )}
                  </div>

                  {profile?.professionalTitle && (
                    <Typography
                      variant="body-large"
                      className="text-dark-blue font-medium text-lg mb-1"
                    >
                      {profile.professionalTitle}
                    </Typography>
                  )}

                  {profile?.currentCompany && (
                    <Typography
                      variant="body-small"
                      className="text-[#8A8A8A] text-sm mb-4"
                    >
                      At {profile.currentCompany}
                    </Typography>
                  )}

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jobseeker?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-purple" />
                        <Typography
                          variant="body-small"
                          className="text-dark-blue text-sm"
                        >
                          {jobseeker.email}
                        </Typography>
                      </div>
                    )}
                    {jobseeker?.phoneNo && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-purple" />
                        <Typography
                          variant="body-small"
                          className="text-dark-blue text-sm"
                        >
                          {jobseeker.phoneNo}
                        </Typography>
                      </div>
                    )}
                  </div>

                  {/* Profile Completion */}
                  {profile?.profileCompletion !== undefined && (
                    <div className="mt-4 flex items-center gap-2">
                      <Typography
                        variant="body-small"
                        className="text-[#8A8A8A] text-sm"
                      >
                        Profile Completion:
                      </Typography>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                        <div
                          className="bg-purple h-2 rounded-full transition-all"
                          style={{ width: `${profile.profileCompletion}%` }}
                        />
                      </div>
                      <Typography
                        variant="body-small"
                        className="text-dark-blue font-medium text-sm"
                      >
                        {profile.profileCompletion}%
                      </Typography>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {resumeUrl && onDownloadResume && (
                    <Button
                      onClick={onDownloadResume}
                      variant="outline"
                      className="border-purple text-purple hover:bg-purple/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  )}
                  {onContact && (
                    <Button
                      onClick={onContact}
                      className="bg-purple text-white hover:bg-purple/90"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

