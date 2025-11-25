import { z } from "zod";

// Country codes data with phone number validation rules
export const countryCodes = [
  { code: "+971", country: "UAE", minLength: 9, maxLength: 9, pattern: /^[0-9]{9}$/ },
  { code: "+1", country: "USA", minLength: 10, maxLength: 10, pattern: /^[0-9]{10}$/ },
  { code: "+44", country: "UK", minLength: 10, maxLength: 10, pattern: /^[0-9]{10}$/ },
  { code: "+91", country: "India", minLength: 10, maxLength: 10, pattern: /^[0-9]{10}$/ },
  { code: "+86", country: "China", minLength: 11, maxLength: 11, pattern: /^[0-9]{11}$/ },
  { code: "+81", country: "Japan", minLength: 10, maxLength: 11, pattern: /^[0-9]{10,11}$/ },
  { code: "+49", country: "Germany", minLength: 10, maxLength: 11, pattern: /^[0-9]{10,11}$/ },
  { code: "+33", country: "France", minLength: 9, maxLength: 9, pattern: /^[0-9]{9}$/ },
  { code: "+61", country: "Australia", minLength: 9, maxLength: 9, pattern: /^[0-9]{9}$/ },
  { code: "+65", country: "Singapore", minLength: 8, maxLength: 8, pattern: /^[0-9]{8}$/ },
];

// Helper function to get country code validation rules
export const getCountryValidation = (countryCode: string) => {
  return countryCodes.find((country) => country.code === countryCode) || {
    minLength: 8,
    maxLength: 15,
    pattern: /^[0-9]{8,15}$/,
  };
};

// Zod schema for form validation
export const createSignupSchema = (countryCode: string) => {
  const countryValidation = getCountryValidation(countryCode);
  
  return z.object({
    fullName: z.string().min(1, "Full name is required").trim(),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (val) => {
          const numericPhone = val.replace(/\D/g, "");
          return numericPhone.length >= countryValidation.minLength;
        },
        { message: `Phone number must be at least ${countryValidation.minLength} digits` }
      )
      .refine(
        (val) => {
          const numericPhone = val.replace(/\D/g, "");
          return numericPhone.length <= countryValidation.maxLength;
        },
        { message: `Phone number must be at most ${countryValidation.maxLength} digits` }
      )
      .refine(
        (val) => {
          const numericPhone = val.replace(/\D/g, "");
          return countryValidation.pattern.test(numericPhone);
        },
        {
          message: `Please enter a valid ${countryCodes.find((c) => c.code === countryCode)?.country || "phone"} number`,
        }
      ),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (!@#$%^&*)"),
  });
};

export type SignupFormData = z.infer<ReturnType<typeof createSignupSchema>>;

