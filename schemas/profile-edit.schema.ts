import { z } from "zod";

export const profileEditSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  phoneNo: z.number().min(1, "Phone number is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender is required",
  }),
});

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;
