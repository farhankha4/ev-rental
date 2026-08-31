# ⚡ SwiftVolt EV Rental Platform — Full Project Documentation

Welcome to the official, complete documentation for the **SwiftVolt EV Rental Platform** — a full-stack, production-ready electric scooter rental web application.

---

## 📌 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Tech Stack & System Architecture](#2-tech-stack--system-architecture)
3. [Repository Directory Structure](#3-repository-directory-structure)
4. [Complete Feature Matrix (Features 0 to 11)](#4-complete-feature-matrix-features-0-to-11)
5. [Database Schema & Supabase SQL Setup](#5-database-schema--supabase-sql-setup)
6. [API Endpoints Reference](#6-api-endpoints-reference)
7. [Core Business Logic & Algorithms](#7-core-business-logic--algorithms)
8. [Environment Variables Configuration](#8-environment-variables-configuration)
9. [Local Installation & Setup Guide](#9-local-installation--setup-guide)
10. [Automated Test Suite & Verification](#10-automated-test-suite--verification)
11. [Production Deployment Guide](#11-production-deployment-guide)

---

## 1. Executive Summary

SwiftVolt is an electric vehicle rental platform that allows customers to browse electric scooters, check real-time availability, make instant reservations, pay securely online via Razorpay, receive automated email receipts, leave reviews, and manage their bookings. Platform administrators have a dedicated management portal to create scooter models, update specs, toggle maintenance availability, delete vehicles, and monitor platform-wide customer rentals.

---

## 2. Tech Stack & System Architecture

```
                                  ┌────────────────────────┐
                                  │   Next.js 16 Frontend  │
                                  │   (App Router, React)  │
                                  └───────────┬────────────┘
                                              │
                                   HTTP / Server Proxy
                                              │
                                  ┌───────────▼────────────┐
                                  │  FastAPI Backend API   │
                                  │  (Python 3.12, Uvicorn)│
                                  └─────┬────────────┬─────┘
                                        │            │
                         Supabase Client│            │Razorpay SDK / SMTP
                                        ▼            ▼
                             ┌──────────────┐   ┌──────────────┐
                             │ PostgreSQL   │   │ Razorpay &   │
                             │ (Supabase)   │   │ Background   │
                             └──────────────┘   │ Emails       │
                                                └──────────────┘
```

### Stack Components:
- **Frontend Framework**: Next.js 16 (App Router, React 19, Turbopack, Tailwind CSS v4)
- **State Management & Data Fetching**: TanStack React Query v5
- **Backend API Engine**: FastAPI (Python 3.12+), Pydantic v2, Uvicorn
- **Database Layer**: Supabase PostgreSQL with Row Level Security (RLS) policies
- **Authentication**: JWT Bearer Tokens, bcrypt password hashing
- **Payments Gateway**: Razorpay Checkout SDK (Paise conversion & HMAC-SHA256 signature verification)
- **Email Notifications**: FastAPI `BackgroundTasks` & Python `smtplib` HTML email dispatcher

---

## 3. Repository Directory Structure

```
ev-rental/
├── backend/
│   ├── dependencies/
│   │   └── auth.py               # JWT verification & admin RBAC dependency (HTTP 403)
│   ├── models/
│   │   ├── booking.py            # Pydantic schemas for booking creation & response
│   │   ├── payment.py            # Pydantic schemas for Razorpay order & verification
│   │   ├── review.py             # Pydantic schemas for reviews & rating summary
│   │   ├── user.py               # Pydantic schemas for user register/login/response
│   │   └── vehicle.py            # Pydantic schemas for vehicle catalog & admin CRUD
│   ├── services/
│   │   ├── auth_service.py       # Password hashing & JWT generation
│   │   ├── booking_service.py    # Rental logic & date-overlap conflict engine
│   │   ├── email_service.py      # HTML email templates & SMTP/console dispatcher
│   │   ├── payment_service.py    # Razorpay order generation & HMAC verification
│   │   ├── review_service.py     # Reviews query & average rating score calculator
│   │   └── vehicle_service.py    # Vehicle catalog querying & admin fleet CRUD
│   ├── utils/
│   │   ├── auth.py               # bcrypt password hashing & PyJWT encode/decode
│   │   └── payment.py            # HMAC-SHA256 signature verifier
│   ├── .env                      # Database, JWT secret, Razorpay & SMTP credentials
│   ├── main.py                   # Central FastAPI app entrypoint & REST routing hub
│   └── requirements.txt          # Python dependencies (fastapi, uvicorn, supabase, razorpay, etc.)
│
├── src/
│   ├── app/
│   │   ├── admin/                # Admin Management Portal page & skeleton loader
│   │   ├── api/                  # Next.js Server-side API Proxy routes
│   │   ├── dashboard/            # My Bookings Customer Dashboard page & loader
│   │   ├── login/                # User Login page
│   │   ├── register/             # User Registration page
│   │   ├── vehicles/             # Vehicle Catalog grid & dynamic detail pages (/vehicles/[id])
│   │   ├── layout.js             # Root layout with QueryClientProvider & AuthProvider
│   │   └── page.js               # Hero Landing Page with featured fleet & system health monitor
│   ├── components/
│   │   ├── BookingCard.js        # Reservation card UI with "Pay Now" Razorpay modal trigger
│   │   ├── BookingWidget.js      # Date selection, conflict checker & price calculator
│   │   ├── Navbar.js             # Navigation bar with dynamic guest/user/admin links
│   │   ├── VehicleDescription.js # Scooter story description
│   │   ├── VehicleFeatures.js    # Included benefits (helmet, insurance, roadside assistance)
│   │   ├── VehicleGallery.js     # Image preview component
│   │   ├── VehicleReviews.js     # Star rating breakdown, review cards & submission form
│   │   └── VehicleSpecs.js       # Technical specifications list (battery, range, top speed)
│   ├── context/
│   │   └── AuthContext.js        # Global React AuthContext (token storage in localStorage)
│   └── hooks/
│       ├── useAdmin.js           # Admin fleet CRUD & platform booking queries
│       ├── useBooking.js         # Booking mutation hook
│       ├── useMyBookings.js      # User reservation list query hook
│       ├── useRazorpay.js        # Dynamic script loader hook for Razorpay Checkout JS
│       ├── useReviews.js         # Reviews query & review submission hook
│       ├── useVehicle.js         # Single vehicle detail query hook
│       └── useVehicles.js        # Catalog list query hook
```

---

## 4. Complete Feature Matrix (Features 0 to 11)

| Feature | Feature Name | Description | Key Files & Endpoints |
|---|---|---|---|
| **0** | **Health Check** | Diagnostics and live database connectivity status monitor. | `GET /health`, `/api/health`, `src/app/page.js` |
| **1** | **Browse Catalog** | Interactive electric scooter catalog grid with search and specs preview. | `GET /vehicles`, `src/app/vehicles/page.js` |
| **2** | **Scooter Details** | Detailed profile page with gallery, technical specifications, and features. | `GET /vehicles/{id}`, `src/app/vehicles/[id]/page.js` |
| **3** | **Authentication** | User registration, bcrypt password hashing, signed JWT access tokens, and session context. | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| **4** | **Booking Engine** | Instant reservation calculation with rental duration and cost computing. | `POST /bookings`, `src/components/BookingWidget.js` |
| **5** | **Availability Check** | Date overlap collision algorithm ($P_1 < R_2 \land R_1 > P_2$) preventing double-bookings. | `GET /vehicles/{id}/availability`, `booking_service.py` |
| **6** | **My Bookings Dashboard** | Personal reservation hub categorized into Upcoming vs Past rentals with data isolation. | `GET /bookings/my-bookings`, `src/app/dashboard/page.js` |
| **7** | **Razorpay Payments** | Online checkout popup modal with HMAC-SHA256 signature verification. | `POST /payments/create-order`, `POST /payments/verify` |
| **8** | **Admin Dashboard** | Protected RBAC management portal for fleet CRUD and platform-wide customer bookings. | `GET /admin/vehicles`, `POST /admin/vehicles`, `PUT /admin/vehicles/{id}`, `DELETE /admin/vehicles/{id}`, `/admin` |
| **9** | **Reviews & Ratings** | Star score average calculation, rating distribution breakdown, customer cards, and review form. | `GET /vehicles/{id}/reviews`, `POST /vehicles/{id}/reviews`, `VehicleReviews.js` |
| **10** | **Notifications** | Asynchronous booking confirmation and payment receipt emails via `BackgroundTasks`. | `BackgroundTasks`, `email_service.py` |
| **11** | **Deployment Check** | Next.js production build (`npm run build`) & 100% passing E2E master test suite. | `test_final_e2e.py`, `PROJECT_DOCUMENTATION.md` |

---

## 5. Database Schema & Supabase SQL Setup

Execute the following DDL script in your **Supabase SQL Editor** to create all tables and Row Level Security (RLS) policies:

```sql
-- 1. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  battery_kwh DOUBLE PRECISION NOT NULL,
  range_km INTEGER NOT NULL,
  top_speed_kmh INTEGER NOT NULL,
  price_per_day DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  return_time TIMESTAMP WITH TIME ZONE NOT NULL,
  total_amount DOUBLE PRECISION NOT NULL,
  booking_status TEXT DEFAULT 'reserved' NOT NULL,
  payment_status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC POLICIES
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "public_insert_vehicles" ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_vehicles" ON public.vehicles FOR UPDATE USING (true);
CREATE POLICY "public_delete_vehicles" ON public.vehicles FOR DELETE USING (true);

CREATE POLICY "public_select_users" ON public.users FOR SELECT USING (true);
CREATE POLICY "public_insert_users" ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select_bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "public_insert_bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_bookings" ON public.bookings FOR UPDATE USING (true);

CREATE POLICY "public_select_reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "public_insert_reviews" ON public.reviews FOR INSERT WITH CHECK (true);
```

---

## 6. API Endpoints Reference

### Public Endpoints:
- `GET /health` — Health check & DB status probe.
- `GET /vehicles` — Retrieve available scooter catalog.
- `GET /vehicles/{id}` — Fetch detailed scooter profile.
- `GET /vehicles/{id}/availability` — Check date availability for a scooter.
- `GET /vehicles/{id}/reviews` — Retrieve average score, star breakdown, and review cards.
- `POST /auth/register` — Register a new customer user.
- `POST /auth/login` — Authenticate user & receive JWT token.

### Protected Customer Endpoints (Header: `Authorization: Bearer <token>`):
- `GET /auth/me` — Fetch current user session details.
- `POST /bookings` — Create a new scooter reservation.
- `GET /bookings/my-bookings` — Retrieve logged-in user's reservations.
- `GET /bookings/{id}` — Fetch receipt for a specific reservation.
- `POST /payments/create-order` — Generate Razorpay Order ID.
- `POST /payments/verify` — Verify Razorpay HMAC signature & confirm payment.
- `POST /vehicles/{id}/reviews` — Submit a 1-5 star review and feedback comment.

### Protected Admin Endpoints (Requires `user.role == 'admin'`):
- `GET /admin/vehicles` — Retrieve all vehicles (including disabled/maintenance models).
- `POST /admin/vehicles` — Add a new scooter to the catalog.
- `PUT /admin/vehicles/{id}` — Update scooter specifications or pricing.
- `PATCH /admin/vehicles/{id}/toggle-availability` — Toggle between Active and Maintenance mode.
- `DELETE /admin/vehicles/{id}` — Delete a scooter model from database.
- `GET /admin/bookings` — Retrieve all platform-wide user bookings.

---

## 7. Core Business Logic & Algorithms

### 1. Date Collision Prevention Algorithm
Two date intervals $[P_1, R_1)$ and $[P_2, R_2)$ overlap if and only if:
$$\text{Pickup}_1 < \text{Return}_2 \quad \land \quad \text{Return}_1 > \text{Pickup}_2$$

This condition is checked in `backend/services/booking_service.py` (`is_vehicle_available`) against all existing `reserved` and `confirmed` bookings for the target scooter before allowing a new reservation.

### 2. Rental Cost Calculation
```python
duration_seconds = (return_time - pickup_time).total_seconds()
duration_days = max(1, math.ceil(duration_seconds / 86400.0))
total_amount = round(duration_days * vehicle.price_per_day, 2)
```

### 3. Razorpay HMAC-SHA256 Signature Verification
```python
expected_signature = hmac.new(
    key=RAZORPAY_KEY_SECRET.encode("utf-8"),
    msg=f"{razorpay_order_id}|{razorpay_payment_id}".encode("utf-8"),
    digestmod=hashlib.sha256
).hexdigest()

is_valid = hmac.compare_digest(expected_signature, razorpay_signature)
```

---

## 8. Environment Variables Configuration

### Backend Environment File (`backend/.env`):
```ini
# Supabase PostgreSQL Configuration
SUPABASE_URL=https://gwvgpiawbbzyjccvflmq.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here

# JWT Authentication
SECRET_KEY=your-jwt-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Razorpay Payments Configuration
RAZORPAY_KEY_ID=rzp_test_mock_key_12345
RAZORPAY_KEY_SECRET=rzp_test_secret_key_swiftvolt_9988

# Optional Email SMTP Settings (Falls back to console logger if unconfigured)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SENDER_EMAIL=notifications@swiftvolt.com
```

---

## 9. Local Installation & Setup Guide

### Prerequisites:
- **Node.js**: v18+ or v20+
- **Python**: 3.12+

### Step 1: Clone Repository & Setup Backend
```bash
git clone <repo-url>
cd ev-rental/backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate   # On Windows (or source .venv/bin/activate on Linux/Mac)

# Install backend dependencies
pip install -r requirements.txt

# Start FastAPI Dev Server
uvicorn main:app --reload --port 8000
```

### Step 2: Setup Frontend
```bash
# In the root folder (ev-rental/)
npm install

# Start Next.js Dev Server
npm run dev
```

### Step 3: Open in Browser
- Landing Page: [http://localhost:3000](http://localhost:3000)
- Scooter Catalog: [http://localhost:3000/vehicles](http://localhost:3000/vehicles)
- My Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin) *(Admin Login: `testpilot@swiftvolt.com` / `SecurePassword123!`)*

---

## 10. Automated Test Suite & Verification

The project includes an all-inclusive automated integration test suite located in `scratch/test_final_e2e.py`.

```bash
# Run Master E2E Test Suite
.venv\Scripts\python.exe scratch/test_final_e2e.py
```

### Output:
```
========================================================================
  SWIFTVOLT EV RENTAL PLATFORM -- MASTER E2E INTEGRATION TEST SUITE
========================================================================

Feature 0 [Health Check]: Status 200 | DB Status: connected
 -> [PASSED] Backend API & Supabase DB Connection Verified!

Feature 1 & 2 [Catalog & Specs]: Found 9 scooters.
 -> Selected Scooter: SwiftVolt MCFLY (Daily Rate: RS. 1100.0)
 -> [PASSED] Scooter Catalog & Detail Specs Verified!

Feature 3 [Authentication]: Registered Customer 'E2E Test Rider'
 -> [PASSED] Registration, Login & JWT Session Verification Verified!

Feature 4 & 5 [Booking & Conflict Check]: Created Reservation #0ea7cd04...
 -> Total Rental Amount: RS. 2200.0 | Duration: 2 Days
 -> [PASSED] Overlap Prevention & Booking Engine Verified!

Feature 6 [My Bookings Dashboard]: Retrieved 1 reservations for customer.
 -> [PASSED] Customer Rental Dashboard & Data Isolation Verified!

Feature 7 [Razorpay Payments]: Order order_test_0ea7cd04 Verified!
 -> Payment Status: paid | Booking Status: confirmed
 -> [PASSED] HMAC SHA256 Payment Verification & DB Update Verified!

Feature 8 [Admin Dashboard & RBAC Guard]:
 -> Regular Customer blocked with 403 Forbidden [PASSED]
 -> Admin Fleet CRUD Verified [PASSED]

Feature 9 [Reviews & Ratings]: Average Score: 5.0 Stars
 -> [PASSED] Customer Review Cards & Rating Recalculation Verified!

Feature 10 [Notifications]: BackgroundTasks Email Dispatcher Verified!
 -> Booking Confirmation & Payment Receipt Emails Dispatched Asynchronously!

========================================================================
  SUCCESS: ALL 10 ROADMAP FEATURES PASSED 100% E2E INTEGRATION AUDIT!
========================================================================
```

---

## 11. Production Deployment Guide

### Frontend Deployment (Vercel):
1. Connect repository to Vercel.
2. Set Environment Variable: `FASTAPI_URL=https://your-backend-api.onrender.com`
3. Build Command: `npm run build`

### Backend Deployment (Render / Railway / Fly.io):
1. Deploy `/backend` directory.
2. Set Environment Variables (`SUPABASE_URL`, `SUPABASE_KEY`, `SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

*Documentation generated for SwiftVolt EV Rental Platform. All rights reserved.*
