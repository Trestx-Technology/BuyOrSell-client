"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import ResumeUploader from "./resume-uploader";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import PhoneNumberWithVerification from "@/components/global/phone-number-with-verification";
import { useSendPhoneOtp, useVerifyPhoneOtp } from "@/hooks/useUsers";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import {
  useGetJobseekerProfile,
  useCrateOrUpdateJobseekerProfilePartialMe,
} from "@/hooks/useJobseeker";
import { useAuthStore } from "@/stores/authStore";
import {
  basicDetailsSchema,
  type BasicDetailsSchemaType,
  workStatusSchema,
} from "@/schemas/jobseeker.schema";
import { toast } from "sonner";

const NOTICE_PERIOD_OPTIONS = [
  { value: "15-days", label: "15 Days or less" },
  { value: "1-month", label: "1 Month" },
  { value: "2-months", label: "2 Months" },
  { value: "3-months", label: "3 Months" },
  { value: "serving", label: "Serving Notice Period" },
  { value: "immediately", label: "Immediately" },
] as const;

const WORK_STATUS_OPTIONS = [
  { value: "fresher", label: "Fresher" },
  { value: "experienced", label: "Experienced" },
  { value: "open_to_opportunities", label: "Open to Opportunities" },
  { value: "actively_looking", label: "Actively Looking" },
  { value: "not_looking", label: "Not Looking" },
] as const;

const LOCATION_OPTIONS = [
  { value: "uae", label: "In UAE" },
  { value: "abroad", label: "Abroad" },
] as const;

