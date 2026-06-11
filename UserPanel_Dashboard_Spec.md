# User Panel — Dashboard Specification
### Project Build Prompt & Feature Reference

---

## Overview

Build a fully responsive, mobile-first **User Panel Dashboard** for a software project booking and tracking platform. The UI must feel **premium, warm, and modern** — using the **Warm Earthy Minimal** theme described below. Every section must work flawlessly on both **mobile (320px+)** and **desktop (1280px+)** screens, and support **light and dark mode** natively via CSS variables or Tailwind dark class.

---

## Theme — Warm Earthy Minimal (Updated)

| Token | Light Mode | Dark Mode |
|---|---|---|
| Background | `#FAF7F2` | `#141210` |
| Surface / Card | `#FFFFFF` | `#1E1A16` |
| Surface Secondary | `#F3EDE4` | `#262018` |
| Sidebar Background | `#2D2416` | `#1A1510` |
| Sidebar Accent | `#D97706` (Amber 600) | `#F59E0B` |
| Sidebar Icon Default | `#A8956A` | `#6B5A3E` |
| Primary Accent | `#D97706` | `#F59E0B` |
| Primary Accent Hover | `#B45309` | `#D97706` |
| Text Primary | `#1C1410` | `#F5F0E8` |
| Text Secondary | `#78716C` | `#A89880` |
| Text Muted | `#A8A29E` | `#6B5A3E` |
| Border | `#E7E0D4` | `#2E2418` |
| Success | `#15803D` | `#22C55E` |
| Warning | `#D97706` | `#F59E0B` |
| Danger | `#DC2626` | `#EF4444` |
| Info | `#0369A1` | `#38BDF8` |

**Typography:**
- Display / Headings: `DM Serif Display` or `Playfair Display` (Google Fonts)
- Body / UI: `DM Sans` or `Plus Jakarta Sans`
- Monospace (IDs, codes): `JetBrains Mono` or `IBM Plex Mono`

**Design Language:**
- Sidebar: Deep espresso brown `#2D2416` with amber active states — NOT pure black
- Cards: White with `1px` border `#E7E0D4`, `border-radius: 12px`, soft `box-shadow`
- Inputs: Rounded `8px`, warm border, amber focus ring
- Buttons: Solid amber primary, ghost secondary with warm border
- Badges: Soft colored pills (amber, green, red, blue) with matching text
- Stage progress: Horizontal stepper with filled amber circles for completed, outlined for pending
- Animations: Subtle fade-in on load, smooth transitions `200ms ease`
- No harsh blacks in sidebar — use deep warm browns only

---

## Layout Structure

### Desktop (≥ 1024px)
```
┌─────────┬──────────────────────────────────────┐
│         │  Top Bar (welcome + search + avatar)  │
│ Sidebar │──────────────────────────────────────│
│ (240px) │                                       │
│         │        Main Content Area              │
│         │                                       │
└─────────┴──────────────────────────────────────┘
```

### Mobile (< 1024px)
- Sidebar collapses to bottom navigation bar (5 icons)
- Top bar shows hamburger → slide-over drawer sidebar
- Cards stack to single column
- Bento grid collapses to 2-col then 1-col

---

## Sidebar Navigation

**Desktop:** Fixed left sidebar, 240px wide, deep brown background.
**Mobile:** Hidden by default. Hamburger in top bar opens a slide-over drawer from left. Bottom nav bar shows 5 icon shortcuts always visible.

### Sidebar Items (in order)
1. **Dashboard** — Home icon — default active
2. **Book Project** — Plus/Rocket icon
3. **Request Change** — Edit/Refresh icon
4. **Track Projects** — Map pin / Activity icon
5. **Billing & Invoice** — Credit card icon
6. **Contact Support** — Headphones / Chat icon

