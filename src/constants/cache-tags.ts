export const CACHE_TAGS = {
  // Admin Dashboard
  REVENUE: "admin:revenue-trends",
  BOOKINGS: "admin:recent-bookings",
  DASHBOARD_STATS: "admin:dashboard-stats",
  APPROVAL_COUNT: "admin:pending-approvals-count",
  // Vendor list page
  VENDORS: "admin:vendors-list",
  VENDOR_STATS: "admin:vendors-stats",
  // Vendor detail page
  VENDOR_PROFILE: "admin:vendor-profile",
  VENDOR_DETAIL_STATS: "admin:vendor-detail-stats",
  VENDOR_VEHICLES: "admin:vendor-vehicles",

  // User specific
  AUTH: "all:user-auth-verification",

  // Global / Shared
  VEHICLES: "vehicles",
  VEHICLE_DETAILS: "vehicle-details",
  PRICE_RANGE: "price-range",
  DRIVERS: "drivers",
  USER_PROFILE: "user-profile",
  USER_BOOKINGS: "user-bookings-history",
} as const;

export const CACHE_TIME = {
  ADMIN: 300,
  FREQUENT: 300,
  RARE: 3600,
} as const;
