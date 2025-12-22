"use client";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import React from "react";
import { FaApple } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { GoogleLoginButton } from "../_components/google";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { useLocale } from "@/hooks/useLocale";

const Login = () => {
  const router = useRouter();
  const { localePath, t } = useLocale();
  return (
    <section className="w-full lg:w-1/2 max-w-[530px] h-full flex flex-col justify-center relative space-y-8">
      <Typography
        variant="h1"
        className="text-center lg:text-left text-xl min-[500px]:text-3xl font-extrabold"
      >
        {t.methods.title} <span className="text-purple">{t.methods.subtitle}</span>
      </Typography>
      <div className="space-y-3 text-sm sm:text-md font-medium">
        <GoogleLoginButton
          oneTapAutoSelect={false}
          // disabled={isPending || isSocialPending}
          onSuccess={() => {
            // HandleSocialLogin({
            //   countryCode: "+971",
            //   deviceKey: "1234567890",
            //   email: data.email,
            //   firstName: data.firstName,
            //   lastName: data.lastName || data.firstName,
            //   socialType: "google",
            //   verifyEmail: true,
            // });
          }}
          onError={(error) => toast.error(error)}
          className="w-[400px]"
          enableOneTap={false}
          render={({ onClick, disabled, isLoading }) => (
            <Button
              disabled={disabled}
              onClick={onClick}
              isLoading={isLoading}
              variant={"ghost"}
              size={"lg"}
              className="w-full bg-white border-[#8B31E18A] border text-dark-blue"
              iconPosition="center"
              icon={<FcGoogle />}
            >
{t.methods.continueWithGoogle}
            </Button>
          )}
        />

        <Button
          variant={"ghost"}
          size={"lg"}
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue"
          iconPosition="center"
          onClick={() => router.push(localePath("/login"))}
          icon={
            <Image
              width={24}
              height={24}
              src={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/gmail.svg"
              }
              alt="gmail"
            />
          }
        >
{t.methods.continueWithEmail}
        </Button>
        <Button
          variant={"ghost"}
          size={"lg"}
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue"
          iconPosition="center"
          icon={<FaApple />}
        >
{t.methods.continueWithApple}
        </Button>

        <Typography variant="h3" className="text-center text-sm py-4">
{t.methods.or}
        </Typography>
      </div>
      <Typography
        variant="h3"
        className="text-center text-sm absolute left-1/2 -translate-x-1/2  bottom-16 w-full"
      >
{t.methods.dontHaveAccount}{" "}
        <Link href={localePath("/signup")} className="text-purple m-custom-16">
          {t.methods.signUp}
        </Link>
      </Typography>
    </section>
  );
};

export default Login;
