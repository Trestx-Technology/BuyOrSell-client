"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Clock,
  MapPin,
  CircleDollarSign,
  Camera,
  Type,
  Globe,
  Users,
} from "lucide-react";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUploadFile } from "@/hooks/useUploadFile";
import { cn } from "@/lib/utils";
import ResumeUploader from "./resume-uploader";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import PhoneNumberWithVerification from "@/components/global/phone-number-with-verification";
import { useSendPhoneOtp, useVerifyPhoneOtp } from "@/hooks/useUsers";
import {
  useCrateOrUpdateJobseekerProfilePartialMe,
  useCreateJobseekerProfile,
} from "@/hooks/useJobseeker";
import { useAuthStore } from "@/stores/authStore";
import {
  basicDetailsSchema,
  type BasicDetailsSchemaType,
  workStatusSchema,
} from "@/schemas/jobseeker.schema";
import { toast } from "sonner";
import { JobseekerProfile } from "@/interfaces/job.types";

const NOTICE_PERIOD_OPTIONS = [
  { value: "15-days", label: "15 Days or less" },
  { value: "1-month", label: "1 Month" },
  { value: "2-months", label: "2 Months" },
  { value: "3-months", label: "3 Months" },
  { value: "immediately", label: "Immediately" },
] as const;

const WORK_STATUS_OPTIONS = [
  { value: "actively_looking", label: "Actively Looking" },
  { value: "open_to_opportunities", label: "Open to Opportunities" },
  { value: "not_looking", label: "Not Looking" },
] as const;

const LOCATION_OPTIONS = [
  { value: "uae", label: "In UAE" },
  { value: "abroad", label: "Abroad" },
] as const;

interface BasicDetailsProps {
  profile?: JobseekerProfile;
  isLoadingProfile: boolean;
}

// Helper to split phone number into code and number
const splitPhoneNumber = (fullNumber: string | undefined | null): { countryCode: string, number: string } | undefined => {
  if (!fullNumber) return undefined;
  // This is a simple heuristic, ideally we should use the countryCodes array to match
  // For now, assuming standard format +<code><number>
  // We can just pass the full string to PhoneNumberWithVerification and let it handle parsing if its smart enough
  // But checking how PhoneNumberWithVerification works, it expects separate props if we want to prefill state correctly?
  // Actually looking at PhoneNumberWithVerification implementation:
  // const parsed = parsePhoneNumber(value, countryCode);
  // So it handles parsing internally if we pass the full value.
  return undefined;
};