### Sidebar Details
- Logo / brand name at the top
- Each item: icon + label, amber left-border on active state, amber icon + amber text when active
- Bottom of sidebar: User avatar + name + Customer ID badge (`CID-XXXXX`) in amber pill
- Amber dot indicator for unread notifications on relevant items

---

## Page 1 — Main Dashboard

### Top Bar
- Left: Page title "Dashboard"
- Center: **Live Queue Banner** — horizontal scrolling strip showing queue position pill (e.g. `#7 of 18`) with amber progress bar. Visible only if user has active/queued projects.
- Right: Notification bell + Avatar

### Welcome Section
- Large warm heading: `Welcome, [Name]`
- Subtitle: Customer ID in monospace amber pill — `CID-00421`
- Estimated wait time if in queue: `~3 days to project start`

### Stats Row (4 cards, responsive grid)
| Card | Value | Color |
|---|---|---|
| Total Projects | count | Neutral |
| Completed | count | Green |
| In Progress | count | Amber |
| In Review | count | Blue |

Each stat card: muted label top, large number, small trend arrow optional.

### Live Queue Section
- Wide horizontal card
- Queue position indicator: large number left, progress bar center, estimated start date right
- If no active project: CTA button "Book Your First Project →"

### Live Activity Feed
- List of user's projects with status badges
- Each row: project name, current phase badge, budget estimate (if set by admin), timeline estimate (if set)
- Phases: `Review` · `Planning` · `Building` · `Testing` · `Final Checks`
- Real-time feel: show "Updated X mins ago" timestamp

### Estimated Budget & Timeline Block
- Only visible after admin sets values
- Card with: Project name, Budget set (₹XX,XXX), Timeline (X weeks), Payment status (25% paid / pending)

---

## Page 2 — Book Project (Multi-Step Form)

5-step wizard with step indicator at top (numbered stepper, amber for active/complete).

### Step 1 — Project Basics
- Field: **Project Title** (text input)
- Field: **Tagline / Motto** (text input, max 80 chars)
- Field: **Short Description** (textarea, max 300 chars)
- Validation: all required before next step

### Step 2 — Choose Tech Stack
Three category cards side by side (stacked on mobile):
- **Frontend** — select one language/framework (React, Vue, Angular, Next.js, HTML/CSS, JS etc.) — show logo + name
- **Backend** — select one (Java , Node.js, Django, FastAPI, Spring Boot etc.)
- **Database** — select one (MongoDB, PostgreSQL, MySQL, Firebase, etc.)

**AI Stack Validator:**
- On selection, call AI/backend to check stack compatibility
- If ≥ 80% compatible: green checkmark, allow proceed
- If 50–79% compatible: amber warning with suggestion alternatives shown
- If < 50%: red alert "This stack combination is not recommended", block next step, show alternatives
- Also show button: **"Help me choose a stack"** → opens a modal/assistant recommender

### Step 3 — Upload Requirements
- File upload zone: drag-and-drop + click to browse
- Allowed formats only: `.pdf`, `.png`, `.jpg`, `.jpeg`, `.txt`, `.md`
- Max file size: 10MB per file, up to 5 files
- Description label above uploader: _"Upload your project brief — include features list, workflow diagrams, UI references, color themes, and any wireframes."_
- Show uploaded file list with remove option

### Step 4 — Deployment & Deadline
- **Deployment Platform** dropdown: Vercel, Netlify, AWS, DigitalOcean, VPS, Other
- **User Deadline** — date picker (no past dates)
- **Priority Level** — optional: Normal / Urgent (Urgent may affect pricing)

### Step 5 — Review & Submit
- Summary card showing all selected values from steps 1–4
- Edit button per section to go back
- Checkbox: "I confirm this brief is accurate and complete"
- Submit button: **"Send Project Request →"** (amber, full-width on mobile)
- On success: toast notification + redirect to Track Projects page

---

## Page 3 — Request Change

### Sub-section A — Re-upload Requirements
- Visible only if admin has **rejected** the uploaded files
- Shows rejection reason from admin (if provided)
- File upload component (same spec as Step 3 above)
- Submit button: "Re-submit Files"

