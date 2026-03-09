# 🚗 Carvona — Premium Car Rental Platform

Carvona is a full-stack vehicle booking platform that connects customers with vehicles and drivers. It supports three distinct user roles — **Customer**, **Vendor**, and **Admin** — each with a dedicated portal and experience.

---

## Architecture Overview

### High-Level Flow

![High-level Flow](public/image.png)

### Database Schema

![Database Schema](public/db-schema.png)

---

## Tech Stack

| Category            | Technology                                                               |
| ------------------- | ------------------------------------------------------------------------ |
| **Framework**       | [Next.js 16](https://nextjs.org) (App Router, Server Components)         |
| **Database & Auth** | [Supabase](https://supabase.com) (PostgreSQL, RLS, Storage)              |
| **Styling**         | [Tailwind CSS 4](https://tailwindcss.com)                                |
| **UI Components**   | [Radix UI](https://www.radix-ui.com), [shadcn/ui](https://ui.shadcn.com) |
| **Charts**          | [Recharts](https://recharts.org)                                         |
| **Icons**           | [Lucide React](https://lucide.dev)                                       |
| **Validation**      | [Zod](https://zod.dev)                                                   |
| **Notifications**   | [Sonner](https://sonner.emilkowal.ski)                                   |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/             # Public auth pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── verify-otp/
│   │   └── auth-error/
│   ├── (user)/             # Customer-facing pages
│   │   ├── page.tsx        # Vehicle browse / home
│   │   ├── vehicle/[vehicleId]/
│   │   ├── booking/[vehicleId]/[[...driverId]]/
│   │   ├── payment/[bookingId]/
│   │   ├── history/        # Booking history
│   │   ├── profile/
│   │   └── basic-details/
│   ├── (protected)/
│   │   ├── (admin)/dashboard/
│   │   │   ├── page.tsx        # Stats, revenue, recent bookings
│   │   │   ├── bookings/
│   │   │   ├── users/
│   │   │   ├── vendors/
│   │   │   ├── cms/
│   │   │   └── pending-approvals/
│   │   └── (vendor)/vendor/
│   │       ├── page.tsx
│   │       ├── bookings/
│   │       └── onboardings/
│   └── api/
│       ├── auth/callback/
│       ├── booking/validate/
│       ├── payment/verify/
│       └── vehicles/
│
├── actions/
│   ├── auth/               # Login, signup, logout, OTP
│   ├── booking/            # Create booking, revalidation
│   └── user/               # Profile updates, KYC doc uploads
│
├── service/                # Server-side data fetching (cached)
│   ├── admin.ts            # Dashboard stats, revenue, approvals
│   ├── bookings.ts         # User booking history (RLS-compliant cache)
│   ├── drivers.ts          # Driver listings by vendor
│   ├── self-user.ts        # Authenticated user session & profile
│   ├── user.ts             # User profile details
│   └── vehicles.ts         # Vehicle search, details, price range
│
├── lib/
│   ├── supabase/clients/
│   │   ├── server.ts       # Cookie-based client (authenticated requests)
│   │   ├── client.ts       # Browser client
│   │   ├── admin.ts        # Service-role client (bypasses RLS)
│   │   ├── public.ts       # Anon client (public data, cache-safe)
│   │   └── token.ts        # Token-based client (RLS-compliant, cache-safe)
│   ├── query-builder.ts    # Supabase query abstraction
│   └── error-handler.ts    # Result type utilities (ok / err)
│
├── constants/
│   ├── cache-tags.ts       # Centralized CACHE_TAGS & CACHE_TIME
│   └── index.ts
│
├── components/
│   ├── ui/                 # Base design system (Button, Badge, Loader...)
│   ├── admin/              # Dashboard-specific components
│   ├── layout/             # Navbar, bottom nav, back button
│   ├── home/               # Vehicle cards, filters
│   ├── booking/            # Booking flow components
│   ├── forms/              # Auth, profile, KYC forms
│   └── vehicles/           # Vehicle detail page components
│
└── types/                  # Global TypeScript interfaces
```

---

## Performance Architecture

Carvona uses a layered caching strategy built on Next.js `unstable_cache`:

| Layer                 | Strategy                      | TTL                                   |
| --------------------- | ----------------------------- | ------------------------------------- |
| Admin Dashboard       | `CACHE_TIME.ADMIN` (5 min)    | Server cache + tag-based invalidation |
| Auth verification     | `CACHE_TIME.FREQUENT` (5 min) | Token-based, cache-safe               |
| Booking history       | `CACHE_TIME.FREQUENT` (5 min) | RLS-compliant via Bearer token        |
| Vehicle & Driver data | `CACHE_TIME.RARE` (1 hour)    | Public Supabase client, anon-safe     |
| User profile          | `CACHE_TIME.RARE` (1 hour)    | Public data, RLS enforced by Supabase |

All cache tags are centralized in `src/constants/cache-tags.ts` to eliminate magic strings and enable precise on-demand revalidation.

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Fill in your Supabase keys

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

### Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Key Features

- 🔍 **Vehicle Search** — Filter by type, transmission, fuel, and price range
- 📋 **Booking Flow** — Multi-step booking with or without a driver
- 💳 **Payment Integration** — Verified via webhook callbacks
- 🪪 **KYC Verification** — Aadhaar & license doc upload and review
- 📊 **Admin Dashboard** — Revenue charts, platform stats, pending approvals
- 🏪 **Vendor Portal** — Vehicle listing and driver management
- ⚡ **Sub-50ms Cached Pages** — Production-grade performance without stale data
