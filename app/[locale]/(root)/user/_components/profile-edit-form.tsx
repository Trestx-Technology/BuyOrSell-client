"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, CameraIcon, Lock } from "lucide-react";
import Image from "next/image";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import PhoneNumberWithVerification from "@/components/global/phone-number-with-verification";
import UploadImageDialog from "./upload-image-dialog";
import { useGetProfile, useUpdateUser } from "@/hooks/useUsers";
import {
  useSendPhoneOtp,
  useVerifyPhoneOtp,
  useSendEmailOtp,
  useVerifyEmailOtp,
} from "@/hooks/useUsers";
import EmailWithVerification from "@/components/global/email-with-verification";
import { useLocale } from "@/hooks/useLocale";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  profileEditSchema,
  type ProfileEditFormData,
} from "@/schemas/profile-edit.schema";
import { countryCodes } from "@/schemas/signup.schema";
import type { UpdateUserPayload } from "@/interfaces/user.types";
import { useRouter } from "nextjs-toploader/app";
import { useAuthStore } from "@/stores/authStore";

/** Strip leading country code from a phone string. */
function stripCountryCode(phone: string): { code: string; digits: string } {
  if (!phone) return { code: "", digits: "" };
  const codes = countryCodes
    .map((c) => c.code)
    .sort((a, b) => b.length - a.length);
  const matched = codes.find((c) => phone.startsWith(c));
  if (matched) return { code: matched, digits: phone.slice(matched.length) };
  return { code: "", digits: phone };
}

