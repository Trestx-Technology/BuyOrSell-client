"use client";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import React, { useState, Suspense } from "react";
import { FaApple } from "react-icons/fa";
import Link from "next/link";
import { GoogleLoginButton } from "../_components/google";
import { toast } from "sonner";
import { ChevronLeft, EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login as LoginAPI } from '@/app/api/auth/auth.services';
import type { loginResponse } from "@/interfaces/auth.types";
import { useAuthStore } from "@/stores/authStore";
import { AxiosError } from "axios";

import Image from "next/image";

const LoginContent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
      const redirectTo = searchParams.get("redirect") || "/";

  const setSession = useAuthStore((state) => state.setSession);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation<loginResponse, Error, { email: string; password: string; deviceKey: string }>({
    mutationFn: ({ email, password, deviceKey }) => LoginAPI(email, password, deviceKey),
    onSuccess: async (data) => {
      // Store session in Zustand store (handles localStorage and cookies)
      await setSession(
        data.data.accessToken,
        data.data.refreshToken,
        data.data.user as unknown as Parameters<typeof setSession>[2]
      );
      
      toast.success("Login successful!");
      
      // Redirect to the original destination or home page
      if (redirectTo) {
        
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError?.response?.data?.message || axiosError?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    loginMutation.mutate({
      email: loginData.email,
      password: loginData.password,
      deviceKey: "1234567890", // TODO: Replace with actual device key generation
    });
  };
  return (
    <section className="w-full mx-auto lg:w-1/2 max-w-[530px] h-full flex flex-col justify-start lg:justify-center relative">
      <Link
        href={"/methods"}
        className="-ml-1 mt-8 lg:-mt-32 text-center text-xs font-semibold flex items-center gap-1 cursor-pointer text-purple w-fit"
      >
        <ChevronLeft className="size-5" /> Back
      </Link>
      <Typography
        variant="h1"
        className="py-4 text-left text-xl min-[500px]:text-2xl font-extrabold"
      >
        Log In
      </Typography>
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
          placeholder="Email"
          inputSize="lg"
          className="w-full text-sm pl-12"
          value={loginData.email}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
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
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          onRightIconClick={() => setShowPassword(!showPassword)}
          rightIcon={
            !showPassword ? (
              <EyeIcon
                className={`w-4 h-4 ${showPassword ? "text-purple" : "text-gray-500"}`}
              />
            ) : (
              <EyeOffIcon
                className={`w-4 h-4 ${showPassword ? "text-purple" : "text-gray-500"}`}
              />
            )
          }
          inputSize="lg"
          className="w-full text-sm pl-12"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />
      </div>
      <Link
        href={"/forgot-password"}
        className="text-sm text-purple text-right font-medium cursor-pointer hover:underline py-6 w-fit ml-auto"
      >
        Forgot Password?
      </Link>
      <Button
        className="w-full text-sm"
        size={"lg"}
        variant={"filled"}
        onClick={handleLogin}
        disabled={!loginData.email || !loginData.password || loginMutation.isPending}
        isLoading={loginMutation.isPending}
      >
        Log In
      </Button>
      <Typography variant="h3" className="text-center text-sm py-6">
        Or continue with
      </Typography>
      <div className="space-y-2 text-sm sm:text-md font-medium">
        <GoogleLoginButton
          oneTapAutoSelect={false}
          // disabled={isPending || isSocialPending}
          onSuccess={(data) => {
            const payload = {
              countryCode: "+971",
              deviceKey: "1234567890",
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName || data.firstName,
              socialType: "google",
              verifyEmail: true,
            };
            console.log("payload: ", payload);
            // HandleSocialLogin(payload);
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
              className="w-full bg-white border-[#8B31E18A] border text-dark-blue t text-sm"
              iconPosition={"center"}
              icon={<FcGoogle />}
            >
              Continue with Google
            </Button>
          )}
        />

        <Button
          variant={"ghost"}
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue text-center text-sm"
          size={"lg"}
          iconPosition={"center"}
          icon={<FaApple />}
        >
          Continue with Apple
        </Button>
      </div>
      <Typography
        variant="h3"
        className="text-center text-sm mx-auto  absolute left-1/2 -translate-x-1/2  bottom-20 lg:bottom-16 w-fit"
      >
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-purple m-custom-8 hover:underline">
          Sign up
        </Link>
      </Typography>
    </section>
  );
};

const Login = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;
