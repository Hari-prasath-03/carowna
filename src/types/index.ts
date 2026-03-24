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

export type UserStats = {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
};

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  profile_url: string | null;
  total_bookings: number;
  created_at: string;
  last_active_at: string | null;
};

export type AdminUserProfile = {
  id: string;
  name: string;
  email: string;
  profile_url: string | null;
  mobile_no: string | null;
  date_of_birth: string | null;
  native_location: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  created_at: string;
  total_bookings: number;
  total_cancelled: number;
  total_spent: number;
};

export type UserBookingHistoryItem = {
  id: string;
  vehicle_name: string;
  vehicle_brand: string | null;
  vehicle_images: string[] | null;
  start_date: string;
  end_date: string;
  location_pickup: string;
  location_drop: string;
  booking_status: "PENDING_PAYMENT" | "REQUESTED" | "COMPLETED" | "CANCELLED";
  total_amount: number;
  created_at: string;
};

export type AdminBookingStats = {
  totalBookings: number;
  activeTrips: number;
  pendingConfirmations: number;
  cancelled: number;
};

export type AdminBookingListItem = {
  id: string;
  user_name: string;
  vehicle: {
    name: string;
    brand: string;
  };
  vendor_name: string;
  start_date: string;
  end_date: string;
  booking_status: string;
};

export type AdminBookingDetails = {
  id: string;
  start_date: string;
  end_date: string;
  location_pickup: string;
  location_drop: string;
  booking_status: string;
  total_amount: number;
  initial_amount: number;
  user: {
    id: string;
    profile_url: string | null;
  };
  vehicle_id: string;
  driver_id: string | null;
};

export type ApprovalStats = {
  totalPending: number;
  approvedToday: number;
  rejectedToday: number;
};

export type ApprovalListItem = {
  id: string;
  name: string;
  vehicle_type: string | null;
  approval_status: string;
  created_at: string;
  vendor_name: string;
  vendor_profile_url: string | null;
};

export type VehicleApprovalDetails = {
  id: string;
  name: string;
  brand: string | null;
  vehicle_type: string | null;
  transmission: string | null;
  fuel_type: string | null;
  capacity: number | null;
  price_per_day: number;
  images: string[] | null;
  registration_number: string;
  approval_status: string;
  created_at: string;
  rc_doc_url: string | null;
  insurance_doc_url: string | null;
  approval_remarks: string | null;
  vendor: {
    name: string;
  };
};

// Inputs

export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type BookingFormInput = z.infer<typeof bookingSchema>;