export default function ProfileEditForm() {
  const router = useRouter();
  const { t, localePath } = useLocale();
  const { data: profileData } = useGetProfile();
  const sendPhoneOtpMutation = useSendPhoneOtp();
  const verifyPhoneOtpMutation = useVerifyPhoneOtp();
  const sendEmailOtpMutation = useSendEmailOtp();
  const verifyEmailOtpMutation = useVerifyEmailOtp();
  const updateUserMutation = useUpdateUser();

  const user = profileData?.data?.user;
  const userId = user?._id;
  const updateUserSession = useAuthStore((state) => state.updateUser);

  // --- State ---
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>();

  // --- Refs ---
  const countryCodeRef = useRef("+971");
  const phoneVerifiedLocally = useRef(false);
  const emailVerifiedLocally = useRef(false);
  const originalPhoneDigits = useRef("");
  const originalEmail = useRef("");
  const initializedRef = useRef(false);

  // --- Form ---
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    setError,
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phoneNo: "",
      gender: "MALE",
      lastName: "",
    },
  });

  // --- Single initialization effect (runs once when user data loads) ---
  useEffect(() => {
    if (!user || initializedRef.current) return;
    initializedRef.current = true;

    const rawPhone = user.phoneNo || "";
    const { code, digits } = stripCountryCode(rawPhone);
    countryCodeRef.current = code || user.countryCode || "+971";

    originalPhoneDigits.current = digits;
    originalEmail.current = user.email || "";

    reset({
      firstName: user.firstName || user.name || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNo: digits,
      gender:
        (user.gender?.toUpperCase() as "MALE" | "FEMALE" | "OTHER") || "MALE",
    });

    // Phone: trust the API's phoneVerified flag
    setIsPhoneVerified(!!user.phoneVerified);
    // Email: always require manual verification (Google auth doesn't count)
    setIsEmailVerified(false);
    setProfileImageUrl(user.image);
  }, [user, reset]);

  // --- Display helpers ---
  const displayName = useMemo(() => {
    if (user?.firstName && user?.lastName)
      return `${user.firstName} ${user.lastName}`;
    return user?.name || user?.firstName || "User";
  }, [user]);

  const joinedDate = useMemo(() => {
    return user?.createdAt
      ? format(new Date(user.createdAt), "dd MMMM yyyy")
      : null;
  }, [user?.createdAt]);

  // --- Handlers ---
  const handlePhoneChange = (
    _fullPhone: string,
    phoneOnly: string,
    code: string
  ) => {
    countryCodeRef.current = code;
    setValue("phoneNo", phoneOnly, { shouldValidate: true });
    // If user edits phone after it was verified, require re-verification
    if (phoneVerifiedLocally.current) {
      phoneVerifiedLocally.current = false;
      setIsPhoneVerified(false);
    }
  };

  const handlePhoneVerified = (fullPhone: string) => {
    phoneVerifiedLocally.current = true;
    setIsPhoneVerified(true);
    const { code, digits } = stripCountryCode(fullPhone);
    if (code) countryCodeRef.current = code;
    setValue("phoneNo", digits, { shouldValidate: true });
  };

  const handleEmailChange = (email: string) => {
    setValue("email", email, { shouldValidate: true });
    if (emailVerifiedLocally.current) {
      emailVerifiedLocally.current = false;
      setIsEmailVerified(false);
    }
  };

  const handleEmailVerified = (email: string) => {
    emailVerifiedLocally.current = true;
    setIsEmailVerified(true);
    setValue("email", email, { shouldValidate: true });
  };

  const handleImageUploaded = async (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
    if (!userId) return;
    updateUserMutation.mutate(
      { id: userId, data: { image: imageUrl } },
      { onSuccess: () => toast.success(t.user.profileEdit.updateSuccess) }
    );
  };

  const handleSendOTP = async (phoneNumber: string) => {
    sendPhoneOtpMutation.mutate(
      { phoneNo: phoneNumber },
      { onSuccess: () => toast.success("OTP sent to your phone number") }
    );
  };

  const handleVerifyOTP = async (
    phoneNumber: string,
    otp: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      verifyPhoneOtpMutation.mutate(
        { phoneNo: phoneNumber, otp },
        {
          onSuccess: () => {
            toast.success("Phone number verified successfully!");
            resolve(true);
          },
          onError: () => resolve(false),
        }
      );
    });
  };

  const handleSendEmailOTP = async (email: string) => {
    sendEmailOtpMutation.mutate(
      { email },
      { onSuccess: () => toast.success("OTP sent to your email address") }
    );
  };

  const handleVerifyEmailOTP = async (
    email: string,
    otp: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      verifyEmailOtpMutation.mutate(
        { email, otp },
        {
          onSuccess: () => {
            toast.success("Email verified successfully!");
            resolve(true);
          },
          onError: () => resolve(false),
        }
      );
    });
  };

  // --- Submit ---
  const onSubmit = async (data: ProfileEditFormData) => {
    if (!userId) return;

    const phoneChanged = data.phoneNo !== originalPhoneDigits.current;
    const emailChanged = data.email.trim() !== originalEmail.current;

    if (phoneChanged && !isPhoneVerified) {
      toast.error("Please verify your new phone number before updating.");
      return;
    }
    if (emailChanged && !isEmailVerified) {
      toast.error("Please verify your new email address before updating.");
      return;
    }

    const updatePayload: UpdateUserPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.trim(),
      phoneNo: data.phoneNo,
      countryCode: countryCodeRef.current,
      gender: data.gender,
      phoneVerified: isPhoneVerified,
      emailVerified: isEmailVerified,
    };

    updateUserMutation.mutate(
      { id: userId, data: updatePayload },
      {
        onSuccess: (response) => {
          // Update auth session with the fresh user data from server
          if (response?.data?.user) {
            const serverUser = response.data.user;
            updateUserSession({
              firstName: serverUser.firstName,
              lastName: serverUser.lastName,
              email: serverUser.email,
              phoneNo: serverUser.phoneNo,
              countryCode: serverUser.countryCode,
              phoneVerified: serverUser.phoneVerified,
              emailVerified: serverUser.emailVerified,
            });
          }
          toast.success(t.user.profileEdit.updateSuccess);
          router.push(localePath("/user/profile"));
        },
        onError: (error: any) => {
          const errorMessage = error.message || "Failed to update profile";
          const errorData = error.data;
          if (errorData && typeof errorData === "object") {
            Object.keys(errorData).forEach((key) => {
              if (
                ["email", "firstName", "lastName", "phoneNo"].includes(key)
              ) {
                setError(key as any, {
                  type: "server",
                  message: errorData[key] as string,
                });
              }
            });
          }
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleCancel = () => router.push(localePath("/user/profile"));
  const isLoading = updateUserMutation.isPending || isSubmitting;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 max-w-xl w-full mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowImageDialog(true)}
            className="w-22 h-22 rounded-full border-4 border-purple-100 overflow-hidden relative group"
          >
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={`${displayName}'s profile picture`}
                width={120}
                height={120}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-400">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
          <div
            className="absolute -top-1 -right-1 bg-purple text-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-purple-600 transition-colors group"
            onClick={() => setShowImageDialog(true)}
          >
            <CameraIcon className="size-4" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <h2 className="text-lg font-poppins font-semibold text-gray-900 dark:text-white">
            {displayName}
          </h2>
          {isPhoneVerified && isEmailVerified && (
            <Image
              src={"/verified-seller.svg"}
              alt="verified"
              width={16}
              height={16}
            />
          )}
        </div>

        {joinedDate && (
          <p className="text-xs text-gray-500 text-center -mt-2">
            Joined on {joinedDate}
          </p>
        )}
      </div>

      <UploadImageDialog
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
        currentImageUrl={profileImageUrl}
        onImageUploaded={handleImageUploaded}
      />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-3">
        <FormField label="First Name">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={errors.firstName?.message}
                placeholder="Enter your first name"
                className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            )}
          />
        </FormField>
        <FormField label="Last Name">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={errors.lastName?.message}
                placeholder="Enter your last name"
                className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            )}
          />
        </FormField>

        <Controller
          name="phoneNo"
          control={control}
          render={({ field }) => (
            <PhoneNumberWithVerification
              value={`${countryCodeRef.current}${field.value || ""}`}
              countryCode={countryCodeRef.current}
              onPhoneVerified={handlePhoneVerified}
              onPhoneChange={(full, phone, code) => {
                handlePhoneChange(full, phone, code);
              }}
              onSendOTP={handleSendOTP}
              onVerifyOTP={handleVerifyOTP}
              label="Mobile Number"
              required
              error={errors.phoneNo?.message}
              showEditButton={true}
              initialVerified={isPhoneVerified}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <EmailWithVerification
              value={field.value}
              onEmailVerified={handleEmailVerified}
              onEmailChange={(val) => {
                handleEmailChange(val);
              }}
              onSendOTP={handleSendEmailOTP}
              onVerifyOTP={handleVerifyEmailOTP}
              label="Email Address"
              required
              error={errors.email?.message}
              showEditButton={true}
              initialVerified={isEmailVerified}
            />
          )}
        />

        <FormField label="Gender">
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Password">
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
            <Lock className="size-5 text-dark-blue" />
            <span className="text-sm mt-1 ml-1 text-gray-700 dark:text-gray-300 flex-1">
              ********
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 h-auto"
              onClick={() =>
                router.push("/user/profile/settings/change-password")
              }
            >
              Change
            </Button>
          </div>
        </FormField>

        <FormField label="Address">
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
            <MapPin className="w-6 h-6 fill-dark-blue text-white" />
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
              Mariana, Dubai
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 h-auto"
              onClick={() => router.push("/user/address")}
            >
              Change
            </Button>
          </div>
        </FormField>

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