export default function BasicDetails() {
  const { session } = useAuthStore();
  const user = session?.user;
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetJobseekerProfile();
  const { mutate: updateProfile, isPending: isSubmitting } =
    useCrateOrUpdateJobseekerProfilePartialMe();

  const form = useForm<BasicDetailsSchemaType>({
    resolver: zodResolver(basicDetailsSchema),
    mode: "onChange",
    defaultValues: {
      name: user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.email ||
          ""
        : "",
      contactEmail: user?.email || "",
      contactPhone: "",
      resumeFileUrl: "",
      workStatus: "experienced",
      experienceYears: undefined,
      currentCtc: undefined,
      location: "",
      noticePeriodDays: undefined,
    },
  });

  const { register, watch, setValue, control, handleSubmit } = form;

  // Load profile data into form
  useEffect(() => {
    if (profileData?.data?.profile && !isLoadingProfile) {
      const profile = profileData.data.profile;
      form.reset({
        name: profile.name || "",
        contactEmail: profile.contactEmail || user?.email || "",
        contactPhone: profile.contactPhone || "",
        resumeFileUrl: profile.resumeFileUrl || "",
        workStatus:
          profile.workStatus as (typeof workStatusSchema.options)[number],
        experienceYears: profile.experienceYears,
        currentCtc: profile.currentCtc,
        location: profile.location || "",
        noticePeriodDays: profile.noticePeriodDays,
      });
    }
  }, [profileData, isLoadingProfile, form, user?.email]);

  // Watch form values
  const contactPhone = watch("contactPhone");
  const contactEmail = watch("contactEmail");
  const resumeFileUrl = watch("resumeFileUrl");

  // OTP hooks
  const sendPhoneOtpMutation = useSendPhoneOtp();
  const verifyPhoneOtpMutation = useVerifyPhoneOtp();

  const handleResumeUploadComplete = useCallback(
    (fileUrl: string, fileName: string) => {
      setValue("resumeFileUrl", fileUrl, { shouldDirty: true });
    },
    [setValue]
  );

  const handleSendOTP = useCallback(
    async (phoneNumber: string) => {
      await sendPhoneOtpMutation.mutateAsync({ phoneNo: phoneNumber });
    },
    [sendPhoneOtpMutation]
  );

  const handleVerifyOTP = useCallback(
    async (phoneNumber: string, otp: string): Promise<boolean> => {
      try {
        await verifyPhoneOtpMutation.mutateAsync({ phoneNo: phoneNumber, otp });
        return true;
      } catch (error) {
        console.error("OTP verification failed:", error);
        return false;
      }
    },
    [verifyPhoneOtpMutation]
  );

  const handlePhoneVerified = useCallback(
    (phoneNumber: string) => {
      setValue("contactPhone", phoneNumber, { shouldDirty: true });
    },
    [setValue]
  );

  const onSubmit = (data: BasicDetailsSchemaType) => {
    const payload: Record<string, unknown> = {
      userId: user?._id,
      name:
        data.name ||
        (user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`.trim()
          : user?.email || ""),
      contactEmail: data.contactEmail || user?.email || "",
      contactPhone: data.contactPhone || "",
      resumeFileUrl: data.resumeFileUrl || "",
      workStatus: data.workStatus,
      experienceYears: data.experienceYears,
      currentCtc: data.currentCtc,
      location: data.location,
      noticePeriodDays: data.noticePeriodDays,
    };

    updateProfile(payload, {
      onSuccess: () => {
        toast.success("Basic details updated successfully");
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to update basic details");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 space-y-6">
        <Typography
          variant="h2"
          className="text-dark-blue font-bold text-2xl mb-6"
        >
          Basic Details
        </Typography>

        {/* Resume Upload */}
        <ResumeUploader
          isRequired
          onUploadComplete={handleResumeUploadComplete}
          initialFileName={resumeFileUrl ? "Resume uploaded" : undefined}
        />

        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register("name")}
            label="Name"
            isRequired
            placeholder="Your Full Name"
          />
          <Input
            {...register("contactEmail")}
            label="Email"
            isRequired
            placeholder="your.email@example.com"
            type="email"
          />
        </div>

        {/* Work Status */}
        <FormField label="Work Status" htmlFor="workStatus" required={true}>
          <Controller
            name="workStatus"
            control={control}
            defaultValue="experienced"
            render={({ field }) => (
              <RadioGroup
                value={field.value || "experienced"}
                onValueChange={field.onChange}
                className="flex gap-6"
              >
                {WORK_STATUS_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <label
                      htmlFor={option.value}
                      className="text-sm text-dark-blue cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </FormField>

        {/* Experience Years */}
        <FormField
          label="Experience (Years)"
          htmlFor="experienceYears"
          required={true}
        >
          <Controller
            name="experienceYears"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value?.toString() || ""}
                onValueChange={(value) =>
                  field.onChange(Number.parseInt(value, 10))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year} {year === 1 ? "Year" : "Years"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Current Salary */}
        <FormField
          label="Current Salary in Dirham (Monthly)"
          htmlFor="currentCtc"
          required={true}
        >
          <Controller
            name="currentCtc"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value?.toString() || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value ? Number.parseFloat(value) : undefined);
                }}
                leftIcon={
                  <Image
                    src={ICONS.currency.aed}
                    alt="AED"
                    width={16}
                    height={16}
                  />
                }
                placeholder="Enter Amount"
                type="number"
              />
            )}
          />
        </FormField>

        {/* Location */}
        <FormField label="Location" htmlFor="location" required={true}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value || ""}
                onValueChange={field.onChange}
                className="flex gap-6"
              >
                {LOCATION_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <label
                      htmlFor={option.value}
                      className="text-sm text-dark-blue cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </FormField>

        {/* Mobile Number */}
        <PhoneNumberWithVerification
          value={contactPhone || ""}
          onPhoneVerified={handlePhoneVerified}
          onSendOTP={handleSendOTP}
          onVerifyOTP={handleVerifyOTP}
          label="Mobile Number"
          description="Recruiters will contact you on this number."
          required={true}
        />

        {/* Notice Period */}
        <FormField
          label="Notice Period"
          htmlFor="noticePeriodDays"
          required={true}
        >
          <Typography variant="caption" className="text-grey-blue mb-3 block">
            Lets recruiters know your availability to join.
          </Typography>
          <Controller
            name="noticePeriodDays"
            control={control}
            render={({ field }) => {
              const getDaysFromOption = (
                option: string
              ): number | undefined => {
                switch (option) {
                  case "15-days":
                    return 15;
                  case "1-month":
                    return 30;
                  case "2-months":
                    return 60;
                  case "3-months":
                    return 90;
                  case "serving":
                    return undefined; // Special case
                  case "immediately":
                    return 0;
                  default:
                    return undefined;
                }
              };

              const getOptionFromDays = (days?: number): string => {
                if (days === undefined || days === null) return "serving";
                if (days === 0) return "immediately";
                if (days <= 15) return "15-days";
                if (days <= 30) return "1-month";
                if (days <= 60) return "2-months";
                if (days <= 90) return "3-months";
                return "3-months";
              };

              const currentValue = getOptionFromDays(field.value);

              return (
                <div className="flex flex-wrap gap-2">
                  {NOTICE_PERIOD_OPTIONS.map((option) => (
                    <Button
                      variant={
                        currentValue === option.value ? "primary" : "secondary"
                      }
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const days = getDaysFromOption(option.value);
                        field.onChange(days);
                      }}
                      className={cn(
                        "px-4 py-2 cursor-pointer rounded-full text-xs font-medium transition-all"
                      )}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              );
            }}
          />
        </FormField>
      </div>
      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting || isLoadingProfile}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
