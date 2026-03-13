# CalCity Platform Spec — White-Label City Community Platform

> CalCity.info is the first instance. This spec defines the reusable platform that will power
> rosamond.info, and any future city site. Every decision here should be city-agnostic.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Database Schema](#2-database-schema)
3. [Phase 1: Database Foundation](#3-phase-1-database-foundation)
4. [Phase 2: Stripe Billing Pipeline](#4-phase-2-stripe-billing-pipeline)
5. [Phase 3: Subscription-Gated Features](#5-phase-3-subscription-gated-features)
6. [Phase 4: Business Owner Dashboard](#6-phase-4-business-owner-dashboard)
7. [Phase 5: Admin Panel](#7-phase-5-admin-panel)
8. [Phase 6: White-Label Config](#8-phase-6-white-label-config)
9. [Environment Variables](#9-environment-variables)
10. [Deployment Checklist](#10-deployment-checklist)

---

## 1. Architecture Overview

### Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS 3 | SPA with M3 design tokens |
| **Styling** | Material Design 3 CSS custom properties | Theme via seed color swap |
| **Hosting** | Cloudflare Pages | Static + edge functions |
| **API** | Cloudflare Pages Functions (`functions/api/`) | Serverless backend |
| **Database** | Supabase (PostgreSQL) | Auth, data, storage, realtime |
| **Auth** | Supabase Auth | Email/password, OAuth (Google, Apple) |
| **Payments** | Stripe Billing | Subscriptions, checkout, webhooks |
| **File Storage** | Supabase Storage | Business photos, event images |
| **AI Chat** | Venice.ai API | City-specific chatbot |
| **Weather** | Open-Meteo or wttr.in | Local weather widget |
| **Search** | Supabase full-text search | Business & event search |

### Data Flow
```
User → Cloudflare Pages (static) → Supabase (auth + data)
                                  → CF Pages Functions → Stripe API
                                                       → Supabase (write)
                                                       → Venice AI
Stripe Webhooks → CF Pages Function → Supabase (update subscription)
```

### File Structure
```
calcity/
├── functions/api/           # Cloudflare Pages Functions (serverless)
│   ├── contact.ts           # Contact form → email (Resend)
│   ├── chat.ts              # AI chat proxy (Venice)
│   ├── stripe/
│   │   ├── create-checkout-session.ts
│   │   ├── webhook.ts
│   │   ├── cancel-subscription.ts
│   │   └── customer-portal.ts
│   └── businesses/
│       ├── submit.ts
│       └── upload-photo.ts
├── src/
│   ├── api/                 # Client-side API call wrappers
│   ├── components/          # Reusable UI components
│   ├── context/             # React contexts (Auth, Business, Event, Payment)
│   ├── hooks/               # Custom hooks (useBusinessPermissions, etc.)
│   ├── lib/                 # Supabase client, Stripe loader
│   ├── pages/               # Route pages
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Helpers
│   └── config/              # Site-specific config (city name, colors, etc.)
├── supabase/                # SQL migrations
├── public/                  # Static assets
├── .env                     # Local env (gitignored)
└── PLATFORM-SPEC.md         # This file
```

---

## 2. Database Schema

### 2.1 `profiles` (exists)
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'business_owner', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 2.2 `businesses`
```sql
CREATE TABLE public.businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  
  -- Core info (all tiers)
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,  -- URL-friendly name: "desert-oasis-cafe"
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'California City',
  state TEXT NOT NULL DEFAULT 'CA',
  zip TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  hours JSONB NOT NULL DEFAULT '{}',  -- {"Monday": "9-5", ...}
  image TEXT,  -- Primary photo URL (Supabase Storage)
  
  -- Premium+ features
  description TEXT,              -- Premium+
  website TEXT,                  -- Premium+
  social_media JSONB DEFAULT '{}',  -- Premium+ {"facebook": "...", "instagram": "..."}
  gallery JSONB DEFAULT '[]',    -- Premium+ [{url, alt}] up to 10
  amenities TEXT[] DEFAULT '{}', -- Premium+
  services TEXT[],               -- Premium+
  
  -- Platform-managed
  subscription_tier TEXT DEFAULT 'basic' CHECK (tier IN ('basic', 'premium', 'spotlight')),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  is_featured BOOLEAN DEFAULT false,     -- Premium+: appears in featured section
  is_spotlight BOOLEAN DEFAULT false,    -- Spotlight: homepage rotation
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,         -- Analytics
  search_impressions INTEGER DEFAULT 0, -- Analytics
  click_count INTEGER DEFAULT 0,        -- Analytics
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_tier ON public.businesses(subscription_tier);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);
CREATE INDEX idx_businesses_featured ON public.businesses(is_featured) WHERE is_featured = true;
CREATE INDEX idx_businesses_spotlight ON public.businesses(is_spotlight) WHERE is_spotlight = true;

-- Full-text search
ALTER TABLE public.businesses ADD COLUMN fts tsvector 
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;
CREATE INDEX idx_businesses_fts ON public.businesses USING GIN(fts);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_updated_at 
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2.3 `events`
```sql
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.profiles(id) NOT NULL,
  business_id UUID REFERENCES public.businesses(id),  -- Optional: linked business
  
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  date DATE NOT NULL,
  end_date DATE,                  -- Multi-day events
  time TEXT NOT NULL,
  end_time TEXT,
  
  location TEXT NOT NULL,
  address TEXT,
  
  image TEXT,                     -- Supabase Storage URL
  ticket_url TEXT,
  price TEXT,                     -- "Free", "$10", "$10-$25"
  
  -- Promotion
  is_promoted BOOLEAN DEFAULT false,  -- Spotlight business perk
  is_featured BOOLEAN DEFAULT false,  -- Admin pick
  
  -- Contact
  organizer_name TEXT NOT NULL,
  organizer_email TEXT NOT NULL,
  organizer_phone TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_business ON public.events(business_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_promoted ON public.events(is_promoted) WHERE is_promoted = true;

-- Full-text search
ALTER TABLE public.events ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;
CREATE INDEX idx_events_fts ON public.events USING GIN(fts);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2.4 `subscriptions`
```sql
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'premium', 'spotlight')),
  status TEXT NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'trialing')),
  
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_business ON public.subscriptions(business_id);
CREATE INDEX idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2.5 `customers` (Stripe ↔ Supabase mapping)
```sql
CREATE TABLE public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) UNIQUE NOT NULL,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_customers_user ON public.customers(user_id);
CREATE INDEX idx_customers_stripe ON public.customers(stripe_customer_id);
```

### 2.6 `analytics_events` (Spotlight tier)
```sql
CREATE TABLE public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'search_impression', 'click', 'phone_click', 'website_click', 'directions_click')),
  referrer TEXT,        -- Where they came from
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_analytics_business ON public.analytics_events(business_id);
CREATE INDEX idx_analytics_created ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_type ON public.analytics_events(event_type);

-- Partitioned by month for performance (optional, for scale)
```

### 2.7 Row Level Security (RLS)

```sql
-- Businesses: public read, owner write
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active businesses"
  ON public.businesses FOR SELECT
  USING (status = 'active');

CREATE POLICY "Owners can view own businesses"
  ON public.businesses FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own businesses"
  ON public.businesses FOR UPDATE
  USING (owner_id = auth.uid());

-- Events: public read approved, organizer write
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved events"
  ON public.events FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Organizers can view own events"
  ON public.events FOR SELECT
  USING (organizer_id = auth.uid());

CREATE POLICY "Authenticated can insert events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND organizer_id = auth.uid());

CREATE POLICY "Organizers can update own events"
  ON public.events FOR UPDATE
  USING (organizer_id = auth.uid());

-- Subscriptions: owner read only (writes via server/webhook)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- Customers: owner read only
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customer record"
  ON public.customers FOR SELECT
  USING (user_id = auth.uid());

-- Analytics: business owner read only
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view own analytics"
  ON public.analytics_events FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

-- Profiles: add admin policies
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 2.8 Supabase Storage Buckets

```sql
-- Business photos bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('business-photos', 'business-photos', true);

-- Storage policies
CREATE POLICY "Public can view business photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-photos');

CREATE POLICY "Business owners can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business-photos' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Business owners can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'business-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Event images bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

CREATE POLICY "Public can view event images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated can upload event images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images' AND
    auth.uid() IS NOT NULL
  );
```

---

## 3. Phase 1: Database Foundation

**Goal:** Replace all hardcoded data with Supabase. No feature changes — same UI, real database.

### Tasks

#### 1.1 Run SQL Migrations
- [ ] Update `profiles` table: add `role` column
- [ ] Create `businesses` table with all columns, indexes, FTS
- [ ] Create `events` table with all columns, indexes, FTS
- [ ] Create `subscriptions` table
- [ ] Create `customers` table
- [ ] Create `analytics_events` table
- [ ] Apply all RLS policies
- [ ] Create storage buckets + policies
- [ ] Create `update_updated_at()` trigger function

#### 1.2 Seed Data
- [ ] Migrate hardcoded businesses from `BusinessContext.tsx` → Supabase `businesses` table
- [ ] Migrate hardcoded events from `EventContext.tsx` → Supabase `events` table
- [ ] Set all seeded records to `status = 'active'` / `status = 'approved'`

#### 1.3 Update Contexts
- [ ] **BusinessContext.tsx** — Replace hardcoded array with `supabase.from('businesses').select('*').eq('status', 'active')`
- [ ] **EventContext.tsx** — Replace hardcoded array with `supabase.from('events').select('*').eq('status', 'approved')`
- [ ] **BusinessDetails.tsx** — Fetch single business by slug/id from Supabase
- [ ] **EventDetails.tsx** — Fetch single event by slug/id from Supabase

#### 1.4 Update API Wrappers
- [ ] `src/api/businesses.ts` — Replace mock `submitBusiness()` with real Supabase insert
- [ ] `src/api/events.ts` — Replace mock `submitEvent()` with real Supabase insert
- [ ] Add slug generation utility (`slugify(name)` with collision detection)

#### 1.5 Update Types
- [ ] `src/types/business.ts` — Match Supabase schema (UUID id, owner_id, slug, status, tier, etc.)
- [ ] `src/types/event.ts` — Match Supabase schema (UUID id, organizer_id, slug, status, etc.)
- [ ] `src/types/payment.ts` — Update tier names (`FREE` → `BASIC`, `ENTERPRISE` → `SPOTLIGHT`)

#### 1.6 Validation
- [ ] All existing pages render with Supabase data
- [ ] Business listing page shows businesses from DB
- [ ] Event listing page shows events from DB
- [ ] Business detail page works
- [ ] Event detail page works
- [ ] Business submission form writes to DB
- [ ] Event submission form writes to DB
- [ ] Search works (full-text)
- [ ] No hardcoded business/event data remains

**Files touched:** ~15
**Agent sessions:** 2-3
**Dependencies:** Supabase project must exist with tables created

---

## 4. Phase 2: Stripe Billing Pipeline

**Goal:** Users can subscribe, pay, and their business tier updates automatically.

### Stripe Flow
```
User clicks "Subscribe" on Pricing page
  → Frontend calls CF Function: POST /api/stripe/create-checkout-session
    → Function creates Stripe Checkout Session with price_id + metadata (business_id, user_id)
    → Returns session URL
  → Frontend redirects to Stripe Checkout
  
User completes payment on Stripe
  → Stripe fires webhook: checkout.session.completed
    → CF Function: POST /api/stripe/webhook
      → Verify webhook signature (STRIPE_WEBHOOK_SECRET)
      → Extract subscription_id, customer_id, price_id, metadata
      → Upsert into Supabase: customers table (user → stripe customer mapping)
      → Insert into Supabase: subscriptions table
      → Update Supabase: businesses table → set subscription_tier, is_featured, is_spotlight
  → User lands on /payment/success

Subscription renews monthly
  → Stripe fires: invoice.payment_succeeded → no action needed (sub stays active)
  → Stripe fires: invoice.payment_failed → webhook updates subscription status to 'past_due'
  
User cancels
  → Frontend calls CF Function: POST /api/stripe/cancel-subscription
    → Stripe sets cancel_at_period_end = true
    → Supabase: update subscription cancel_at_period_end
  → At period end: Stripe fires customer.subscription.deleted
    → Webhook: update subscription status, downgrade business tier to null, remove featured/spotlight
```

### Tasks

#### 2.1 Cloudflare Pages Functions
- [ ] **`functions/api/stripe/create-checkout-session.ts`**
  - Accept: `{ priceId, businessId }` + auth token
  - Validate user owns the business
  - Get or create Stripe Customer (check `customers` table first)
  - Create Checkout Session with `mode: 'subscription'`
  - Pass `metadata: { businessId, userId, tier }` on the session
  - Set `success_url` and `cancel_url`
  - Return `{ url: session.url }`

- [ ] **`functions/api/stripe/webhook.ts`**
  - Verify `Stripe-Signature` header with `STRIPE_WEBHOOK_SECRET`
  - Handle events:
    - `checkout.session.completed` → create subscription + customer records, update business tier
    - `customer.subscription.updated` → sync tier/status changes
    - `customer.subscription.deleted` → downgrade business, update subscription status
    - `invoice.payment_failed` → mark subscription past_due
  - Return 200 immediately (async processing)

- [ ] **`functions/api/stripe/cancel-subscription.ts`**
  - Accept: `{ subscriptionId }` + auth token
  - Verify user owns the subscription
  - Call Stripe: `subscriptions.update(id, { cancel_at_period_end: true })`
  - Update Supabase subscription record

- [ ] **`functions/api/stripe/customer-portal.ts`**
  - Accept: auth token
  - Look up Stripe Customer ID from `customers` table
  - Create Stripe Billing Portal session
  - Return `{ url: portalSession.url }`

#### 2.2 Frontend Updates
- [ ] **Pricing.tsx** — `handleSubscribe()` calls real CF Function, redirects to Stripe Checkout URL
- [ ] **PaymentContext.tsx** — Wire `createCheckoutSession` to CF Function, fetch real subscription from Supabase
- [ ] **Payment.tsx** — Show current subscription, link to Stripe Customer Portal for billing management
- [ ] **SubscriptionPlans.tsx** — Show current tier, upgrade/downgrade options

#### 2.3 Environment Variables (Cloudflare Pages Dashboard)
- [ ] `STRIPE_SECRET_KEY` (encrypted)
- [ ] `STRIPE_WEBHOOK_SECRET` (encrypted)
- [ ] `STRIPE_BASIC_PRICE_ID`
- [ ] `STRIPE_PREMIUM_PRICE_ID`
- [ ] `STRIPE_SPOTLIGHT_PRICE_ID`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (encrypted — for server-side writes bypassing RLS)

#### 2.4 Stripe Dashboard Setup
- [ ] Create Webhook endpoint: `https://calcity.info/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`
- [ ] Enable Customer Portal (Settings → Billing → Customer Portal)
  - Allow: update payment method, cancel subscription, view invoices

#### 2.5 Validation
- [ ] Full checkout flow works in Stripe test mode
- [ ] Webhook correctly creates subscription + updates business tier
- [ ] Cancellation flow works
- [ ] Customer portal accessible
- [ ] Past-due handling works (use Stripe test clocks)

**Files touched:** ~10 (4 new CF Functions, ~6 frontend updates)
**Agent sessions:** 2-3
**Dependencies:** Phase 1 complete, Stripe products created

---

## 5. Phase 3: Subscription-Gated Features

**Goal:** Features are visible/hidden based on the business's subscription tier.

### Feature Matrix

| Feature | Basic ($9.99) | Premium ($24.99) | Spotlight ($49.99) |
|---------|:---:|:---:|:---:|
| Name, address, phone, hours | ✅ | ✅ | ✅ |
| Category listing | ✅ | ✅ | ✅ |
| One photo | ✅ | ✅ | ✅ |
| Appears in search results | ✅ | ✅ | ✅ |
| Business description | ❌ | ✅ | ✅ |
| Website link | ❌ | ✅ | ✅ |
| Photo gallery (up to 10) | ❌ | ✅ | ✅ |
| Social media links | ❌ | ✅ | ✅ |
| Services/amenities list | ❌ | ✅ | ✅ |
| "Premium" badge | ❌ | ✅ | ✅ |
| Featured in search | ❌ | ✅ | ✅ |
| Top of search results | ❌ | ❌ | ✅ |
| Homepage spotlight rotation | ❌ | ❌ | ✅ |
| Event promotion (1/month) | ❌ | ❌ | ✅ |
| Analytics dashboard | ❌ | ❌ | ✅ |

### Tasks

#### 3.1 Permission Hook
- [ ] Create `src/hooks/useBusinessPermissions.ts`
  ```typescript
  function useBusinessPermissions(tier: 'basic' | 'premium' | 'spotlight') {
    return {
      canShowDescription: tier !== 'basic',
      canShowWebsite: tier !== 'basic',
      canShowGallery: tier !== 'basic',
      canShowSocial: tier !== 'basic',
      canShowAmenities: tier !== 'basic',
      maxPhotos: tier === 'basic' ? 1 : tier === 'premium' ? 10 : 30,
      hasBadge: tier !== 'basic',
      badgeText: tier === 'spotlight' ? 'Spotlight' : 'Premium',
      isFeatured: tier !== 'basic',
      isSpotlight: tier === 'spotlight',
      hasAnalytics: tier === 'spotlight',
      canPromoteEvents: tier === 'spotlight',
      promotedEventsPerMonth: tier === 'spotlight' ? 1 : 0,
    };
  }
  ```

#### 3.2 Search Ordering
- [ ] **Businesses.tsx** — Sort results: Spotlight first → Premium → Basic
  ```sql
  SELECT * FROM businesses WHERE status = 'active'
  ORDER BY 
    CASE subscription_tier 
      WHEN 'spotlight' THEN 1 
      WHEN 'premium' THEN 2 
      ELSE 3 
    END,
    rating DESC, name ASC
  ```
- [ ] Add "Spotlight" and "Premium" badges to search results
- [ ] Premium+ businesses get a subtle highlight/border

#### 3.3 Homepage Updates
- [ ] **Home.tsx** — Add "Spotlight Businesses" section
  - Query: `businesses WHERE is_spotlight = true AND status = 'active'`
  - Carousel/rotation of spotlight businesses with large cards
  - Only shows if spotlight businesses exist
- [ ] Featured businesses section pulls from `is_featured = true`

#### 3.4 Business Detail Page
- [ ] **BusinessDetails.tsx** — Conditionally render sections based on tier:
  - Basic: name, address, phone, hours, one photo, category
  - Premium+: add description, website link, gallery, social media, amenities, badge
  - Spotlight+: add "Promoted Events" section
- [ ] Show "Upgrade to Premium to unlock" CTA on hidden sections (only to owner)

#### 3.5 Business Profile Form
- [ ] **BusinessProfileCreation.tsx** — Show/hide form fields based on selected tier
  - Basic: core fields only
  - Premium+: unlock description, website, gallery upload, social media
  - Show tier comparison with "Upgrade" links for locked fields

#### 3.6 Analytics Tracking
- [ ] Create `src/hooks/useAnalytics.ts`
  - Track business page views, search impressions, clicks
  - Insert into `analytics_events` table
  - Only track for active businesses
- [ ] Add tracking calls to BusinessDetails, Businesses (search results), phone/website clicks

#### 3.7 Validation
- [ ] Basic listing shows only basic fields
- [ ] Premium listing shows full profile with badge
- [ ] Spotlight listing appears first in search, on homepage, with analytics
- [ ] Owner sees upgrade CTAs on locked features
- [ ] Non-owner visitors see clean pages without upgrade prompts

**Files touched:** ~12 (1 new hook, ~11 component updates)
**Agent sessions:** 2
**Dependencies:** Phase 1 + 2 complete

---

## 6. Phase 4: Business Owner Dashboard

**Goal:** Business owners can manage their listing, photos, and view analytics.

### Tasks

#### 4.1 Dashboard Page
- [ ] Create `src/pages/BusinessDashboard.tsx` (protected route)
  - If user has no business → show "Create your business" CTA
  - If user has business → show dashboard with tabs:
    - **Overview** — listing preview, current tier, subscription status
    - **Edit Profile** — edit all tier-allowed fields
    - **Photos** — upload/manage photos (Supabase Storage)
    - **Analytics** — view counts, impressions, clicks (Spotlight only)
    - **Subscription** — current plan, upgrade, manage billing

#### 4.2 Photo Upload
- [ ] Create `functions/api/businesses/upload-photo.ts`
  - Accept multipart form data
  - Validate: image type (JPEG/PNG/WebP), max 2MB, within tier photo limit
  - Upload to Supabase Storage: `business-photos/{user_id}/{business_id}/{filename}`
  - Return public URL
  - Update business `gallery` JSONB array
- [ ] Create `src/components/PhotoUploader.tsx`
  - Drag-and-drop + click to upload
  - Show current photos with delete option
  - Display remaining photo slots based on tier
  - Image preview before upload
  - Progress indicator

#### 4.3 Edit Profile Form
- [ ] Create `src/components/BusinessEditForm.tsx`
  - Pre-fill with current data
  - Tier-gated fields (disabled with upgrade CTA if locked)
  - Auto-save or explicit save button
  - Slug auto-generation from name (with edit option)

#### 4.4 Analytics Dashboard (Spotlight)
- [ ] Create `src/components/AnalyticsDashboard.tsx`
  - Date range selector (7d, 30d, 90d)
  - Metrics: total views, search impressions, clicks, phone taps, website visits
  - Simple bar/line chart (use lightweight lib or pure CSS bars)
  - Top referrers
  - "Powered by your Spotlight plan" badge

#### 4.5 Promoted Events (Spotlight)
- [ ] Business dashboard tab for creating promoted events
  - Shows remaining promotions this month (1/month for Spotlight)
  - Link to event creation form with business pre-linked
  - Promoted events get `is_promoted = true` → shown in featured section

#### 4.6 Route & Navigation
- [ ] Add `/dashboard` route (protected)
- [ ] Add "Dashboard" link in Header for business owners
- [ ] Add "Dashboard" link in UserProfileDropdown

#### 4.7 Validation
- [ ] Business owner can edit all tier-allowed fields
- [ ] Photo upload works with tier limits enforced
- [ ] Analytics shows real data for Spotlight tier
- [ ] Non-Spotlight users see "Upgrade to Spotlight" on analytics tab
- [ ] Promoted event creation works for Spotlight

**Files touched:** ~8-10 new files, ~5 updates
**Agent sessions:** 3
**Dependencies:** Phase 1-3 complete

---

## 7. Phase 5: Admin Panel

**Goal:** Site admin can approve businesses/events, manage users, and moderate content.

### Tasks

#### 5.1 Admin Routes
- [ ] Create `src/pages/admin/AdminDashboard.tsx`
  - Stats: total businesses, events, users, revenue
  - Pending approvals count
- [ ] Create `src/pages/admin/BusinessApprovals.tsx`
  - List pending businesses, approve/reject with reason
- [ ] Create `src/pages/admin/EventApprovals.tsx`
  - List pending events, approve/reject
- [ ] Create `src/pages/admin/UserManagement.tsx`
  - List users, roles, subscription status
- [ ] Create admin guard: `src/components/auth/AdminRoute.tsx`
  - Check `profiles.role === 'admin'`

#### 5.2 Server-Side Admin Functions
- [ ] `functions/api/admin/approve-business.ts` — Set status to 'active'
- [ ] `functions/api/admin/approve-event.ts` — Set status to 'approved'
- [ ] Verify admin role server-side (check JWT + profiles table)

#### 5.3 Validation
- [ ] Only admins can access /admin routes
- [ ] Approval flow works end-to-end
- [ ] Rejected items show reason to owner

**Files touched:** ~8-10 new files
**Agent sessions:** 2
**Dependencies:** Phase 1 complete

---

## 8. Phase 6: White-Label Config

**Goal:** Clone the repo, change a config file, and have a new city site.

### Tasks

#### 6.1 Site Config File
- [ ] Create `src/config/site.ts`
  ```typescript
  export const siteConfig = {
    // Identity
    name: 'CalCity.info',
    city: 'California City',
    state: 'CA',
    tagline: "Discover the beauty and opportunity of the Mojave Desert's hidden gem",
    domain: 'calcity.info',
    
    // Theme (M3 seed color)
    seedColor: '#C47451',  // Terracotta
    
    // Features
    features: {
      chat: true,
      weather: true,
      events: true,
      businesses: true,
      guide: true,
    },
    
    // External services
    chatSystemPrompt: 'You are a helpful assistant for California City, CA...',
    weatherLocation: { lat: 35.1258, lon: -117.9859, name: 'California City' },
    
    // Pricing (Stripe price IDs)
    stripe: {
      basicPriceId: 'price_1TASQfRpRbHjjRj8mXv5x9rB',
      premiumPriceId: 'price_1TASRPRpRbHjjRj8rZMNIJ4i',
      spotlightPriceId: 'price_1TASSRRpRbHjjRj8nfJz5gSc',
    },
    
    // Content
    guide: {
      attractions: [...],
      gettingHere: '...',
      importantLocations: [...],
    },
    
    // Social
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
  };
  ```

#### 6.2 Dynamic Theme Generation
- [ ] Build a utility that takes `seedColor` and generates full M3 tonal palette
- [ ] Apply at runtime via CSS custom properties
- [ ] Each city gets its own color identity from one hex value

#### 6.3 Replace All Hardcoded City References
- [ ] Grep for "California City", "CalCity", "Cal City", "Mojave" → replace with `siteConfig.*`
- [ ] Update Header logo, Footer, meta tags, page titles
- [ ] Update Venice chat system prompt from config
- [ ] Update weather widget location from config

#### 6.4 Deployment Template
- [ ] Create `DEPLOY.md` — step-by-step for launching a new city:
  1. Fork repo
  2. Edit `src/config/site.ts`
  3. Create Supabase project → run migrations
  4. Create Stripe products → copy price IDs
  5. Set up Cloudflare Pages project → env vars
  6. Set up domain
  7. Create admin account
  8. Seed initial data

**Files touched:** ~20-30 (config extraction across all files)
**Agent sessions:** 3-4
**Dependencies:** All previous phases complete

---

## 9. Environment Variables

### Local Development (`.env`)
```bash
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Stripe (frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe (server — only used in CF Functions)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_SPOTLIGHT_PRICE_ID=price_...

# Supabase (server — service role for CF Functions)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Venice AI
VENICE_API_KEY=...

# Resend (contact form)
RESEND_API_KEY=re_...

# Turnstile
TURNSTILE_SECRET=0x...
```

### Cloudflare Pages (Dashboard → Settings → Environment Variables)

| Variable | Type | Notes |
|----------|------|-------|
| `STRIPE_SECRET_KEY` | Encrypted | Server-side only |
| `STRIPE_WEBHOOK_SECRET` | Encrypted | Server-side only |
| `STRIPE_BASIC_PRICE_ID` | Plaintext | |
| `STRIPE_PREMIUM_PRICE_ID` | Plaintext | |
| `STRIPE_SPOTLIGHT_PRICE_ID` | Plaintext | |
| `SUPABASE_URL` | Plaintext | |
| `SUPABASE_SERVICE_ROLE_KEY` | Encrypted | Bypasses RLS |
| `VENICE_API_KEY` | Encrypted | Chat widget |
| `RESEND_API_KEY` | Encrypted | Contact form |
| `TURNSTILE_SECRET` | Encrypted | Spam protection |

---

## 10. Deployment Checklist

### Per-City Launch
- [ ] Fork/clone repo
- [ ] Edit `src/config/site.ts` with city details
- [ ] Create Supabase project
  - [ ] Run all SQL migrations from `supabase/`
  - [ ] Enable Auth providers (email, Google, Apple)
  - [ ] Create storage buckets
  - [ ] Copy URL + anon key + service role key
- [ ] Create Stripe account (or use Connect for multi-city)
  - [ ] Create 3 products with monthly prices
  - [ ] Copy price IDs
  - [ ] Set up webhook endpoint
  - [ ] Enable Customer Portal
- [ ] Create Cloudflare Pages project
  - [ ] Connect Git repo
  - [ ] Set build command: `npm run build`
  - [ ] Set output dir: `dist`
  - [ ] Add all environment variables
  - [ ] Add custom domain
- [ ] Create Turnstile site (Cloudflare dashboard)
  - [ ] Copy site key → update frontend config
  - [ ] Copy secret key → CF Pages env
- [ ] Set up Resend
  - [ ] Verify sending domain (optional, shared domain works)
  - [ ] Copy API key → CF Pages env
- [ ] Create admin account
  - [ ] Sign up on the site
  - [ ] Manually set `role = 'admin'` in Supabase profiles table
- [ ] Seed initial content
  - [ ] Add 5-10 placeholder businesses
  - [ ] Add 3-5 upcoming events
  - [ ] Update Guide page content
- [ ] Test
  - [ ] Full signup → login flow
  - [ ] Business creation → approval → listing
  - [ ] Event submission → approval → calendar
  - [ ] Stripe checkout → subscription → tier upgrade
  - [ ] Contact form → email delivery
  - [ ] Dark mode toggle
  - [ ] Mobile responsive

---

## Implementation Order

| Phase | Description | Sessions | Depends On |
|-------|-------------|----------|------------|
| **1** | Database Foundation | 2-3 | Supabase project |
| **2** | Stripe Billing Pipeline | 2-3 | Phase 1 |
| **3** | Subscription-Gated Features | 2 | Phase 1 + 2 |
| **4** | Business Owner Dashboard | 3 | Phase 1-3 |
| **5** | Admin Panel | 2 | Phase 1 |
| **6** | White-Label Config | 3-4 | All phases |

**Total: ~14-17 agent sessions over ~5-7 days**

Phase 5 (Admin) can run in parallel with Phase 3-4 since it only depends on Phase 1.

---

*This document is the source of truth for the CalCity platform. Update it as decisions change.*
