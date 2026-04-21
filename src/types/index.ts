import { z } from "zod";
import * as S from "./validation-schema";

// --- Enums (Inferred from Schemas) ---

export type UserRole = z.infer<typeof S.UserRoleEnum>;
export type Gender = z.infer<typeof S.GenderEnum>;
export type VehicleType = z.infer<typeof S.VehicleTypeEnum>;
export type Transmission = z.infer<typeof S.TransmissionEnum>;
export type FuelType = z.infer<typeof S.FuelTypeEnum>;
export type ApprovalStatus = z.infer<typeof S.ApprovalStatusEnum>;
export type BookingStatus = z.infer<typeof S.BookingStatusEnum>;
export type PaymentStatus = z.infer<typeof S.PaymentStatusEnum>;

// --- Core Entity Types (Inferred from Table Schemas) ---

export type User = z.infer<typeof S.userSchema>;
export type Vehicle = z.infer<typeof S.vehicleSchema>;
export type Driver = z.infer<typeof S.driverSchema>;
export type Booking = z.infer<typeof S.bookingSchema>;
export type Payment = z.infer<typeof S.paymentSchema>;

// --- Specialized User Types ---

export type AuthUser = Pick<User, "id" | "email" | "name" | "role">;

export type UserDetails = User;

export type UserListItem = Pick<
  User,
  "id" | "name" | "email" | "profile_url" | "created_at" | "last_active_at"
> & {
  total_bookings: number;
};

export type AdminUserProfile = Pick<
  User,
  | "id"
  | "name"
  | "email"
  | "role"
  | "profile_url"
  | "mobile_no"
  | "date_of_birth"
  | "native_location"
  | "gender"
  | "created_at"
  | "last_active_at"
> & {
  total_bookings: number;
  total_cancelled: number;
  total_spent: number;
};

export type Vendor = Pick<
  User,
  "id" | "name" | "email" | "profile_url" | "created_at"
> & {
  total: number;
  bikes: number;
  cars: number;
  luxury: number;
};

export type VendorProfile = Pick<
  User,
  | "id"
  | "name"
  | "email"
  | "profile_url"
  | "native_location"
  | "mobile_no"
  | "date_of_birth"
  | "gender"
  | "created_at"
>;

// --- Specialized Vehicle Types ---

export type VendorVehicle = Pick<
  Vehicle,
  | "id"
  | "vendor_id"
  | "name"
  | "brand"
  | "vehicle_type"
  | "registration_number"
  | "price_per_day"
  | "approval_status"
  | "images"
  | "is_available"
> & {
  last_rented: string | null;
};

export type VendorVehicleDetails = Pick<
  Vehicle,
  | "id"
  | "vendor_id"
  | "name"
  | "brand"
  | "vehicle_type"
  | "transmission"
  | "fuel_type"
  | "capacity"
  | "price_per_day"
  | "images"
  | "registration_number"
  | "approval_status"
  | "is_available"
  | "is_luxury"
  | "rc_doc_url"
  | "insurance_doc_url"
  | "rto_verification_doc_url"
  | "color"
  | "state"
  | "district"
  | "approval_remarks"
  | "created_at"
> & {
  performance: {
    totalRevenue: number;
    utilization: number;
    totalBookings: number;
  };
  recentBookings: (Pick<
    Booking,
    "id" | "start_date" | "end_date" | "total_amount" | "booking_status"
  > & {
    user_name: string;
  })[];
};

export type VehicleApprovalDetails = Pick<
  Vehicle,
  | "id"
  | "name"
  | "brand"
  | "vehicle_type"
  | "transmission"
  | "fuel_type"
  | "capacity"
  | "price_per_day"
  | "images"
  | "registration_number"
  | "approval_status"
  | "approval_remarks"
  | "rc_doc_url"
  | "insurance_doc_url"
  | "rto_verification_doc_url"
  | "color"
  | "state"
  | "district"
  | "is_luxury"
  | "created_at"
> & {
  vendor: {
    name: string;
  };
};

export type ApprovalListItem = Pick<
  Vehicle,
  "id" | "name" | "vehicle_type" | "approval_status" | "created_at"
> & {
  vendor_name: string;
  vendor_profile_url: string | null;
};

// --- Specialized Driver Types ---

export type DriverDetails = Driver;

export type SystemDriver = Pick<
  Driver,
  "id" | "name" | "years_of_exp" | "rating" | "is_available"
>;

export type SystemDriverDetails = Pick<
  Driver,
  | "id"
  | "name"
  | "date_of_birth"
  | "gender"
  | "years_of_exp"
  | "rating"
  | "price_per_day"
  | "is_available"
  | "license_doc_url"
  | "created_at"
