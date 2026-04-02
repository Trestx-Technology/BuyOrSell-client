import { z } from "zod";

export const addressSchema = z.object({
  emirate: z.string().min(1, "Emirate is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  pincode: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^\d{5,6}$/.test(val), {
      message: "Please enter a valid 5-6 digit pincode",
    }),
  street: z.string().min(1, "Street is required"),
  addressType: z.enum(["home", "office", "other"], {
    message: "Address type is required",
  }),
  isPrimary: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