### Sub-section B — Feature Change Chat
- Simple chat UI thread
- User can type add-on or removal requests (e.g. "Add dark mode", "Remove the CMS module")
- Messages show timestamp + read receipt (when admin reads)
- Character limit per message: 500 chars
- This is NOT a general support chat — scope limited to current project's feature changes

### Sub-section C — Bargain / Price Negotiation
- Only visible after admin sets the initial budget estimate
- Shows current quoted price prominently
- Input field: "Your Offer (₹)" with brief reason textarea
- Submit button: "Send Offer →"
- Status badge showing: Pending / Accepted / Rejected
- One offer at a time — disable form while offer is pending

---

## Page 4 — Track Projects

### Project Selector
- If user has multiple projects: dropdown or tab row to switch between them

### Stage Progress Stepper
Horizontal stepper (vertical on mobile) with 5 stages:

```
① Review → ② Planning → ③ Building → ④ Testing & Debugging → ⑤ Final Checks
```

- Completed stages: filled amber circle with checkmark
- Current stage: filled amber circle with pulsing ring animation
- Upcoming stages: outlined circle, muted text
- Default state on new project: Stage 1 (Review) active

### Stage Details Card
Below stepper — expands to show:
- Stage name + description
- Admin notes (if any)
- Estimated completion for current stage (if admin set)
- Date entered current stage

---

## Page 5 — Billing & Invoice

### Payment Split Layout
Two large cards side by side (stacked mobile):

**Card 1 — 25% Advance**
- Amount: ₹XX,XXX (25% of total estimate)
- Status: Paid ✓ / Pending
- Required before project moves to Planning phase
- Pay Now button (Razorpay) if unpaid

**Card 2 — 75% Final**
- Amount: ₹XX,XXX (75% of total estimate)
- Status: Paid ✓ / Pending / Locked (locked until Final Checks stage)
- Pay Now button (Razorpay) if unlocked and unpaid

### Coupon / Discount
- Input field: Enter coupon code + Apply button
- Shows discount applied, new total, savings amount in green
- Error state for invalid/expired codes

### Important Rules
- Prices shown always reflect latest admin-set estimate (live sync)
- If admin changes price, both cards recalculate immediately
- Razorpay order must be created server-side with exact amount in paise
- Never trust client-side amount — always validate on backend before creating order
- After payment success: webhook updates DB, invoice generated, email sent

### Payment History Table
Columns: Date · Description · Amount · Status · Invoice
- Status pills: Paid (green) · Pending (amber) · Failed (red)
- Invoice column: Download PDF icon link

---

## Page 6 — Contact Support

Clean info card layout with three sections:

| Channel | Detail |
|---|---|
| Email | support@[yourdomain].com |
| WhatsApp | +91 XXXXX XXXXX (tap to open) |
| Response Time | Typically within 24 hours |

- WhatsApp button opens `https://wa.me/916352834093`
- Email button opens `mailto:` link
- Optional: Office hours note
- No live chat widget here — this is an info page only

---

## Email Templates (Trigger Reference)

All emails must be: HTML, richly designed, colored with brand amber + warm white, mobile-responsive, easy to read, with clear CTA buttons.

| Trigger | Subject Line | Key Content |
|---|---|---|
| Account Created | Welcome to [Platform]! 🎉 | Name, CID, login link, what to do next |
| OTP / Verification | Your OTP is XXXXXX | OTP code large and prominent, expiry time, security note |
| Forgot Password | Reset Your Password | Reset link button, expiry (15 min), ignore note |
| Payment Invoice | Invoice #XXXX — Payment Confirmed | Amount, date, project name, 25/75 split label, download invoice link |
| Stage Update | Your Project Moved to [Stage] | Project name, new stage, what happens next, timeline if set |
| Budget & Timeline Set | Your Project Estimate is Ready | Budget (₹), timeline, pay 25% CTA button, deadline |
| File Rejected | Action Required — Re-upload Your Brief | Rejection reason, re-upload CTA, support link |
| Price Offer Update | Your Price Offer was [Accepted/Rejected] | Offer amount, decision, next steps |

