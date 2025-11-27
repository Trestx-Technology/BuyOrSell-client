"use client";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FcGoogle } from "react-icons/fc";
import React, { useState, useMemo } from "react";
import { FaApple } from "react-icons/fa";
import Link from "next/link";
import { GoogleLoginButton } from "../_components/google";
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
import OTPVerificationDialog from "@/app/(root)/user/_components/otp-verification-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatePasswordStrength } from "@/utils/password-strength";
import { createSignupSchema, countryCodes, type SignupFormData } from "@/schemas/signup.schema";
import Image from "next/image";

const Signup = () => {
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
      await sendPhoneOtpMutation.mutateAsync({ phoneNumber: fullPhoneNumber });
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
        phone: fullPhoneNumber,
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

      const response = await signUpMutation.mutateAsync({
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        password: formData.password,
        countryCode: selectedCountryCode,
        deviceKey: "123456",
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
        router.push("/");
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
        href={"/methods"}
        className="-ml-1 mt-8 lg:-mt-32 text-center text-xs font-semibold flex items-center gap-1 cursor-pointer text-purple w-fit"
      >
        <ChevronLeft className="size-5" /> Back
      </Link>
      <Typography
        variant="h1"
        className="py-4 text-left text-xl min-[500px]:text-2xl font-extrabold"
      >
        Create Account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <Input
            {...register("fullName")}
            autoComplete="name"
            leftIcon={<CircleUserRound className="size-6 -ml-0.5" />}
            placeholder="Full name"
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
            placeholder="Enter Email"
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
              placeholder="Enter phone number"
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
            placeholder="Enter password"
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
            <div className="text-sm">Password Strength</div>
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
            : "Create Account"}
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
        Or continue with
      </Typography>

      <div className="space-y-2 text-sm sm:text-md font-medium">
        <GoogleLoginButton
          oneTapAutoSelect={false}
          onSuccess={(data) => {
            const payload = {
              countryCode: selectedCountryCode,
              deviceKey: "1234567890",
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName || data.firstName,
              socialType: "google",
              verifyEmail: true,
            };
            console.log("payload: ", payload);
            // HandleSocialSignup(payload);
          }}
          onError={(error) => toast.error(error)}
          className="w-[400px]"
          enableOneTap={false}
          render={({ onClick, disabled, isLoading }) => (
            <Button
              disabled={disabled}
              onClick={onClick}
              isLoading={isLoading}
              variant="ghost"
              size="lg"
              className="w-full bg-white border-[#8B31E18A] border text-dark-blue text-sm"
              iconPosition="center"
              icon={<FcGoogle />}
            >
              Continue with Google
            </Button>
          )}
        />

        <Button
          variant="ghost"
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue text-sm"
          size="lg"
          iconPosition="center"
          icon={<FaApple />}
        >
          Continue with Apple
        </Button>
      </div>

      <Typography
        variant="h3"
        className="text-center text-sm mx-auto absolute left-1/2 -translate-x-1/2 bottom-20 lg:bottom-16 w-fit"
      >
        Already have an account?{" "}
        <Link href="/login" className="text-purple m-custom-8 hover:underline">
          Log In
        </Link>
      </Typography>
    </section>
  );
};

export default Signup;
