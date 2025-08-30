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

import Image from "next/image";

// Country codes data
const countryCodes = [
  { code: "+971", country: "UAE" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+61", country: "Australia" },
  { code: "+65", country: "Singapore" },
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+971");

  const router = useRouter();

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculation for progress bar
  const passwordStrength = useMemo(() => {
    const password = signupData.password;
    if (!password) return { score: 0, label: "", progress: 0 };

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Calculate progress percentage (0-100)
    const progress = Math.min((score / 6) * 100, 100);

    // Determine strength level
    let label;
    if (score <= 2) {
      label = "Weak";
    } else if (score <= 4) {
      label = "Strong";
    } else {
      label = "Excellent";
    }

    return { score, label, progress };
  }, [signupData.password]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!signupData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!signupData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!signupData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!signupData.password) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle signup logic here
      toast.success("Account created successfully!");
      router.push("/");
    }
  };

  const isFormValid = () => {
    return (
      signupData.fullName.trim() &&
      signupData.email.trim() &&
      signupData.phoneNumber.trim() &&
      signupData.password
    );
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
      <div className="space-y-2">
        <Input
          leftIcon={<CircleUserRound className="size-6 -ml-0.5" />}
          placeholder="Full name"
          inputSize="lg"
          className="w-full text-sm pl-12"
          value={signupData.fullName}
          onChange={(e) =>
            setSignupData({ ...signupData, fullName: e.target.value })
          }
          error={errors.fullName}
        />
        {errors.fullName && (
          <p className="text-error text-xs mt-1">{errors.fullName}</p>
        )}

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
          placeholder="Enter Email"
          inputSize="lg"
          className="w-full text-sm pl-12"
          value={signupData.email}
          onChange={(e) =>
            setSignupData({ ...signupData, email: e.target.value })
          }
          error={errors.email}
        />
        {errors.email && (
          <p className="text-error text-xs mt-1">{errors.email}</p>
        )}

        {/* Phone Number with Country Code */}
        <div className="flex gap-3">
          <Select
            value={selectedCountryCode}
            onValueChange={setSelectedCountryCode}
          >
            <SelectTrigger className="min-w-fit border-grey-blue/30 hover:border-purple/50 bg-white text-dark-blue text-sm font-medium py-6">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1">
            <Input
              placeholder="Enter phone number"
              inputSize="lg"
              className="w-full text-sm"
              value={signupData.phoneNumber}
              onChange={(e) =>
                setSignupData({ ...signupData, phoneNumber: e.target.value })
              }
              error={errors.phoneNumber}
            />
          </div>
        </div>
        {errors.phoneNumber && (
          <p className="text-error text-xs mt-1">{errors.phoneNumber}</p>
        )}

        <Input
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
          type={showPassword ? "text" : "password"}
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
          value={signupData.password}
          onChange={(e) =>
            setSignupData({ ...signupData, password: e.target.value })
          }
          error={errors.password}
        />
        {errors.password && (
          <p className="text-error text-xs mt-1">{errors.password}</p>
        )}

        {/* Password Strength Indicator with Progress Bar */}
        <div className="space-y-2 mt-2">
          <div className="text-sm">Password Strength</div>
          <Progress value={passwordStrength.progress} className="h-2" />
          <div className="text-xs text-grey-blue text-right">
            {passwordStrength.label}
          </div>
        </div>
      </div>

      <Button
        className="w-full text-sm mt-6"
        size="lg"
        variant="filled"
        onClick={handleSubmit}
        disabled={!isFormValid()}
      >
        Create Account
      </Button>

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
