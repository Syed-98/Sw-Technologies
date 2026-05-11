# SW Technologies - Full Stack Submission

This project extends the original Round 1 frontend and integrates a complete backend with authentication, admin APIs, newsletter, contact submissions, and quote requests.

## Tech Stack
- Frontend: HTML, CSS, Vanilla JS (same Round 1 website)
- Backend: Node.js, Express
- Database: MongoDB Atlas (Mongoose)
- Auth: JWT (7 days) + bcrypt password hashing

## Collections Implemented
- `Users`: id, name, email, password (hashed), role, createdAt
- `Contacts`: id, name, email, phone, subject, message, createdAt
- `Newsletter`: id, email, subscribedAt
- `Quotes`: id, name, email, phone, serviceRequired, budget, message, createdAt

## API Endpoints
- `POST /api/contact`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected)
- `GET /api/admin/contacts` (admin)
- `DELETE /api/admin/contacts/:id` (admin)
- `GET /api/admin/users` (admin)
- `GET /api/admin/quotes` (admin)
- `POST /api/newsletter/subscribe`
- `POST /api/quote`

## Local Setup
1. Install dependencies:
   - `npm install`
2. Create `.env` from `.env.example` and fill:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (frontend domain for CORS)
3. Start backend:
   - `npm run dev`
4. Open frontend files with Live Server (or deploy static frontend).

## Seed Admin
Run:
- `npm run seed:admin`

Default admin credentials:
- Email: `admin@swtech.com`
- Password: `Admin@12345`

You can override via `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`).

## Frontend Integration Notes
- Contact page form now sends data to `/api/contact`.
- Homepage "Get a Free Quote" opens a working modal and submits to `/api/quote`.
- Footer newsletter form submits to `/api/newsletter/subscribe` on all pages.
- Added `login.html`, `register.html`, `profile.html`, `admin.html`.
- Navbar shows logged-in user name and logout after login.

## Deployment

### Backend (Render/Railway)
- Deploy this repo as a Node service.
- Start command: `npm start`
- Add env vars from `.env.example`.
- Set `FRONTEND_URL` to deployed frontend URL.

### Frontend (Netlify/Vercel/GitHub Pages)
- Deploy static files from project root.
- Ensure frontend calls deployed backend URL:
  - set `window.SW_API_BASE_URL` globally, or
  - set local storage key `SW_API_BASE_URL`.

## Live API Testing Checklist
- `POST /api/contact`
- `POST /api/newsletter/subscribe` (duplicate returns `You are already subscribed`)
- `POST /api/quote`
- Register, login, profile token flow
- Admin login and all admin APIs
