import { z } from "zod";
import {
  bookingSchema,
  signupSchema,
  verifyOtpSchema,
} from "./validation-schema";

export type UserRole = "USER" | "VENDOR" | "ADMIN";
export type VehicleType = "bike" | "car" | "electrical" | "luxury";

// Types

export type User = {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
};

export type UserDetails = {
  profile_url: string;
  mobile_no: string;
  date_of_birth: string;
  native_location: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  license_doc_url: string;
  aadhaar_doc_url: string;
  license_verified: boolean;
  aadhaar_verified: boolean;
  created_at: string;
} & User;

export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  vehicle_type: VehicleType;
  transmission: "automatic" | "manual";
  price_per_day: number;
  capacity: number;
  fuel_type: string;
  images: string[];
  rating: number;
  insurance_doc_url?: string;
  rc_doc_url?: string;
  rto_verification_doc_url?: string;
  approval_status: "PENDING" | "APPROVED" | "REJECTED";
  vendor_id: string;
};

export type Driver = {
  id: string;
  vendor_id: string;
  name: string;
  years_of_exp: number;
  rating: number;
  price_per_day: number;
};

export type DriverDetails = {
  date_of_birth?: string;
  gender?: string;
  approval_status: "PENDING" | "APPROVED" | "REJECTED";
  license_doc_url?: string;
} & Driver;

// States

export type AuthActionState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

export type ResetPasswordState = {
  success: boolean;
  message?: string;
  errors?: {
    password?: string[];
    confirmPassword?: string[];
  };
};

export type ForgotPasswordState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
  };
};

export type BasicDetailsState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    mobile_no?: string[];
    date_of_birth?: string[];
    native_location?: string[];
    gender?: string[];
  };
};

export type Vendor = {
  id: string;
  name: string;
  email: string;
  profile_url: string | null;
  created_at: string;
  total: number;
  bikes: number;
  cars: number;
  luxury: number;
};

export type VendorStats = {
  total: number;
  bikes: number;
  cars: number;
  luxury: number;
};

export type VendorProfile = {
  id: string;
  name: string;
  email: string;
  profile_url: string | null;
  native_location: string | null;
  mobile_no?: string | null;
  date_of_birth?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  created_at: string;
};

export type VendorDetailStats = {
  totalVehicles: number;
  totalBookings: number;
  totalEarnings: number;
};

export type VendorVehicle = {
  id: string;
  name: string;
  brand: string | null;
  vehicle_type: string;
  registration_number: string;
  price_per_day: number;
  approval_status: "PENDING" | "APPROVED" | "REJECTED";
  images: string[] | null;
  last_rented: string | null;
  is_available: boolean;
};

// Inputs

export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type BookingFormInput = z.infer<typeof bookingSchema>;
