"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, StarIcon, CameraIcon } from "lucide-react";
import Image from "next/image";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import PhoneNumberWithVerification from "@/components/global/phone-number-with-verification";
import UploadImageDialog from "./upload-image-dialog";
import { useGetProfile, useUpdateUser } from "@/hooks/useUsers";
import { useSendPhoneOtp, useVerifyPhoneOtp } from "@/hooks/useUsers";
import { toast } from "sonner";
import { format } from "date-fns";

interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  address: string;
  password?: string;
}

interface ProfileEditFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit?: (data: ProfileFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function ProfileEditForm({
  initialData = {},
  onSubmit,
  isLoading = false,
}: ProfileEditFormProps) {
  // Get user profile to access original phone number
  const { data: profileData } = useGetProfile();
  const originalPhoneNumber = profileData?.data?.user?.phoneNo || "";
  const originalCountryCode = profileData?.data?.user?.countryCode || "+971";

  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData.name || profileData?.data?.user?.firstName || "",
    email: initialData.email || profileData?.data?.user?.email || "",
    phoneNumber: initialData.phoneNumber || originalPhoneNumber || "",
    gender: initialData.gender || profileData?.data?.user?.gender || "Male",
    address: initialData.address || "Mariana, Dubai",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState<string>("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    profileData?.data?.user?.image
  );

  const updateUserMutation = useUpdateUser();

  // OTP hooks
  const sendPhoneOtpMutation = useSendPhoneOtp();
  const verifyPhoneOtpMutation = useVerifyPhoneOtp();

  // Get full original phone number with country code
  const originalFullPhoneNumber = originalPhoneNumber
    ? originalPhoneNumber.startsWith("+")
      ? originalPhoneNumber
      : `${originalCountryCode}${originalPhoneNumber}`
    : "";

  // Check if phone number has changed
  const phoneNumberChanged =
    verifiedPhoneNumber && verifiedPhoneNumber !== originalFullPhoneNumber;

  // Initialize verified phone number from original
  useEffect(() => {
    if (originalFullPhoneNumber && !verifiedPhoneNumber) {
      setVerifiedPhoneNumber(originalFullPhoneNumber);
      setIsPhoneVerified(true);
    }
  }, [originalFullPhoneNumber, verifiedPhoneNumber]);

  // Update profile image when profile data changes
  useEffect(() => {
    if (profileData?.data?.user?.image) {
      setProfileImageUrl(profileData.data.user.image);
    }
  }, [profileData?.data?.user?.image]);

  const handleImageUploaded = async (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
    // Optionally update user profile with new image
    try {
      const userId = profileData?.data?.user?._id;
      if (userId) {
        await updateUserMutation.mutateAsync({
          id: userId,
          data: { image: imageUrl },
        });
      }
    } catch (error) {
      console.error("Failed to update profile image:", error);
    }
  };

  // Get user data for display
  const user = profileData?.data?.user;
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.name || user?.firstName || "User";
  const joinedDate = user?.createdAt
    ? format(new Date(user.createdAt), "dd MMMM yyyy")
    : null;

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!verifiedPhoneNumber || !verifiedPhoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (phoneNumber: string) => {
    try {
      await sendPhoneOtpMutation.mutateAsync({ phoneNo: phoneNumber });
      toast.success("OTP sent to your phone number");
    } catch (error: unknown) {
      console.error("Send OTP error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleVerifyOTP = async (
    phoneNumber: string,
    otp: string
  ): Promise<boolean> => {
    try {
      await verifyPhoneOtpMutation.mutateAsync({
        phoneNo: phoneNumber,
        otp: otp,
      });
      toast.success("Phone number verified successfully!");
      return true;
    } catch (error: unknown) {
      console.error("OTP verification failed:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
      return false;
    }
  };

  const handlePhoneVerified = (phoneNumber: string) => {
    setVerifiedPhoneNumber(phoneNumber);
    setIsPhoneVerified(true);
    // Extract just the phone number part (without country code) for form data
    const phoneWithoutCode = phoneNumber.replace(/^\+\d{1,4}/, "");
    setFormData((prev) => ({ ...prev, phoneNumber: phoneWithoutCode }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if phone number verification is required
    if (phoneNumberChanged && !isPhoneVerified) {
      toast.error(
        "Please verify your new phone number before updating your profile."
      );
      return;
    }

    // Use verified phone number in form data
    const submitData = {
      ...formData,
      phoneNumber: verifiedPhoneNumber || formData.phoneNumber,
    };

    onSubmit?.(submitData);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-xl w-full mx-auto">
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
          <h2 className="text-lg font-poppins font-semibold text-gray-900">
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

        {/* Rating - can be added if available in user data */}
        {/* <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-medium text-gray-900">4.8/5</span>
        </div> */}
      </div>

      <UploadImageDialog
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
        currentImageUrl={profileImageUrl}
        onImageUploaded={handleImageUploaded}
      />

      <form onSubmit={handleSubmit} className="space-y-6 mt-3">
        <div>
          <FormField label="Name">
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              placeholder="Enter your full name"
              className="bg-gray-50"
            />
          </FormField>
        </div>

        <PhoneNumberWithVerification
          value={verifiedPhoneNumber || originalFullPhoneNumber}
          countryCode={originalCountryCode}
          onPhoneVerified={handlePhoneVerified}
          onSendOTP={handleSendOTP}
          onVerifyOTP={handleVerifyOTP}
          label="Mobile Number"
          required
          error={errors.phoneNumber}
          showEditButton={true}
        />

        <FormField label="Email">
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            placeholder="Enter your email address"
            className="bg-gray-50"
          />
        </FormField>

        <FormField label="Password">
          <Input
            type="password"
            value={formData.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
            placeholder="Enter new password (leave blank to keep current)"
            className="bg-gray-50"
          />
        </FormField>

        <FormField label="Gender">
          <Select
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Address">
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <MapPin className="w-6 h-6 fill-dark-blue text-white" />
            <span className="text-sm text-gray-700 flex-1">
              {formData.address}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 h-auto"
              onClick={() => toast.info("Coming soon")}
            >
              Change
            </Button>
          </div>
        </FormField>

        <div className="pt-4">
          <Button
            type="submit"
            variant={"primary"}
            isLoading={isLoading}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 text-base font-medium"
            disabled={isLoading || (!!phoneNumberChanged && !isPhoneVerified)}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