---

## Key Technical Rules (Critical — No Errors)

### Payments (Razorpay)
- Order creation: **server-side only**, amount in **paise** (₹1 = 100 paise)
- Never create order from frontend — always POST to backend → backend calls Razorpay API
- `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature` — verify signature server-side before marking paid
- Handle webhook for `payment.captured` and `payment.failed`
- Store: order ID, payment ID, amount, status, timestamp per transaction
- 25% unlock: triggered when admin approves project
- 75% unlock: triggered when project reaches Final Checks stage

### Price Sync
- Budget is set/updated by admin only
- Any admin price change must immediately reflect in:
  - Billing page (both cards recalculate)
  - Dashboard estimation block
  - Email notification sent to user
- Frontend always fetches live price from API — no hardcoding

### Queue System
- Queue position = count of projects ahead in `Planning` or `Building` stage
- Recalculates on every project status change
- Live queue shown in top bar and dashboard — poll every 30s or use WebSocket

### Authentication
- JWT or session-based auth with refresh tokens
- All API routes protected — user can only access their own projects
- Customer ID (`CID-XXXXX`) generated on registration, unique, immutable
- OTP for email verification on signup and password reset

### File Uploads
- Validate file type server-side (not just extension — check MIME type)
- Allowed: `application/pdf`, `image/png`, `image/jpeg`, `text/plain`, `text/markdown`
- Max 10MB per file, max 5 files per submission
- Store in cloud storage (S3/Cloudinary/R2), not local disk
- Virus scan recommended before storing

### Form Validations
- All multi-step form steps validate before allowing next
- Stack compatibility check is async — show loader, block next button during check
- Date picker disables past dates
- Coupon validation is server-side — client shows result only

---

## Mobile Responsiveness Rules

- Sidebar → bottom navigation bar (5 primary items) on mobile
- All grids: `grid-cols-1` on mobile, `grid-cols-2` on tablet, `grid-cols-4` on desktop
- Stepper: horizontal scroll on small screens or switch to vertical stepper
- Tables: horizontal scroll wrapper on mobile
- Modals: full-screen bottom sheet on mobile
- Tap targets: minimum `44x44px` for all interactive elements
- Font sizes: minimum `14px` body, `16px` inputs (prevents iOS zoom)
- Avoid hover-only interactions — use tap/focus equivalents

---

## Accessibility

- All form inputs have associated `<label>`
- Color is never the only indicator — always pair with icon or text
- Focus rings visible on all interactive elements (amber `outline`)
- ARIA labels on icon-only buttons
- Status badges use both color + text
- Images have `alt` text

---

## Component Checklist

- [ ] Sidebar with active state + mobile drawer + bottom nav
- [ ] Top bar with live queue banner + notifications + avatar
- [ ] Dashboard stats grid (4 cards)
- [ ] Live queue bar with position + progress
- [ ] Live activity feed with phase badges
- [ ] Budget & timeline estimate card
- [ ] 5-step booking form with stepper + validation
- [ ] AI stack validator (frontend call + result display)
- [ ] File upload zone (drag-drop, type/size validation)
- [ ] Project stage stepper (5 stages, animated)
- [ ] Billing split cards (25/75) + Razorpay integration
- [ ] Coupon input + validation
- [ ] Payment history table
- [ ] Request change — file reupload
- [ ] Request change — feature chat thread
- [ ] Price bargain form with status tracking
- [ ] Contact support info page
- [ ] Toast/snackbar notification system
- [ ] Full dark mode support
- [ ] Mobile responsiveness across all pages

---

*Spec version 1.0 — Theme: Warm Earthy Minimal — Last updated: June 2026*
