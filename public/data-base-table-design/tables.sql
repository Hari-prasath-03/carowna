CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT,
  email TEXT UNIQUE,
  role public.user_role DEFAULT 'USER',

  profile_url TEXT,
  mobile_no TEXT,
  date_of_birth DATE,
  native_location TEXT,
  gender TEXT,

  license_doc_url TEXT,
  aadhaar_doc_url TEXT,

  license_verified BOOLEAN DEFAULT FALSE,
  aadhaar_verified BOOLEAN DEFAULT FALSE,

  last_active_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  brand TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('bike', 'car', 'luxury')),
  transmission TEXT CHECK (transmission IN ('automatic', 'manual')),

  registration_number TEXT UNIQUE NOT NULL,
  images TEXT[],

  fuel_type TEXT,
  capacity INT,

  approval_status public.approval_status DEFAULT 'PENDING',
  approval_remarks TEXT,
  is_available BOOLEAN DEFAULT FALSE,

  insurance_doc_url TEXT,
  rc_doc_url TEXT,
  rto_verification_doc_url TEXT,

  price_per_day NUMERIC(10,2) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  years_of_exp INT,
  rating NUMERIC(2,1) DEFAULT 0.0,

  approval_status public.approval_status DEFAULT 'PENDING',
  approval_remarks TEXT,

  license_doc_url TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  driver_id UUID REFERENCES public.drivers(id),

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  booking_status public.booking_status DEFAULT 'REQUESTED',

  total_amount NUMERIC(10,2) NOT NULL,
  initial_amount NUMERIC(10,2) NOT NULL,

  location_pickup TEXT,
  location_drop TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CHECK (end_date >= start_date)
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,

  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',

  status public.payment_status DEFAULT 'CREATED',

  payment_method TEXT,

  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Role enum
CREATE TYPE public.user_role AS ENUM ('USER', 'VENDOR', 'ADMIN');

-- Approval status
CREATE TYPE public.approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Availability
CREATE TYPE public.availability_status AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- Booking status
CREATE TYPE public.booking_status AS ENUM (
  'PENDING_PAYMENT',
  'REQUESTED',
  'COMPLETED',
  'CANCELLED'
);

-- Payment status
CREATE TYPE public.payment_status AS ENUM (
  'CREATED',
  'SUCCESS',
  'FAILED'
);

CREATE INDEX idx_users_role ON public.users(role);

CREATE INDEX idx_vehicle_vendor ON public.vehicles(vendor_id);
CREATE INDEX idx_vehicle_approval ON public.vehicles(approval_status);

CREATE INDEX idx_driver_vendor ON public.drivers(vendor_id);
CREATE INDEX idx_driver_approval ON public.drivers(approval_status);

CREATE INDEX idx_booking_vehicle ON public.bookings(vehicle_id);
CREATE INDEX idx_booking_user ON public.bookings(user_id);
CREATE INDEX idx_booking_dates ON public.bookings(start_date, end_date);

CREATE INDEX idx_payment_booking ON public.payments(booking_id);
CREATE INDEX idx_payment_status ON public.payments(status);