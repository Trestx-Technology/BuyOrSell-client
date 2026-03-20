"use client";
import { H2, H3, H4, H5, Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronLeft,
  Circle,
  EyeIcon,
  EyeOffIcon,
  Key,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { resetPassword as ResetPasswordAPI } from "@/app/api/auth/auth.services";
import { AxiosError } from "axios";
import { useLocale } from "@/hooks/useLocale";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { calculatePasswordStrength } from "@/utils/password-strength";
import { useMemo } from "react";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { localePath, t } = useLocale();
  const resetToken = searchParams.get("token") || "";

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(passwordData.newPassword || ""),
    [passwordData.newPassword],
  );

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
      router.push(localePath("/forgot-password"));
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
          href={localePath("/login")}
          className="-ml-1 mt-8 lg:-mt-32 text-center text-xs font-semibold flex items-center gap-1 cursor-pointer text-purple w-fit"
        >
          <ChevronLeft className="size-5" /> {t.auth.resetPassword.back}
        </Link>
        <Typography
          variant="h1"
          className="py-4 text-left text-xl min-[500px]:text-2xl font-extrabold"
        >
          {t.auth.resetPassword.success}
        </Typography>
        <div className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="size-20 rounded-full bg-success-10 flex items-center justify-center">
              <Key className="size-10 text-success-100" />
            </div>
          </div>
          <H4 className="text-center text-xs text-gray-600 pt-4">
            {t.auth.resetPassword.successMessage}
          </H4>
        </div>
        <div className="mt-8">
          <Button
            className="w-full text-sm"
            size={"lg"}
            variant={"filled"}
            onClick={() => router.push(localePath("/login"))}
          >
            {t.auth.resetPassword.goToLogin}
          </Button>
        </div>
      </section>
    );
  }

  if (!resetToken) {
    return (
      <section className="w-full mx-auto lg:w-1/2 max-w-[530px] h-full flex flex-col justify-start lg:justify-center relative">
        <Link
          href={localePath("/login")}
          className="-ml-1 mt-8 lg:-mt-32 text-center text-xs font-semibold flex items-center gap-1 cursor-pointer text-purple w-fit"
        >
          <ChevronLeft className="size-5" /> {t.auth.resetPassword.back}
        </Link>
        <Typography
          variant="h1"
          className="py-4 text-left text-xl min-[500px]:text-2xl font-extrabold"
        >
          {t.auth.resetPassword.invalidLink}
        </Typography>
        <div className="space-y-4">
          <H5 className="text-sm text-gray-600">
            {t.auth.resetPassword.invalidLinkMessage}
          </H5>
        </div>
        <div className="mt-8 space-y-3">
          <Button
            className="w-full text-sm"
            size={"lg"}
            variant={"filled"}
            onClick={() => router.push(localePath("/forgot-password"))}
          >
            {t.auth.resetPassword.requestNewLink}
          </Button>
          <Button
            className="w-full text-sm"
            size={"lg"}
            variant={"outlined"}
            onClick={() => router.push(localePath("/login"))}
          >
            {t.auth.resetPassword.backToLogin}
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
        <ChevronLeft className="size-5" /> {t.auth.resetPassword.back}
      </Link>
      <Typography
        variant="h1"
        className="py-4 text-left text-xl min-[500px]:text-2xl font-extrabold"
      >
        {t.auth.resetPassword.title}
      </Typography>
      <H5 className="text-sm text-gray-600 pb-6">
        {t.auth.resetPassword.subtitle}
      </H5>
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
          placeholder={t.auth.resetPassword.newPassword}
          type={showPassword ? "text" : "password"}
          onRightIconClick={() => setShowPassword(!showPassword)}
          rightIcon={
            showPassword ? (
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

        {/* Password Strength Indicator with Progress Bar */}
        <div className="space-y-2 mt-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t.auth.resetPassword.passwordStrength}
          </div>
          <Progress value={passwordStrength.progress} className="h-2" />
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4 mb-6">
          {[
            {
              label: t.auth.resetPassword.requirements.length,
              met: passwordData.newPassword.length >= 8,
            },
            {
              label: t.auth.resetPassword.requirements.lowercase,
              met: /[a-z]/.test(passwordData.newPassword),
            },
            {
              label: t.auth.resetPassword.requirements.uppercase,
              met: /[A-Z]/.test(passwordData.newPassword),
            },
            {
              label: t.auth.resetPassword.requirements.number,
              met: /[0-9]/.test(passwordData.newPassword),
            },
            {
              label: t.auth.resetPassword.requirements.special,
              met: /[^A-Za-z0-9]/.test(passwordData.newPassword),
            },
          ].map((req, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 text-[11px] leading-tight transition-colors duration-200 ${
                req.met
                  ? "text-success-100 font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {req.met ? (
                  <CheckCircle2 className="size-3.5 text-success-100" />
                ) : (
                  <Circle className="size-3.5 opacity-40" />
                )}
              </div>
              <span>{req.label}</span>
            </div>
          ))}
        </div>

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
          placeholder={t.auth.resetPassword.confirmPassword}
          type={showConfirmPassword ? "text" : "password"}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          rightIcon={
            showConfirmPassword ? (
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

      <Button
        className="w-full text-sm my-4"
        size={"lg"}
        variant={"filled"}
        onClick={handleSubmit}
        disabled={
          !passwordData.newPassword ||
          !passwordData.confirmPassword ||
          passwordStrength.requirements.length > 0 ||
          passwordData.newPassword !== passwordData.confirmPassword ||
          resetPasswordMutation.isPending
        }
        isLoading={resetPasswordMutation.isPending}
      >
        {t.auth.resetPassword.resetPassword}
      </Button>
      <H5 className="text-center text-sm mx-auto my-4 w-fit">
        {t.auth.resetPassword.rememberPassword}{" "}
        <Link
          href={localePath("/login")}
          className="text-purple m-custom-8 hover:underline"
        >
          {t.auth.resetPassword.logIn}
        </Link>
      </H5>
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
