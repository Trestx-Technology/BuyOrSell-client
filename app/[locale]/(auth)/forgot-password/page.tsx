"use client";
import { H2, H4, H5, Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "nextjs-toploader/app";
import { useMutation } from "@tanstack/react-query";
import { sendResetPasswordEmail as SendResetPasswordEmailAPI } from '@/app/api/auth/auth.services';
import { useLocale } from "@/hooks/useLocale";
import Image from "next/image";

const ForgotPasswordContent = () => {
  const router = useRouter();
  const { localePath, t } = useLocale();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const forgotPasswordMutation = useMutation<
    { statusCode: number; message?: string; timestamp?: string },
    Error,
    string
  >({
    mutationFn: (email) => SendResetPasswordEmailAPI(email),
    onSuccess: () => {
      setEmailSent(true);
      toast.success("Reset password link has been sent to your email");
    },
    
  });

  const handleSubmit = () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    forgotPasswordMutation.mutate(email);
  };

  if (emailSent) {
    return (
      <section className="w-full mx-auto lg:w-1/2 max-w-[530px] h-full flex flex-col justify-start lg:justify-center relative">
        <Link
          href={localePath("/login")}
          className="-ml-1 mt-8 lg:-mt-32 text-center text-xs font-semibold flex items-center gap-1 cursor-pointer text-purple w-fit"
        >
          <ChevronLeft className="size-5" /> {t.auth.forgotPassword.back}
        </Link>
        <H4
          className="py-4 text-left font-extrabold"
        >
          {t.auth.forgotPassword.checkEmail}
        </H4>
        <div className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="size-20 rounded-full bg-purple-100 flex items-center justify-center">
              <Mail className="size-10 text-purple" />
            </div>
          </div>
          <H5
            className="text-center text-sm">
            {t.auth.forgotPassword.emailSent}
          </H5>
          <H5 className="text-center text-sm font-semibold">
            {email}
          </H5>
          <Typography
            variant="h3"
            className="text-center text-xs text-gray-600 pt-4"
          >
            Please check your email and click on the link to reset your password.
            If you don&apos;t see the email, check your spam folder.
          </Typography>
        </div>
        <div className="mt-8 space-y-3">
          <Button
            className="w-full text-sm"
            size={"lg"}
            variant={"filled"}
            onClick={() => router.push(localePath("/login"))}
          >
            {t.auth.forgotPassword.backToLogin}
          </Button>
          <Button
            className="w-full text-sm"
            size={"lg"}
            variant={"outlined"}
            onClick={() => {
              setEmailSent(false);
              setEmail("");
            }}
          >
            {t.auth.forgotPassword.resendEmail}
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
        <ChevronLeft className="size-5" /> {t.auth.forgotPassword.back}
      </Link>
      <H2
        className="py-4 text-left font-extrabold"
      >
        {t.auth.forgotPassword.title}
      </H2>
      <H5
        className="text-sm text-gray-600 pb-6"
      >
        {t.auth.forgotPassword.subtitle}
      </H5>
      <div className="space-y-2">
        <Input
          leftIcon={
            <Image
              width={24}
              height={24}
              src={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/mail.svg"
              }
              alt="mail"
              className="size-5"
            />
          }
          placeholder={t.auth.forgotPassword.email}
          inputSize="lg"
          className="w-full text-sm pl-12"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </div>
      <Button
        className="w-full text-sm mt-6"
        size={"lg"}
        variant={"filled"}
        onClick={handleSubmit}
        disabled={!email || forgotPasswordMutation.isPending}
        isLoading={forgotPasswordMutation.isPending}
      >
{t.auth.forgotPassword.sendResetLink}
      </Button>
      <H5
        className="text-center mx-auto absolute left-1/2 -translate-x-1/2 bottom-20 lg:bottom-16 w-fit"
      >
        {t.auth.forgotPassword.rememberPassword}{" "}
        <Link href={localePath("/login")} className="text-purple m-custom-8 hover:underline">
          {t.auth.forgotPassword.logIn}
        </Link>
      </H5>
    </section>
  );
};

const ForgotPassword = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
};

export default ForgotPassword;
