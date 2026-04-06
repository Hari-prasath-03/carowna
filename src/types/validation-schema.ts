import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  token: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const basicDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile_no: z.string().regex(/^[0-9]{10,15}$/, "Enter a valid mobile number"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  native_location: z
    .string()
    .min(2, "Native location must be at least 2 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Please select a gender",
  }),
});

export const bookingSchema = z.object({
  vehicle_id: z.string().uuid(),
  driver_id: z.string().uuid().optional().nullable(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  location_pickup: z.string().min(1, "Pickup location is required"),
  location_drop: z.string().min(1, "Drop-off location is required"),
  total_amount: z.number().positive(),
  initial_amount: z.number().positive(),
});

export const addVendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile_no: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Enter a valid mobile number")
    .optional(),
  date_of_birth: z.string().optional(),
  native_location: z.string().optional(),
  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], {
      message: "Please select a gender",
    })
    .optional(),
});

export const editVendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  mobile_no: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Enter a valid mobile number")
    .optional(),
  date_of_birth: z.string().optional(),
  native_location: z.string().optional(),
  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], {
      message: "Please select a gender",
    })
    .optional(),
});

export const VehicleSchema = z.object({
  name: z.string().min(2, "Name is required"),
  brand: z.string().min(2, "Brand is required"),
  vehicle_type: z.string().min(1, "Type is required"),
  registration_number: z.string().min(5, "Valid registration is required"),
  fuel_type: z.string().min(1, "Fuel type is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  price_per_day: z.coerce.number().min(1, "Price must be at least 1"),
  transmission: z.string().optional().nullable(),
  is_available: z.coerce.boolean().default(false),
});

export const DriverSchema = z.object({
  name: z.string().min(2, "Name is required"),
  years_of_exp: z.coerce.number().min(0, "Experience cannot be negative"),
  date_of_birth: z.string().optional().nullable(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
  availability_status: z.coerce.boolean().default(false),
});

export type AddVendorInput = z.infer<typeof addVendorSchema>;
export type EditVendorInput = z.infer<typeof editVendorSchema>;
export type DriverInput = z.infer<typeof DriverSchema>;
