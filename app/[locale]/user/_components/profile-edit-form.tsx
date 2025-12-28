"use client";

import { useState } from "react";
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
import { FormField } from "@/app/(root)/post-ad/details/_components/FormField";
import OTPVerificationDialog from "./otp-verification-dialog";

interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  address: string;
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
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData.name || "Sameer Khan",
    email: initialData.email || "98sameerkhan.sk@gmail.com",
    phoneNumber: initialData.phoneNumber || "9811962973",
    gender: initialData.gender || "Male",
    address: initialData.address || "Mariana, Dubai",
  });

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

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

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOTPVerify = async (otp: string) => {
    setIsVerifyingOTP(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (otp.length === 4) {
        setShowOTPDialog(false);
        alert(
          "Phone number verified successfully! You can now update your profile."
        );
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("OTP verification failed. Please try again.");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-xl w-full mx-auto">
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">
          <div className="w-22 h-22 rounded-full border-4 border-purple-100 overflow-hidden">
            <Image
              src={"/images/ai-prompt/add-image.png"}
              alt={`sammer's profile picture`}
              width={120}
              height={120}
              className="w-full h-full object-cover"
            />
            <CameraIcon className="absolute -top-0 bg-purple text-white rounded-full p-1 -right-0 size-6 text-purple" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <h2 className="text-lg font-poppins font-semibold text-gray-900">
            Sammer
          </h2>

          <Image
            src={"/verified-seller.svg"}
            alt="verified"
            width={16}
            height={16}
          />
        </div>

        <p className="text-xs text-gray-500 text-center -mt-2">
          Joined on 25 july 2025
        </p>

        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-medium text-gray-900">4.8/5</span>
        </div>
      </div>

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

        <FormField label="Mobile Number">
          <div className="flex items-center gap-3">
            <Input
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              error={errors.phoneNumber}
              placeholder="9811962973"
              rightIcon={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent text-purple"
                >
                  Verify
                </Button>
              }
              onRightIconClick={() => {
                if (
                  formData.phoneNumber &&
                  /^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ""))
                ) {
                  setShowOTPDialog(true);
                } else {
                  alert("Please enter a valid 10-digit phone number first.");
                }
              }}
              className="flex-1 bg-gray-50"
            />
          </div>
        </FormField>

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
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <span className="text-sm text-gray-500 flex-1">**********</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 h-auto"
              onClick={() => console.log("Change password")}
            >
              Change
            </Button>
          </div>
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
              onClick={() => console.log("Change address")}
            >
              Change
            </Button>
          </div>
        </FormField>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>

      <OTPVerificationDialog
        isOpen={showOTPDialog}
        onClose={() => setShowOTPDialog(false)}
        phoneNumber={formData.phoneNumber}
        onVerify={handleOTPVerify}
        isLoading={isVerifyingOTP}
      />
    </div>
  );
}

