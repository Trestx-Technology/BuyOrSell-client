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

const Login = () => {
  const router = useRouter();
  return (
    <section className="w-full lg:w-1/2 max-w-[530px] h-full flex flex-col justify-center relative space-y-8">
      <Typography
        variant="h1"
        className="text-center lg:text-left text-xl min-[500px]:text-3xl font-extrabold"
      >
        Buy & Sell <span className="text-purple">anything</span> you want on
        single place
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
              Continue with Google
            </Button>
          )}
        />

        <Button
          variant={"ghost"}
          size={"lg"}
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue"
          iconPosition="center"
          onClick={() => router.push("/login")}
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
          Continue with Email and Password
        </Button>
        <Button
          variant={"ghost"}
          size={"lg"}
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue"
          iconPosition="center"
          icon={<FaApple />}
        >
          Continue with Apple
        </Button>

        <Typography variant="h3" className="text-center text-sm py-4">
          Or
        </Typography>
      </div>
      <Typography
        variant="h3"
        className="text-center text-sm absolute left-1/2 -translate-x-1/2  bottom-16 w-full"
      >
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-purple m-custom-16">
          Sign up
        </Link>
      </Typography>
    </section>
  );
};

export default Login;
