# ⚡ SwiftVolt EV Rental Platform

A modern, full-stack electric scooter rental web application built with **Next.js 16 (App Router)**, **FastAPI (Python 3.12)**, **Supabase PostgreSQL**, **Razorpay Payment Gateway**, and **FastAPI BackgroundTasks Email Notifications**.

---

## 🚀 Key Features

- **⚡ Hero Landing Page**: Modern conversion portal with featured fleet preview and live system architecture monitor.
- **🛴 Scooter Catalog**: Filterable electric scooter fleet grid with real-time specs (Battery, Range, Top Speed).
- **🔒 Authentication**: Customer & Admin registration/login with bcrypt password hashing and signed JWT tokens.
- **📅 Conflict-Free Booking**: Date collision algorithm ($P_1 < R_2 \land R_1 > P_2$) preventing double-bookings.
- **💳 Razorpay Online Payments**: Secure checkout modal with HMAC-SHA256 signature verification.
- **📋 My Bookings Dashboard**: Personal reservation portal with Upcoming vs Past rental tabs.
- **🛡️ Admin Management Portal**: Fleet CRUD operations (Add, Edit specs, Maintenance Mode toggle, Delete) and platform-wide rental overview.
- **⭐️ Reviews & Ratings**: 1-5 star ratings, average score recalculation, star breakdown bars, and review cards.
- **✉️ Automated Notifications**: Asynchronous HTML email dispatching for booking confirmations and payment receipts via `BackgroundTasks`.

---

## 📖 Full Documentation
For complete technical documentation, directory structure, database DDL scripts, API reference, and deployment instructions, please see:
👉 **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**

---

## ⚡ Quick Start

### 1. Start FastAPI Backend (Port 8000)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Start Next.js Frontend (Port 3000)
```bash
npm install
npm run dev
```

### 3. Open Web App
- Web App: [http://localhost:3000](http://localhost:3000)
- Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin) *(Admin Login: `testpilot@swiftvolt.com` / `SecurePassword123!`)*
- API Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
