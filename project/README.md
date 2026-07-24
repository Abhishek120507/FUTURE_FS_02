# MiniCRM — Lead Management

A production-quality Mini CRM for managing sales leads. Built with a modern glassmorphism UI, dark/light mode, and a complete lead management workflow.

## Features

- **Admin authentication** — sign in with a single admin account (hardcoded credentials)
- **Dashboard** — stat cards (total leads, won deals, high priority, active pipeline), pipeline distribution chart, and recent leads feed
- **Lead management (CRUD)** — create, read, update, and delete leads with a polished modal form
- **Search** — filter leads by name, email, company, or phone
- **Filter by status** — New, Contacted, Qualified, Proposal Sent, Won, Lost
- **Pagination** — paginated lead table (8 per page)
- **Responsive UI** — mobile-friendly sidebar, table, and forms
- **Dark / Light mode** — persisted to localStorage, follows system preference by default
- **Toast notifications** — success, error, info, and warning toasts
- **Form validation** — client-side validation for all lead fields and auth forms
- **Error handling** — visible error states for failed loads and API errors
- **Protected routes** — unauthenticated users are redirected to login

## Lead Fields

| Field | Type | Notes |
|-------|------|-------|
| Name | text | required |
| Email | text | validated format |
| Phone | text | validated format |
| Company | text | optional |
| Source | enum | Website, Referral, Cold Call, Email Campaign, Social Media, Event |
| Status | enum | New, Contacted, Qualified, Proposal Sent, Won, Lost |
| Priority | enum | Low, Medium, High |
| Notes | text | optional |
| Created At | timestamp | auto-set |

## Tech Stack

- **Frontend:** React + TypeScript + Vite, Tailwind CSS, lucide-react icons, react-router-dom
- **Backend / Data:** Supabase (PostgreSQL database, Row Level Security)
- **Auth:** Hardcoded single admin account (email + password)

## Getting Started

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and fill in your Supabase credentials (required for lead data storage):

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database

A `leads` table with owner-scoped Row Level Security is created automatically via the bundled migration. The table schema:

- `id` uuid primary key
- `name` text not null
- `email`, `phone`, `company`, `notes` text
- `source`, `status`, `priority` text (enum-like)
- `user_id` uuid (defaults to the authenticated user, FK to `auth.users`)
- `created_at` timestamptz

RLS policies ensure each authenticated user can only read, insert, update, and delete their own leads.

### Admin Credentials

- **Email:** `admin@minicrm.com`
- **Password:** `minicrm@2026`

### Run (development)

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### Build

```bash
npm run build
npm run typecheck
```

## Deployment

### Frontend → Render (Static Site)

1. Push the repo to GitHub
2. In [Render Dashboard](https://dashboard.render.com) → **New +** → **Static Site**
3. Connect your repository
4. Configure:

   | Field | Value |
   |---|---|
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

5. Add environment variables:

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

6. Click **Deploy**

### Frontend → Cloudflare Pages

1. Build command: `npm run build`
2. Output directory: `dist`
3. Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. SPA fallback: redirect all routes to `/index.html` (Cloudflare Pages handles this automatically for SPA presets)

### Backend → Render (reference, not required)

This build uses Supabase as the backend, so no separate backend deployment is required. The `.env.example` includes reference values (`MONGODB_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`) for teams that want to swap in a custom Node/Express/MongoDB backend following the original spec.

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── DashboardLayout.tsx
│   ├── LeadModal.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── Sidebar.tsx
│   └── StatCard.tsx
├── context/          # React context providers
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── ToastContext.tsx
├── hooks/
│   └── useLeads.ts    # Lead data + CRUD hook
├── lib/
│   ├── supabase.ts    # Supabase client
│   └── validation.ts  # Form validators
├── pages/
│   ├── DashboardPage.tsx
│   ├── LeadsPage.tsx
│   └── LoginPage.tsx
├── types/
│   └── lead.ts        # Lead types + enums
├── App.tsx
└── main.tsx
```

## Health Check

Supabase provides a managed health endpoint. For the frontend build status, the app surfaces load/error states directly in the UI.
