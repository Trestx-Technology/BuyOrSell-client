"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useSendPhoneOtp, useVerifyPhoneOtp } from "@/hooks/useUsers";
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

export default function ProfileEditForm() {
  const router = useRouter();
  const { t, localePath } = useLocale();
  const { data: profileData } = useGetProfile();
  const sendPhoneOtpMutation = useSendPhoneOtp();
  const verifyPhoneOtpMutation = useVerifyPhoneOtp();

  const user = profileData?.data?.user;
  const userId = user?._id;
  const updateUserSession = useAuthStore((state) => state.updateUser);

  // Phone verification state
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    user?.image
  );

  // Initialize verified phone number
  const originalFullPhoneNumber = useMemo(() => {
    if (!user?.phoneNo) return "";
    const countryCode = user.countryCode || "+971";
    return user.phoneNo.startsWith("+")
      ? user.phoneNo
      : `${countryCode}${user.phoneNo}`;
  }, [user]);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phoneNo: undefined,
      gender: "MALE",
      lastName: "",
    },
  });

  // Initialize form data from user profile
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNo: user.phoneNo ? parseInt(user.phoneNo) : undefined,
        gender:
          (user.gender?.toUpperCase() as "MALE" | "FEMALE" | "OTHER") || "MALE",
      });
      setProfileImageUrl(user.image);
    }
  }, [user, reset]);

  // Initialize verified phone number
  useEffect(() => {
    if (originalFullPhoneNumber && !verifiedPhoneNumber) {
      setVerifiedPhoneNumber(originalFullPhoneNumber);
      setIsPhoneVerified(true);
    }
  }, [originalFullPhoneNumber, verifiedPhoneNumber]);

  // Update profile image when user data changes
  useEffect(() => {
    if (user?.image) {
      setProfileImageUrl(user.image);
    }
  }, [user?.image]);

  // Update phoneNo in form when verified phone number changes
  useEffect(() => {
    if (verifiedPhoneNumber) {
      const phoneWithoutCode = verifiedPhoneNumber.replace(/^\+\d{1,4}/, "");
      setValue("phoneNo", parseInt(phoneWithoutCode));
    }
  }, [verifiedPhoneNumber, setValue]);

  // Display helpers
  const displayName = useMemo(() => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.name || user?.firstName || "User";
  }, [user]);

  const joinedDate = useMemo(() => {
    return user?.createdAt
      ? format(new Date(user.createdAt), "dd MMMM yyyy")
      : null;
  }, [user?.createdAt]);

  const phoneNumberChanged = useMemo(() => {
    return (
      verifiedPhoneNumber && verifiedPhoneNumber !== originalFullPhoneNumber
    );
  }, [verifiedPhoneNumber, originalFullPhoneNumber]);

  // Update user mutation with onSuccess callback
  const updateUserMutation = useUpdateUser();

  // Handlers
  const handleImageUploaded = async (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
    if (!userId) return;

    updateUserMutation.mutate(
      {
        id: userId,
        data: { image: imageUrl },
      },
      {
        onSuccess: () => {
          toast.success(t.user.profileEdit.updateSuccess);
        },
      }
    );
  };

  const handleSendOTP = async (phoneNumber: string) => {
    sendPhoneOtpMutation.mutate(
      { phoneNo: phoneNumber },
      {
        onSuccess: () => {
          toast.success("OTP sent to your phone number");
        },
      }
    );
  };

  const handleVerifyOTP = async (
    phoneNumber: string,
    otp: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      verifyPhoneOtpMutation.mutate(
        {
          phoneNo: phoneNumber,
          otp: otp,
        },
        {
          onSuccess: () => {
            toast.success("Phone number verified successfully!");
            resolve(true);
          },
          onError: () => {
            // Error toast is handled by axios interceptor
            resolve(false);
          },
        }
      );
    });
  };

  const handlePhoneVerified = (phoneNumber: string) => {
    setVerifiedPhoneNumber(phoneNumber);
    setIsPhoneVerified(true);
  };

  const onSubmit = (data: ProfileEditFormData) => {
    if (!userId) return;

    // Check if phone number has changed and is verified
    if (phoneNumberChanged && !isPhoneVerified) {
      toast.error(
        "Please verify your new phone number before updating your profile."
      );
      return;
    }

    let phoneNo: string | undefined = data.phoneNo?.toString();
    let countryCode: string | undefined = user?.countryCode || "+971";

    if (phoneNumberChanged && verifiedPhoneNumber) {
      // Extract from verified phone number
      // Sort codes by length descending to match longest possible code (e.g. +971 vs +97)
      const codes = countryCodes.map(c => c.code).sort((a, b) => b.length - a.length);
      const matchedCode = codes.find(code => verifiedPhoneNumber.startsWith(code));

      if (matchedCode) {
        countryCode = matchedCode;
        phoneNo = verifiedPhoneNumber.slice(matchedCode.length);
      } else {
        // Fallback
        countryCode = user?.countryCode || "+971";
        phoneNo = verifiedPhoneNumber.replace(countryCode, ""); // Basic cleanup
      }
    } else {
      // Phone number didn't change, keep existing values
      phoneNo = user?.phoneNo;
      countryCode = user?.countryCode;
    }

    // Prepare update payload
    const updatePayload: UpdateUserPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.trim(),
      phoneNo: phoneNo,
      countryCode: countryCode,
      gender: data.gender,
    };

    updateUserMutation.mutate(
      {
        id: userId,
        data: updatePayload,
      },
      {
        onSuccess: () => {
          // Update auth session with new data
          updateUserSession({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email.trim(),
          });
          
          toast.success(t.user.profileEdit.updateSuccess);
          router.push(localePath("/user/profile"));
        },
      }
    );
  };

  const handleCancel = () => {
    router.push(localePath("/user/profile"));
  };

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
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-400">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <CameraIcon className="absolute -top-0 bg-purple text-white rounded-full p-1 -right-0 size-6 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <h2 className="text-lg font-poppins font-semibold text-gray-900 dark:text-white">
            {displayName}
          </h2>
          {user?.isVerified && (
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

        <PhoneNumberWithVerification
          value={verifiedPhoneNumber || originalFullPhoneNumber}
          countryCode={user?.countryCode || "+971"}
          onPhoneVerified={handlePhoneVerified}
          onSendOTP={handleSendOTP}
          onVerifyOTP={handleVerifyOTP}
          label="Mobile Number"
          required
          error={errors.phoneNo?.message}
          showEditButton={true}
        />

        <FormField label="Email">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                error={errors.email?.message}
                placeholder="Enter your email address"
                className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            )}
          />
        </FormField>

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
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">Mariana, Dubai</span>
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
            disabled={isLoading || (!!phoneNumberChanged && !isPhoneVerified)}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
