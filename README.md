# VyparX — Digital Growth Platform for Local & Small Businesses

> **"GROW LOCAL. GO FURTHER."**  
> *"Your business is local. Your market doesn't have to be."*

VyparX is a digital growth operating system built to help local and small businesses transition from neighborhood workshops into discoverable, trusted, pan-India, and global brands.

---

## 🧭 The Product Lifecycle

```
Visitor → New Business → Business Profile → Digital Audit (0-100) → Growth Roadmap → Proposal → Active Client → Projects → Tasks → Deliverables → Approvals → Reports → Scaled Growth
```

```
LOCAL → DIGITAL FOUNDATION → SEARCH DISCOVERY → CUSTOMER TRUST → NATIONAL REACH → GLOBAL SCALE
```

---

## 🚀 Tech Stack & Architecture

- **Core Application**: [Next.js 14 (App Router)](https://nextjs.org/) + TypeScript + React 18
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) + Lucide Icons + Responsive Design System
- **Database & ORM**: PostgreSQL (Supabase compatible) + [Prisma ORM](https://www.prisma.io/)
- **Local Dev Database**: SQLite (`file:./dev.db`) for immediate zero-dependency local testing with identical schema mapping
- **Authentication & RBAC**: JWT Sessions (`jose` + HTTP-only cookies) + Server-Side Role-Based Access Control (`ADMIN`, `TEAM_MEMBER`, `CLIENT`) & Customer State Lifecycle (`PROSPECT`, `ONBOARDING`, `AUDIT_REQUESTED`, `AUDIT_REVIEWED`, `PROPOSAL_SENT`, `ACTIVE_CLIENT`, `COMPLETED`)
- **Validation**: [Zod](https://zod.dev/) schemas for all API mutations & server forms
- **Transactional Email**: [Resend](https://resend.com/) with graceful development fallback

---

## 🔑 Demo Accounts & Credentials

The seed database includes ready-to-test accounts across all roles:

| Role | Account Email | Password | Default Landing | Context |
|---|---|---|---|---|
| **Admin** | `admin@demo.vyparx.local` | `password123` | `/admin/dashboard` | Full platform operations control |
| **Team Member** | `team@demo.vyparx.local` | `password123` | `/admin/dashboard` | Growth specialist & delivery lead |
| **Active Client** | `client@demo.vyparx.local` | `password123` | `/client/dashboard` | *Artisan Heritage Silks* (Converted Client with active project, deliverables & reports) |
| **Prospect** | `business@demo.vyparx.local` | `password123` | `/business/dashboard` | *Sharma Handicrafts* (Audit Score 64/100, 6-stage roadmap, received proposal) |

*(Quick-fill buttons are also available directly on the login pages for one-click testing.)*

---

## 💻 Quickstart (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Local Database & Seed
```bash
# Push schema to local dev database (SQLite)
npm run prisma:push

# Seed development demo data
npm run db:seed
```

### 3. Run Automated Workflow Test Suite
```bash
node scripts/test-workflows.js
```

### 4. Start Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Application Routes & Roles

### 1. Public Marketing Website
- `/` — Homepage (Hero, Problem, Solution, 6-Stage Journey, Services, Industries, How It Works, Sample Case Studies, Pricing, FAQ, Final CTA)
- `/services` — Modular growth services breakdown
- `/industries` — Industry specific challenges & playbooks
- `/how-it-works` — 5-step client growth process
- `/case-studies` — Transparently marked demo transformation journeys
- `/about` — Mission & core values
- `/contact` — Contact form & central contact phone/WhatsApp
- `/get-started` — Decision gate: *"Yes, I'm a customer"* (`/login`) vs *"No, I'm new"* (`/signup`)

### 2. Authentication & Onboarding
- `/login` — Client & Prospect login with demo quick-fills
- `/signup` — New user registration
- `/forgot-password` — Password reset flow
- `/admin/login` — Dedicated internal team login portal
- `/business/onboarding` — Multi-step business profile, category, goals, and discovery channels questionnaire

### 3. Business Growth Hub (Prospect Portal)
- `/business/dashboard` — Growth Hub showing Digital Readiness Score, 6-stage roadmap progress, and action CTAs
- `/business/audit` — Interactive Digital Readiness Audit with real-time scoring engine (0–100), strengths/weaknesses, and prioritized recommendations
- `/business/roadmap` — Phased 6-stage roadmap with service tags
- `/business/proposals` — Proposal viewer with itemized quote and **One-Click Proposal Acceptance** (which converts the prospect into an `ACTIVE_CLIENT` and creates their initial project!)
- `/business/profile` — Business details manager

### 4. Client Portal (Active Customers)
- `/client/dashboard` — Live client dashboard showing project progress %, pending approvals count, task completion, and next action prompts
- `/client/projects` — Projects list with phased milestone tracker
- `/client/tasks` — Client-visible task list (internal notes hidden)
- `/client/deliverables` — Deliverables review gallery with **Approve** and **Request Revision** (with mandatory feedback comment) workflow
- `/client/reports` — Monthly growth reports with key metrics and recommendations
- `/client/support` — Support ticket creator, ticket response tracker, and direct contact helpline
- `/client/profile` — Client account & business settings

### 5. Admin & Operations Portal (Internal Team)
- `/admin/dashboard` — Real database metrics (Total Leads, Active Clients, Pending Audits, Proposals Sent, Active Projects, Open Support Tickets)
- `/admin/leads` — Searchable lead pipeline table with stage changer and internal notes editor
- `/admin/audits` — Submitted audits list, category score inspector, and review marker
- `/admin/proposals` — Interactive proposal generator with dynamic line items and quote sender
- `/admin/clients` — Active clients directory with growth stage tracker
- `/admin/projects` — Project manager, milestone creator, task assigner
- `/admin/tasks` — Global task board across all client accounts
- `/admin/deliverables` — Deliverables manager for asset uploads and client feedback tracking
- `/admin/reports` — Monthly report publisher
- `/admin/support` — Support ticket inbox with admin reply editor
- `/admin/team` — Team directory and permissions
- `/admin/activity-logs` — Immutable audit trail of all platform events
- `/admin/settings` — Central configuration and future integrations checklist

---

## 🛡️ Security & Authorization (RBAC)

1. **Server-Side Enforcement**: All routes and route handlers verify authentication and role server-side via `lib/auth/roles.ts` (`requireAuth`, `requireAdmin`, `requireClient`, `requireProspect`).
2. **Business Ownership Isolation**: A client can never access another client's project, deliverables, or reports by changing the ID in the URL.
3. **Data Segregation**: Internal admin tasks and notes are filtered out (`isClientVisible: true`) before returning to the client.

---

## 🌐 Production Deployment (Render + Supabase)

### 1. Supabase PostgreSQL Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Copy the **Connection String (Transaction pooler)** to `DATABASE_URL` and **Direct Connection** to `DIRECT_URL`.
3. Push schema to Supabase:
   ```bash
   npm run prisma:push:postgres
   ```

### 2. Render Deployment
1. Create a **Web Service** on [Render](https://render.com) connected to your GitHub repository.
2. Set Environment Variables in Render:
   - `DATABASE_URL`: Your Supabase connection string
   - `DIRECT_URL`: Your Supabase direct connection string
   - `AUTH_SECRET`: A secure 32+ character random string
   - `NEXT_PUBLIC_APP_URL`: Your production domain (`https://vyparx.com` or Render URL)
   - `RESEND_API_KEY`: Your Resend transactional email key
   - `NEXT_PUBLIC_SUPPORT_PHONE`: Your customer support phone number
   - `NEXT_PUBLIC_SUPPORT_EMAIL`: Your support email
3. **Build Command**:
   ```bash
   npm run build:postgres
   ```
4. **Start Command**:
   ```bash
   npm run start
   ```

---

## 🔮 Future Architecture Points (Phase 2 & AI)

- **AI Growth Engine**: Extensible prompt abstractions for automated AI business audits, localized SEO keywords, and social media calendar generation using Google Gemini.
- **Direct Integrations**: Service adapters designed for Google Business Profile API, Instagram Graph API, WhatsApp Cloud API, and Razorpay/Stripe payments.
