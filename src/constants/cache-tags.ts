export const CACHE_TAGS = {
  // Admin Dashboard
  REVENUE: "admin:revenue-trends",
  BOOKINGS: "admin:recent-bookings",
  STATS: "admin:dashboard-stats",
  APPROVAL_COUNT: "admin:pending-approvals-count",

  // User specific
  AUTH: "all:user-auth-verification",

  // Global / Shared
  VEHICLES: "vehicles",
  VEHICLE_DETAILS: "vehicle-details",
  PRICE_RANGE: "price-range",
  DRIVERS: "drivers",
  VENDORS: "vendors",
  USER_PROFILE: "user-profile",
  USER_BOOKINGS: "user-bookings-history",
} as const;

export const CACHE_TIME = {
  ADMIN: 300,
  FREQUENT: 300,
  RARE: 3600,
} as const;
