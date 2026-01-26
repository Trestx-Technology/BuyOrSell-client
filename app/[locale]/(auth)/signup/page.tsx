"use client";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FcGoogle } from "react-icons/fc";
import React, { useState, useMemo } from "react";
import { FaApple } from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronLeft,
  CircleUserRound,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "nextjs-toploader/app";
import { useSignUp } from "@/hooks/useAuth";
import { useSendPhoneOtp, useVerifyPhoneOtp } from "@/hooks/useUsers";
import { useAuthStore } from "@/stores/authStore";
import OTPVerificationDialog from "@/app/[locale]/(root)/user/_components/otp-verification-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatePasswordStrength } from "@/utils/password-strength";
import { createSignupSchema, countryCodes, type SignupFormData } from "@/schemas/signup.schema";
import { useLocale } from "@/hooks/useLocale";
import Image from "next/image";
import { firebase } from "@/lib/firebase/config";

const Signup = () => {
  const { localePath, t } = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+971");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const signUpMutation = useSignUp();
  const sendPhoneOtpMutation = useSendPhoneOtp();
  const verifyPhoneOtpMutation = useVerifyPhoneOtp();

  const signupSchema = useMemo(
    () => createSignupSchema(selectedCountryCode),
    [selectedCountryCode]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const password = watch("password");
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(password || ""),
    [password]
  );

  const onSubmit = async (data: SignupFormData) => {
    // Clean phone number (remove non-numeric characters)
    const cleanedPhoneNumber = data.phoneNumber.replace(/\D/g, "");
    const fullPhoneNumber = `${selectedCountryCode}${cleanedPhoneNumber}`;

    try {
      await sendPhoneOtpMutation.mutateAsync({ phoneNo: fullPhoneNumber });
      toast.success("OTP sent to your phone number");
      setShowOtpDialog(true);
    } catch (error: unknown) {
      console.error("Send OTP error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsVerifyingOtp(true);
    const formData = watch();
    // Clean phone number before sending
    const cleanedPhoneNumber = formData.phoneNumber.replace(/\D/g, "");
    const fullPhoneNumber = `${selectedCountryCode}${cleanedPhoneNumber}`;

    try {
      // Verify OTP
      await verifyPhoneOtpMutation.mutateAsync({
        phoneNo: fullPhoneNumber,
        otp: otp,
      });

      if (verifyPhoneOtpMutation.isSuccess) {
        setShowOtpDialog(false);
      }
      toast.success("Phone number verified successfully!");

      // Now proceed with signup
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "";

      const deviceToken = await firebase.getFCMToken();

      const response = await signUpMutation.mutateAsync({
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        password: formData.password,
        countryCode: selectedCountryCode,
        deviceKey: deviceToken,
      });

      if (response.statusCode === 201 || response.statusCode === 200) {
        // Save session and tokens if available in response
        if (response.data?.accessToken && response.data?.user) {
          await setSession(
            response.data.accessToken,
            response.data.refreshToken || "",
            response.data.user as unknown as Parameters<typeof setSession>[2]
          );
        }

        toast.success(response.message || "Account created successfully!");
        setShowOtpDialog(false);
        router.push(localePath("/"));
      } else {
        toast.error(response.message || "Failed to create account. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Verify OTP or Signup error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to verify OTP or create account. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setSelectedCountryCode(value);
    // Re-validate phone number when country code changes
    trigger("phoneNumber");
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, spaces, hyphens, and parentheses for formatting
    const value = e.target.value.replace(/[^\d\s\-()]/g, "");
    setValue("phoneNumber", value, { shouldValidate: true });
  };

  return (
    <section className="w-full mx-auto lg:w-1/2 max-w-[530px] h-full flex flex-col justify-start lg:justify-center relative">
      <Link
        href={localePath("/methods")}
        className="-ml-1 mt-8 lg:-mt-32 text-center text-xs font-semibold flex items-center gap-1 cursor-pointer text-purple w-fit"
      >
        <ChevronLeft className="size-5" /> {t.auth.signup.back}
      </Link>
      <Typography
        variant="h1"
        className="py-4 text-left text-xl min-[500px]:text-2xl font-extrabold"
      >
        {t.auth.signup.title}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <Input
            {...register("fullName")}
            autoComplete="name"
            leftIcon={<CircleUserRound className="size-6 -ml-0.5" />}
            placeholder={t.auth.signup.fullName}
            inputSize="lg"
            className="w-full text-sm pl-12"
            error={errors.fullName?.message}
          />
          {errors.fullName && (
            <p className="text-error text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register("email")}
            autoComplete="email"
            type="email"
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
            placeholder={t.auth.signup.email}
            inputSize="lg"
            className="w-full text-sm pl-12"
            error={errors.email?.message}
          />
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number with Country Code */}
        <div className="flex gap-3">
          <Select value={selectedCountryCode} onValueChange={handleCountryCodeChange}>
            <SelectTrigger className="min-w-fit border-grey-blue/30 hover:border-purple/50 bg-white text-dark-blue text-sm font-medium py-6">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.code} ({country.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1">
            <Input
              {...register("phoneNumber")}
              autoComplete="tel"
              type="tel"
              placeholder={t.auth.signup.phoneNumber}
              inputSize="lg"
              inputMode="numeric"
              name="phoneNumber"
              id="phoneNumber"
              className="w-full text-sm"
              onChange={handlePhoneNumberChange}
              error={errors.phoneNumber?.message}
            />
          </div>
        </div>
        {errors.phoneNumber && (
          <p className="text-error text-xs mt-1">{errors.phoneNumber.message}</p>
        )}

        <div>
          <Input
            {...register("password")}
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            leftIcon={
              <Image
                width={24}
                height={24}
                src={
                  "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/key.svg"
                }
                alt="key"
                className="size-5"
              />
            }
            placeholder={t.auth.signup.password}
            onRightIconClick={() => setShowPassword(!showPassword)}
            rightIcon={
              !showPassword ? (
                <EyeIcon
                  className={`size-5 ${showPassword ? "text-purple" : "text-gray-500"}`}
                />
              ) : (
                <EyeOffIcon
                  className={`size-5 ${showPassword ? "text-purple" : "text-gray-500"}`}
                />
              )
            }
            inputSize="lg"
            className="w-full text-sm pl-12"
            error={errors.password?.message}
          />
          {errors.password && (
            <p className="text-error text-xs mt-1">{errors.password.message}</p>
          )}

          {/* Password Strength Indicator with Progress Bar */}
          <div className="space-y-2 mt-2">
            <div className="text-sm">{t.auth.signup.passwordStrength}</div>
            <Progress value={passwordStrength.progress} className="h-2" />
          
          </div>
        </div>

        <Button
          type="submit"
          className="w-full text-sm mt-6"
          size="lg"
          variant="filled"
          disabled={signUpMutation.isPending || sendPhoneOtpMutation.isPending}
          isLoading={signUpMutation.isPending || sendPhoneOtpMutation.isPending}
        >
          {signUpMutation.isPending || sendPhoneOtpMutation.isPending
            ? "Sending OTP..."
            : t.auth.signup.createAccount}
        </Button>
      </form>

      {/* OTP Verification Dialog */}
      <OTPVerificationDialog
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        phoneNumber={`${selectedCountryCode}${watch("phoneNumber")?.replace(/\D/g, "") || ""}`}
        onVerify={handleVerifyOtp}
        isLoading={isVerifyingOtp || verifyPhoneOtpMutation.isPending || signUpMutation.isPending}
      />

      <Typography variant="h3" className="text-center text-sm py-6">
        {t.auth.signup.orContinueWith}
      </Typography>

      <div className="space-y-2 text-sm sm:text-md font-medium">

        <Button
              variant="ghost"
              size="lg"
              className="w-full bg-white border-[#8B31E18A] border text-dark-blue text-sm"
              iconPosition="center"
              icon={<FcGoogle />}
            >
              {t.auth.signup.continueWithGoogle}
        </Button>

        <Button
          variant="ghost"
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue text-sm"
          size="lg"
          iconPosition="center"
          icon={<FaApple />}
        >
          {t.auth.signup.continueWithApple}
        </Button>
      </div>

      <Typography
        variant="h3"
        className="text-center text-sm mx-auto absolute left-1/2 -translate-x-1/2 bottom-20 lg:bottom-16 w-fit"
      >
        {t.auth.signup.alreadyHaveAccount}{" "}
        <Link href={localePath("/login")} className="text-purple m-custom-8 hover:underline">
          {t.auth.signup.logIn}
        </Link>
      </Typography>
    </section>
  );
};

export default Signup;