export default function BasicDetails({ profile, isLoadingProfile }: BasicDetailsProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const user = session?.user;

  // Check if session phone is verified
  // session.user.isPhoneVerified might be a thing? Or we rely on whether phone exists in session and is verified flag
  // Assuming session.user has isPhoneVerified or similar if we want to check that.
  // Actually, requested: "display message saying you need to verify the number only is user doesnt has the verified number in the sessio"

  const sessionPhone = user?.phoneNo;
  const isSessionPhoneVerified = user?.phoneVerified; // Assuming this property exists on User type, otherwise we might need to check how verification is stored.
  // If isPhoneVerified doesn't exist on type, we might check if phone is present.

  const { mutate: updateProfile, isPending: isUpdating } =
    useCrateOrUpdateJobseekerProfilePartialMe();
  const { mutate: createProfile, isPending: isCreating } =
    useCreateJobseekerProfile();

  const isSubmitting = isUpdating || isCreating;

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
      // Prefill contact phone from profile if available, otherwise from session if verified
      contactPhone: profile?.contactPhone || (user?.phoneVerified ? user?.phoneNo : undefined),
      resumeFileUrl: undefined,
      workStatus: undefined, // Removed default value as requested
      experienceYears: profile?.experienceYears,
      currentCtc: profile?.currentCtc,
      expectedCtc: profile?.expectedCtc,
      location: profile?.location,
      noticePeriodDays: profile?.noticePeriodDays,
      headline: profile?.headline || "",
      gender: profile?.gender || "",
      nationality: profile?.nationality || "",
      currentDesignation: profile?.currentDesignation || "",
      photoUrl: profile?.photoUrl || user?.image || "",
    },
  });

  const {
    register,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // Load profile data into form
  useEffect(() => {
    if (profile && !isLoadingProfile) {
      form.reset({
        name: profile.name || "",
        contactEmail: profile.contactEmail || user?.email || "",
        contactPhone: profile.contactPhone || (user?.phoneVerified ? user?.phoneNo : undefined),
        resumeFileUrl: profile.resumeFileUrl || undefined,
        workStatus:
          (profile.workStatus as (typeof workStatusSchema.options)[number]) || undefined,
        experienceYears: profile.experienceYears,
        currentCtc: profile.currentCtc,
        expectedCtc: profile.expectedCtc,
        location: profile.location || undefined,
        noticePeriodDays: profile.noticePeriodDays,
        headline: profile.headline || "",
        gender: profile.gender || "",
        nationality: profile.nationality || "",
        currentDesignation: profile.currentDesignation || "",
        photoUrl: profile.photoUrl || user?.image || "",
      });
    }
  }, [profile, isLoadingProfile, form, user?.email, user?.image]);

  // Watch form values
  const contactPhone = watch("contactPhone");
  const contactEmail = watch("contactEmail");
  const resumeFileUrl = watch("resumeFileUrl");

  // OTP hooks
  const sendPhoneOtpMutation = useSendPhoneOtp();
  const verifyPhoneOtpMutation = useVerifyPhoneOtp();

  const handleResumeUploadComplete = useCallback(
    (fileUrl: string, fileName: string) => {
      setValue("resumeFileUrl", fileUrl, { shouldDirty: true, shouldValidate: true });
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
      contactPhone: data.contactPhone || undefined,
      resumeFileUrl: data.resumeFileUrl || undefined,
      workStatus: data.workStatus,
      experienceYears: data.experienceYears,
      currentCtc: data.currentCtc,
      expectedCtc: data.expectedCtc,
      location: data.location,
      noticePeriodDays: data.noticePeriodDays,
      headline: data.headline,
      gender: data.gender,
      nationality: data.nationality,
      currentDesignation: data.currentDesignation,
      photoUrl: data.photoUrl,
    };

    const mutation = profile?._id ? updateProfile : createProfile;

    mutation(payload, {
      onSuccess: () => {
        toast.success(
          profile?._id
            ? "Basic details updated successfully"
            : "Jobseeker profile created successfully"
        );
        router.push("/jobs/listing/my");
      },
    });
  };

  const onError = useCallback((errors: any) => {
    const errorMessages = Object.values(errors);
    if (errorMessages.length > 0) {
      const firstError = errorMessages[0] as any;
      if (firstError.message) {
        toast.error(firstError.message);
      } else {
        const nestedError = Object.values(firstError)[0] as any;
        toast.error(nestedError?.message || "Please check the required fields");
      }
    }
  }, []);

  // Photo Upload logic
  const { upload: uploadPhoto, isUploading: isUploadingPhoto } = useUploadFile({
    maxFileSize: 2,
    acceptedFileTypes: ["image/jpeg", "image/png"],
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const photoUrl = await uploadPhoto(file);
        if (photoUrl) {
          setValue("photoUrl", photoUrl, { shouldDirty: true });
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-purple/5 to-transparent border border-purple/10 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm">
        <div className="relative group">
          <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-2xl transition-transform hover:scale-105 duration-300">
            <AvatarImage src={watch("photoUrl") || undefined} className="object-cover" />
            <AvatarFallback className="bg-purple text-white text-4xl font-bold">
              {watch("name")?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <label className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-purple hover:text-white transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:scale-110">
            <Camera className="w-5 h-5" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isUploadingPhoto}
            />
          </label>
          {isUploadingPhoto && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6 w-full text-center md:text-left">
          <div className="space-y-1">
            <Typography variant="h2" className="text-dark-blue dark:text-white font-bold text-2xl tracking-tight">
              Profile Details
            </Typography>
            <Typography variant="body-small" className="text-grey-blue dark:text-gray-400">
              Control your professional identity and basic contact information.
            </Typography>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-grey-blue dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-purple" />
                Professional Headline
              </label>
              <Input
                {...register("headline")}
                placeholder="e.g. Senior Product Designer | UI/UX Enthusiast"
                className="bg-white/50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-purple/20 transition-all h-12"
              />
              {errors.headline && (
                <p className="text-xs text-red-500 mt-1">{errors.headline.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-[#E2E2E2] dark:border-gray-800 rounded-2xl p-8 space-y-10 shadow-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section: Personal Info */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2 bg-purple/10 rounded-lg">
              <User className="w-5 h-5 text-purple" />
            </div>
            <Typography variant="h3" className="text-lg font-bold text-dark-blue dark:text-white">
              Personal Information
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input
              {...register("name")}
              label="Full Name"
              isRequired
              placeholder="Your Full Name"
              error={errors.name?.message}
              className="rounded-xl h-12"
            />
            <Input
              {...register("contactEmail")}
              label="Email Address"
              isRequired
              placeholder="your.email@example.com"
              type="email"
              error={errors.contactEmail?.message}
              className="rounded-xl h-12"
            />
            
            <FormField
              label="Gender"
              htmlFor="gender"
              error={errors.gender?.message}
            >
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full rounded-xl h-12 bg-white dark:bg-gray-900 border-[#E2E2E2] dark:border-gray-800 text-grey-blue">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple" />
                        <SelectValue placeholder="Select gender" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <Input
              {...register("nationality")}
              label="Nationality"
              placeholder="e.g. United Arab Emirates"
              className="rounded-xl h-12"
              leftIcon={<Globe className="w-4 h-4 text-purple" />}
            />
          </div>
        </section>

        {/* Section: Professional Status */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2 bg-purple/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple" />
            </div>
            <Typography variant="h3" className="text-lg font-bold text-dark-blue dark:text-white">
              Work Status & Experience
            </Typography>
          </div>

          <FormField
            label="Work Status"
            htmlFor="workStatus"
            required={true}
            error={errors.workStatus?.message}
          >
            <Controller
              name="workStatus"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-x-8 gap-y-4 pt-2"
                >
                  {WORK_STATUS_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center gap-3 group">
                      <RadioGroupItem value={option.value} id={option.value} className="text-purple border-purple/30" />
                      <label
                        htmlFor={option.value}
                        className="text-sm font-medium text-grey-blue group-hover:text-purple transition-colors cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField
              label="Current Designation"
              htmlFor="currentDesignation"
              error={errors.currentDesignation?.message}
            >
              <Input
                {...register("currentDesignation")}
                placeholder="e.g. Senior Developer"
                className="rounded-xl h-12"
                leftIcon={<Briefcase className="w-4 h-4 text-purple" />}
              />
            </FormField>

            <FormField
              label="Years of Experience"
              htmlFor="experienceYears"
              required={true}
              error={errors.experienceYears?.message}
            >
              <Controller
                name="experienceYears"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(value) => {
                      const parsed = Number.parseInt(value, 10);
                      field.onChange(isNaN(parsed) ? undefined : parsed);
                    }}
                  >
                    <SelectTrigger className="w-full rounded-xl h-12 bg-white dark:bg-gray-900 border-[#E2E2E2] dark:border-gray-800 text-grey-blue">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple" />
                        <SelectValue placeholder="Select years of experience" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
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
          </div>
        </section>

        {/* Section: Compensation & Location */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2 bg-purple/10 rounded-lg">
              <CircleDollarSign className="w-5 h-5 text-purple" />
            </div>
            <Typography variant="h3" className="text-lg font-bold text-dark-blue dark:text-white">
              Compensation & Location
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField
              label="Current Salary (Monthly AED)"
              htmlFor="currentCtc"
              required={true}
              error={errors.currentCtc?.message}
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
                      const parsed = Number.parseFloat(value);
                      field.onChange(isNaN(parsed) ? undefined : parsed);
                    }}
                    leftIcon={
                      <Image
                        src={ICONS.currency.aed}
                        alt="AED"
                        width={16}
                        height={16}
                        className="opacity-60"
                      />
                    }
                    placeholder="Enter Current Amount"
                    type="number"
                    className="rounded-xl h-12"
                  />
                )}
              />
            </FormField>

            <FormField
              label="Expected Salary (Monthly AED)"
              htmlFor="expectedCtc"
              required={true}
              error={errors.expectedCtc?.message}
            >
              <Controller
                name="expectedCtc"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const parsed = Number.parseFloat(value);
                      field.onChange(isNaN(parsed) ? undefined : parsed);
                    }}
                    leftIcon={
                      <Image
                        src={ICONS.currency.aed}
                        alt="AED"
                        width={16}
                        height={16}
                        className="opacity-60"
                      />
                    }
                    placeholder="Enter Expected Amount"
                    type="number"
                    className="rounded-xl h-12"
                  />
                )}
              />
            </FormField>

            <FormField
              label="Current Location"
              htmlFor="location"
              required={true}
              error={errors.location?.message}
            >
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    className="flex gap-8 pt-2"
                  >
                    {LOCATION_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center gap-3 group">
                        <RadioGroupItem value={option.value} id={`loc-${option.value}`} className="text-purple border-purple/30" />
                        <label
                          htmlFor={`loc-${option.value}`}
                          className="text-sm font-medium text-grey-blue group-hover:text-purple transition-colors cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </FormField>
          </div>
        </section>

        {/* Section: Contact & Notice Period */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2 bg-purple/10 rounded-lg">
              <Phone className="w-5 h-5 text-purple" />
            </div>
            <Typography variant="h3" className="text-lg font-bold text-dark-blue dark:text-white">
              Contact & Availability
            </Typography>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="relative group">
              {!user?.phoneVerified && !profile?.contactPhone && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <Typography variant="caption" className="text-yellow-700 dark:text-yellow-500 font-medium">
                    Phone verification is required to build trust with recruiters.
                  </Typography>
                </div>
              )}
              <PhoneNumberWithVerification
                error={errors.contactPhone?.message}
                value={contactPhone || user?.phoneNo || ""}
                onPhoneVerified={handlePhoneVerified}
                onSendOTP={handleSendOTP}
                onVerifyOTP={handleVerifyOTP}
                label="Verified Mobile Number"
                description="Your primary contact number for recruiters."
                required={true}
              />
            </div>

            <FormField
              label="Notice Period"
              htmlFor="noticePeriodDays"
              required={true}
              error={errors.noticePeriodDays?.message}
            >
              <Typography variant="caption" className="text-grey-blue dark:text-gray-400 mb-4 block">
                Let recruiters know when you can start your next role.
              </Typography>
              <Controller
                name="noticePeriodDays"
                control={control}
                render={({ field }) => {
                  const getDaysFromOption = (option: string): number | string | undefined => {
                    switch (option) {
                      case "15-days": return 15;
                      case "1-month": return 30;
                      case "2-months": return 60;
                      case "3-months": return 90;
                      case "serving": return "serving";
                      case "immediately": return 0;
                      default: return undefined;
                    }
                  };

                  const getOptionFromDays = (days?: number | string) => {
                    if (days === "serving") return "serving";
                    if (days === 0) return "immediately";
                    if (typeof days === "number" && days <= 15) return "15-days";
                    if (typeof days === "number" && days <= 30) return "1-month";
                    if (typeof days === "number" && days <= 60) return "2-months";
                    if (typeof days === "number" && days <= 90) return "3-months";
                    return undefined;
                  };

                  const currentValue = getOptionFromDays(field.value);

                  return (
                    <div className="flex flex-wrap gap-3">
                      {NOTICE_PERIOD_OPTIONS.map((option) => (
                        <Button
                          variant={currentValue === option.value ? "primary" : "outline"}
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(getDaysFromOption(option.value))}
                          className={cn(
                            "px-6 py-2 rounded-full text-xs font-semibold transition-all duration-300",
                            currentValue === option.value 
                              ? "bg-purple text-white shadow-lg shadow-purple/20 scale-105" 
                              : "hover:border-purple hover:text-purple border-gray-200 dark:border-gray-800"
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
        </section>

          {/* Section: Resume */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="p-2 bg-purple/10 rounded-lg">
                <Type className="w-5 h-5 text-purple" />
              </div>
              <Typography variant="h3" className="text-lg font-bold text-dark-blue dark:text-white">
                Professional Resume
              </Typography>
            </div>

            <div className="group">
              <ResumeUploader
                isRequired
                onUploadComplete={handleResumeUploadComplete}
                initialFileName={resumeFileUrl ? "Resume uploaded" : undefined}
                error={errors.resumeFileUrl?.message}
              />
            </div>
          </section>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 p-2 mt-6">
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full sm:w-auto order-2 sm:order-1 px-8 rounded-xl text-grey-blue hover:text-dark-blue h-12"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || isLoadingProfile || isUploadingPhoto}
          className="w-full sm:w-auto order-1 sm:order-2 bg-purple text-white px-12 h-12 rounded-xl hover:bg-purple/90 shadow-xl shadow-purple/20 transition-all active:scale-95"
        >
          {isSubmitting ? "Saving Experience..." : "Save & Continue"}
        </Button>
      </div>
    </form>
  );
}
