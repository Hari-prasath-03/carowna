import { z } from "zod";

// --- Enums ---

export const UserRoleEnum = z.enum(["USER", "VENDOR", "ADMIN"]);
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const VehicleTypeEnum = z.enum(["bike", "car"]);
export const TransmissionEnum = z.enum(["automatic", "manual"]);
export const FuelTypeEnum = z.enum([
  "petrol",
  "diesel",
  "electric",
  "cng",
  "hybrid",
]);
export const ApprovalStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export const BookingStatusEnum = z.enum([
  "PENDING_PAYMENT",
  "REQUESTED",
  "COMPLETED",
  "CANCELLED",
]);
export const PaymentStatusEnum = z.enum(["CREATED", "SUCCESS", "FAILED"]);

// --- Core Table Schemas ---

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: UserRoleEnum.default("USER"),
  profile_url: z.string().url().nullable(),
  mobile_no: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Invalid mobile number")
    .nullable(),
  date_of_birth: z.string().nullable(),
  native_location: z.string().nullable(),
  gender: GenderEnum.nullable(),
  license_doc_url: z.string().url().nullable(),
  aadhaar_doc_url: z.string().url().nullable(),
  license_verified: z.boolean().default(false),
  aadhaar_verified: z.boolean().default(false),
  last_active_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const vehicleSchema = z.object({
  id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  name: z.string().min(2, "Name is required"),
  brand: z.string().min(2, "Brand is required"),
  vehicle_type: VehicleTypeEnum,
  transmission: TransmissionEnum,
  is_luxury: z.coerce.boolean().default(false),
  color: z.string().nullable(),
  registration_number: z.string().min(5, "Valid registration is required"),
  images: z.array(z.string().url()).default([]),
  fuel_type: FuelTypeEnum,
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  state: z.string().default("Tamil Nadu"),
  district: z.string().default("Salem"),
  approval_status: ApprovalStatusEnum.default("PENDING"),
  approval_remarks: z.string().nullable(),
  is_available: z.coerce.boolean().default(true),
  insurance_doc_url: z.string().url().nullable(),
  rc_doc_url: z.string().url().nullable(),
  rto_verification_doc_url: z.string().url().nullable(),
  price_per_day: z.coerce.number().min(0),
  created_at: z.string(),
  updated_at: z.string(),
});

export const driverSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name is required"),
  date_of_birth: z.string().nullable(),
  gender: GenderEnum.nullable(),
  years_of_exp: z.coerce.number().min(0),
  rating: z.number().min(0).max(5).default(0),
  price_per_day: z.coerce.number().min(0).default(0),
  is_available: z.coerce.boolean().default(true),
  license_doc_url: z.string().url().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const bookingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  vehicle_id: z.string().uuid(),
  driver_id: z.string().uuid().nullable(),
  start_date: z.string(),
  end_date: z.string(),
  booking_status: BookingStatusEnum.default("REQUESTED"),
  total_amount: z.number().positive(),
  initial_amount: z.number().positive(),
  location_pickup: z.string().min(1, "Pickup location is required"),
  location_drop: z.string().min(1, "Drop-off location is required"),
  created_at: z.string(),
  updated_at: z.string(),
});

export const paymentSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  status: PaymentStatusEnum.default("CREATED"),
  payment_method: z.string().nullable(),
  razorpay_order_id: z.string().nullable(),
  razorpay_payment_id: z.string().nullable(),
  razorpay_signature: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// --- Specialized Form/Input Schemas ---

export const signupObjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
});

export const signupSchema = signupObjectSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

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

export const basicDetailsSchema = userSchema.pick({
  name: true,
  mobile_no: true,
  date_of_birth: true,
  native_location: true,
  gender: true,
});

export const addVendorSchema = signupObjectSchema.extend({
  mobile_no: userSchema.shape.mobile_no,
  date_of_birth: userSchema.shape.date_of_birth,
  native_location: userSchema.shape.native_location,
  gender: userSchema.shape.gender,
});

export const editVendorSchema = addVendorSchema.partial().extend({
  name: userSchema.shape.name,
  email: userSchema.shape.email,
});

export const VehicleFormSchema = vehicleSchema
  .omit({
    id: true,
    vendor_id: true,
    approval_status: true,
    approval_remarks: true,
    created_at: true,
    updated_at: true,
    images: true,
    insurance_doc_url: true,
    rc_doc_url: true,
    rto_verification_doc_url: true,
  })
  .extend({
    is_available: z.coerce.boolean().default(true),
  });

export const DriverFormSchema = driverSchema.omit({
  id: true,
  rating: true,
  created_at: true,
  updated_at: true,
});

export const BookingFormSchema = bookingSchema
  .omit({
    id: true,
    user_id: true,
    booking_status: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    total_amount: z.coerce.number().positive(),
    initial_amount: z.coerce.number().positive(),
  });
