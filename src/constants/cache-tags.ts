export const ADMIN_CACHE_TAGS = {
  REVENUE: "admin:revenue-trends",
  BOOKINGS: "admin:recent-bookings",
  DASHBOARD_STATS: "admin:dashboard-stats",
  PENDING_APPROVALS_COUNT: "admin:pending-approvals-count",

  // Bookings list page
  BOOKINGS_LIST: "admin:bookings-list",
  BOOKING_STATS: "admin:booking-stats",

  // Approvals list page
  APPROVALS_LIST: "admin:approvals-list",
  APPROVALS_STATS: "admin:approvals-stats",

  // Vendor list page
  VENDORS_LIST: "admin:vendors-list",
  VENDORS_STATS: "admin:vendors-stats",

  // Users list page
  USERS_LIST: "admin:users-list",
  USERS_STATS: "admin:users-stats",
  USER_DETAILS: "admin:user-details",
  USER_BOOKINGS: "admin:user-bookings",

  // Driver Management
  DRIVERS_LIST: "admin:drivers-list",
  DRIVER_STATS: "admin:driver-stats",
  DRIVER_DETAILS: "admin:driver-details",

  // Vendor detail page
  VENDOR_PROFILE: "admin:vendor-profile",
  VENDOR_DETAIL_STATS: "admin:vendor-detail-stats",
  VENDOR_VEHICLES: "admin:vendor-vehicles",
  APPROVAL_DETAILS: "admin:approval-details",
  BOOKING_DETAILS: "admin:booking-details",
} as const;

export const VENDOR_CACHE_TAGS = {
  // Vendor Dashboard
  DASHBOARD_STATS: "vendor:dashboard-stats",
  RECENT_BOOKINGS: "vendor:recent-bookings",

  // Vehicle Management
  VEHICLES_LIST: "vendor:vehicles-list",
  VEHICLE_STATS: "vendor:vehicle-stats",
  VEHICLE_DETAILS: "vendor:vehicle-details",

  // Booking Management
  BOOKINGS_LIST: "vendor:bookings-list",
  BOOKING_STATS: "vendor:booking-stats",
  BOOKING_DETAILS: "vendor:booking-details",
} as const;

export const USER_CACHE_TAGS = {
  AUTH_VERIFICATION: "all:user-auth-verification",
  PROFILE: "user:profile",
  BOOKINGS_HISTORY: "user:bookings-history",

  // Public Listing
  VEHICLES_LIST: "user:vehicles-list",
  VEHICLE_DETAILS: "user:vehicle-details",
  PRICE_RANGE: "user:price-range",
  DRIVERS: "user:drivers",
} as const;

export const CACHE_TIME = {
  FREQUENT: 300,
  RARE: 3600,
} as const;
