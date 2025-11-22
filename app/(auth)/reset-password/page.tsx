"use client";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, EyeIcon, EyeOffIcon, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { resetPassword as ResetPasswordAPI } from '@/app/api/auth/auth.services';
import { AxiosError } from "axios";
import Image from "next/image";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token") || "";
  
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const resetPasswordMutation = useMutation<
    { message: string; statusCode: number; timeStamp: string },
    Error,
    { resetToken: string; newPassword: string }
  >({
    mutationFn: ({ resetToken, newPassword }) =>
      ResetPasswordAPI(resetToken, newPassword),
    onSuccess: () => {
      setPasswordReset(true);
      toast.success("Password reset successfully!");
    },
    
  });

  const handleSubmit = () => {
    if (!resetToken) {
      toast.error("Invalid reset link. Please request a new password reset.");
      router.push("/forgot-password");
      return;
    }

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate({
      resetToken,
      newPassword: passwordData.newPassword,
    });
  };

  if (passwordReset) {
    return (
      <section className="w-full mx-auto lg:w-1/2 max-w-[530px] h-full flex flex-col justify-start lg:justify-center relative">
        <Link
          href={"/login"}
          className="-ml-1 mt-8 lg:-mt-32 text-center text-xs font-semibold flex items-center gap-1 cursor-pointer text-purple w-fit"
        >
          <ChevronLeft className="size-5" /> Back
        </Link>
        <Typography
          variant="h1"
          className="py-4 text-left text-xl min-[500px]:text-2xl font-extrabold"
        >
          Password Reset Successful
        </Typography>
        <div className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="size-20 rounded-full bg-success-10 flex items-center justify-center">
              <Key className="size-10 text-success-100" />
            </div>
          </div>
          <Typography variant="h3" className="text-center text-sm">
            Your password has been reset successfully!
          </Typography>
          <Typography
            variant="h3"
            className="text-center text-xs text-gray-600 pt-4"
          >
            You can now log in with your new password.
          </Typography>
        </div>
        <div className="mt-8">
          <Button
            className="w-full text-sm"
            size={"lg"}
            variant={"filled"}
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </div>
      </section>
    );
  }

  if (!resetToken) {
    return (
      <section className="w-full mx-auto lg:w-1/2 max-w-[530px] h-full flex flex-col justify-start lg:justify-center relative">
        <Link
          href={"/login"}
          className="-ml-1 mt-8 lg:-mt-32 text-center text-xs font-semibold flex items-center gap-1 cursor-pointer text-purple w-fit"
        >
          <ChevronLeft className="size-5" /> Back
        </Link>
        <Typography
          variant="h1"
          className="py-4 text-left text-xl min-[500px]:text-2xl font-extrabold"
        >
          Invalid Reset Link
        </Typography>
        <div className="space-y-4">
          <Typography variant="h3" className="text-sm text-gray-600">
            This password reset link is invalid or has expired. Please request a
            new password reset link.
          </Typography>
        </div>
        <div className="mt-8 space-y-3">
          <Button
            className="w-full text-sm"
            size={"lg"}
            variant={"filled"}
            onClick={() => router.push("/forgot-password")}
          >
            Request New Reset Link
          </Button>
          <Button
            className="w-full text-sm"
            size={"lg"}
            variant={"outlined"}
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mx-auto lg:w-1/2 max-w-[530px] h-full flex flex-col justify-start lg:justify-center relative">
      <Link
        href={"/login"}
        className="-ml-1 mt-8 lg:-mt-32 text-center text-xs font-semibold flex items-center gap-1 cursor-pointer text-purple w-fit"
      >
        <ChevronLeft className="size-5" /> Back
      </Link>
      <Typography
        variant="h1"
        className="py-4 text-left text-xl min-[500px]:text-2xl font-extrabold"
      >
        Reset Password
      </Typography>
      <Typography variant="h3" className="text-sm text-gray-600 pb-6">
        Enter your new password below.
      </Typography>
      <div className="space-y-2">
        <Input
          leftIcon={
            <Image
              width={24}
              height={24}
              src={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/key.svg"
              }
              alt="key"
            />
          }
          placeholder="New Password"
          type={showPassword ? "text" : "password"}
          onRightIconClick={() => setShowPassword(!showPassword)}
          rightIcon={
            !showPassword ? (
              <EyeIcon
                className={`w-4 h-4 ${
                  showPassword ? "text-purple" : "text-gray-500"
                }`}
              />
            ) : (
              <EyeOffIcon
                className={`w-4 h-4 ${
                  showPassword ? "text-purple" : "text-gray-500"
                }`}
              />
            )
          }
          inputSize="lg"
          className="w-full text-sm pl-12"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, newPassword: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <Input
          leftIcon={
            <Image
              width={24}
              height={24}
              src={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/key.svg"
              }
              alt="key"
            />
          }
          placeholder="Confirm New Password"
          type={showConfirmPassword ? "text" : "password"}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          rightIcon={
            !showConfirmPassword ? (
              <EyeIcon
                className={`w-4 h-4 ${
                  showConfirmPassword ? "text-purple" : "text-gray-500"
                }`}
              />
            ) : (
              <EyeOffIcon
                className={`w-4 h-4 ${
                  showConfirmPassword ? "text-purple" : "text-gray-500"
                }`}
              />
            )
          }
          inputSize="lg"
          className="w-full text-sm pl-12"
          value={passwordData.confirmPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              confirmPassword: e.target.value,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </div>
      <Typography variant="h3" className="text-xs text-gray-500 pt-2 pb-4">
        Password must be at least 8 characters long
      </Typography>
      <Button
        className="w-full text-sm"
        size={"lg"}
        variant={"filled"}
        onClick={handleSubmit}
        disabled={
          !passwordData.newPassword ||
          !passwordData.confirmPassword ||
          resetPasswordMutation.isPending
        }
        isLoading={resetPasswordMutation.isPending}
      >
        Reset Password
      </Button>
      <Typography
        variant="h3"
        className="text-center text-sm mx-auto absolute left-1/2 -translate-x-1/2 bottom-20 lg:bottom-16 w-fit"
      >
        Remember your password?{" "}
        <Link href="/login" className="text-purple m-custom-8 hover:underline">
          Log In
        </Link>
      </Typography>
    </section>
  );
};

const ResetPassword = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;