> & {
  performance: {
    totalRevenue: number;
    utilization: number;
    totalBookings: number;
  };
  recentBookings: (Pick<
    Booking,
    "id" | "start_date" | "end_date" | "total_amount" | "booking_status"
  > & {
    user_name: string;
  })[];
};

// --- Specialized Booking Types ---

export type VendorBooking = Pick<
  Booking,
  | "id"
  | "start_date"
  | "end_date"
  | "total_amount"
  | "initial_amount"
  | "booking_status"
  | "created_at"
> & {
  user_name: string;
  vehicle_name: string;
  driver_name: string | null;
  registration_number: string;
  payment_status: PaymentStatus;
  payment_method: string | null;
};

export type VendorBookingDetails = VendorBooking & {
  user_email: string;
  user_phone: string | null;
  vehicle_images: string[];
  vehicle_brand: string | null;
  driver_license: string | null;
  payments: Pick<
    Payment,
    "id" | "amount" | "status" | "payment_method" | "created_at"
  >[];
};

export type VendorRecentBooking = Pick<
  Booking,
  | "id"
  | "start_date"
  | "end_date"
  | "created_at"
  | "booking_status"
  | "total_amount"
> & {
  vehicle_name: string;
  vehicle_brand: string | null;
};

export type UserBookingHistoryItem = Pick<
  Booking,
  | "id"
  | "start_date"
  | "end_date"
  | "location_pickup"
  | "location_drop"
  | "booking_status"
  | "total_amount"
  | "created_at"
> & {
  vehicle_name: string;
  vehicle_brand: string | null;
  vehicle_images: string[] | null;
};

export type AdminBookingListItem = Pick<
  Booking,
  "id" | "start_date" | "end_date" | "booking_status"
> & {
  user_name: string;
  vehicle: Pick<Vehicle, "name" | "brand">;
  vendor_name: string;
};

export type AdminBookingDetails = Pick<
  Booking,
  | "id"
  | "start_date"
  | "end_date"
  | "location_pickup"
  | "location_drop"
  | "booking_status"
  | "total_amount"
  | "initial_amount"
  | "vehicle_id"
  | "driver_id"
> & {
  user: Pick<User, "id" | "profile_url">;
};

// --- Stats Types ---

export type UserStats = {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
};

export type VendorStats = {
  total: number;
  bikes: number;
  cars: number;
  luxury: number;
};

export type VendorDetailStats = {
  totalVehicles: number;
  totalBookings: number;
  totalEarnings: number;
};

export type VendorBookingStats = {
  totalBookings: number;
  activeTrips: number;
  pendingRequests: number;
  totalRevenue: number;
};

export type VendorDashboardStats = {
  totalVehicles: number;
  activeBookings: number;
  upcomingBookings: number;
  totalEarnings: number;
};

export type AdminBookingStats = {
  totalBookings: number;
  activeTrips: number;
  pendingConfirmations: number;
  cancelled: number;
};

export type ApprovalStats = {
  totalPending: number;
  approvedToday: number;
  rejectedToday: number;
};

export type VendorVehicleStats = {
  totalVehicles: number;
  onlineVehicles: number;
  pendingApprovals: number;
};

export type SystemDriverStats = {
  totalDrivers: number;
  onlineDrivers: number;
};

// --- Action States ---

export type AuthActionState = {
  success: boolean;
  error: string | null;
  message: string | null;
  role?: UserRole;
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
  errors?: Partial<
    Record<keyof z.infer<typeof S.basicDetailsSchema>, string[]>
  >;
};

export type AddVehicleState = {
  success: boolean;
  error: string | null;
  message: string | null;
  id?: string;
};

export type AddDriverState = {
  success: boolean;
  error: string | null;
  message: string | null;
  id?: string;
  errors?: Partial<Record<keyof z.infer<typeof S.DriverFormSchema>, string[]>>;
};

// --- Input Types (Inferred from Schemas) ---

export type SignupInput = z.infer<typeof S.signupSchema>;
export type VerifyOtpInput = z.infer<typeof S.verifyOtpSchema>;
export type BookingFormInput = z.infer<typeof S.bookingSchema>;
export type AddVendorInput = z.infer<typeof S.addVendorSchema>;
export type EditVendorInput = z.infer<typeof S.editVendorSchema>;
export type VehicleInput = z.infer<typeof S.VehicleFormSchema>;
export type DriverInput = z.infer<typeof S.DriverFormSchema>;
