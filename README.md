# SportSlot API

## Overview
The **SportsLot API** is a backend system built with **Node.js, Express, and MongoDB** to facilitate court booking for users and administrators. It supports user authentication, booking management, and payment processing via Stripe.

## Features
- **User Authentication**: Secure login and registration using Passport.js (Google and email-password authentication).
- **Booking Management**: Users can view available slots, book courts, and cancel bookings.
- **Admin Dashboard**: Manage bookings, process refunds, and monitor system activity.
- **Payment Integration**: Stripe integration for secure transactions.
- **Email Notifications**: Booking confirmation emails via Gmail SMTP.
- **Calendar View**: Displays available slots and booked times.
- **Role-Based Access Control**: Restricts admin routes and secures user-specific data.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: Passport.js (Google, Email-password)
- **Payment Processing**: Stripe
- **Email Service**: Gmail SMTP
- **Deployment**: Vercel

## Installation
1. **Clone the repository**
   ```sh
   git clone https://github.com/mahmudulhasan5050/sports_api.git
   cd sports_api
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Create a `.env` file** and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   GMAIL_USER=your_email@example.com
   GMAIL_PASS=your_email_password
   GOOGLE_CLIENT_ID=google_client_ID
   GOOGLE_CLIENT_SECRET=google_client_secret
   ```
4. **Start the server**
   ```sh
   npm start
   ```

## API Endpoints
### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login
- `GET /api/v1/auth/confirm/:token` - confirmation link to email
- `POST /api/v1/auth/forgot-password` - forgot password link to email
- `GET /api/v1/auth/google` - Google authentication
- `GET /api/v1/auth/google/redirect` - Google authentication redirect

### Booking Management for Customers
- `POST /api/v1/booking-client/available-time` - Get available time slots on selected date
- `POST /api/v1/booking-client/available-court` - Get available courts on selected date and time
- `POST /api/v1/booking-client/available-duration` - Get available duration (60 or 90 minutes) on selected date, time and court
- `GET /api/v1/booking-client/booking-for-user` - Get booking information for individual customer
- `POST /api/v1/booking-client/:bookingId` - Cancel booking by customer

### Booking Management for Finalize Customer's Booking
- `POST /api/v1/booking-client-final/:facilityId` - Booking creation

### Checkout for Customers
- `POST /api/v1/checkout` - Checkout request to Stripe
- `POST /api/v1/checkout/verify-payment` - Checkout verification to Stripe

### Admin Booking Management Routes (Admin only)
- `GET /api/v1/booking/limit-30/:page` - Get 30 bookings which helps for pagination
- `GET /api/v1/booking/dashboard` - Booking count present month, pevious month, total users and cancel and refund count
- `GET /api/v1/booking/:bookingId` - Single booking information
- `POST /api/v1/booking/update/:bookingId` - Single booking's payment update
- `GET /api/v1/booking//booking-by-date/:date` - Bookings by date to display today's all bookings
- `GET /api/v1/booking/update/:bookingId` - Single booking's payment update
- `POST /api/v1/booking` - Create booking by admin

- `GET /api/v1/facilityunit` - Get all facility units
- `POST /api/v1/facilityunit` - Create unit (Example: Tennis or Badminton)
- `POST /api/v1/facilityunit/:facilityUnitId` - Update facility unit information
- `DELETE /api/v1/facilityunit/:facilityUnitId` - Delete facility unit

- `GET /api/v1/facility` - Get all facility details (One facility can have several courts)
- `GET /api/v1/facility/:facilityId` - Get a facility information by Id
- `POST /api/v1/facility` - Create facility details ( Example: Tennis 1 or Tennis 2)
- `POST /api/v1/facility/:facilityId` - Update facility information

- `GET /api/v1/openinghour` - Get all opening hours information
- `GET /api/v1/openinghour/:openinghourId` - Get single day's information by Id
- `POST /api/v1/openinghour` - Create opening hour details
- `POST /api/v1/openinghour/:openingHourId` - Update opening hour information










## Deployment
The API is deployed on **Vercel** with **MongoDB Atlas** for database hosting.


---
🚀 **Live Demo**: [sportslot.fi](https://sportslot.fi/)  
📧 **Contact**: mahmudul.rony@outlook.com