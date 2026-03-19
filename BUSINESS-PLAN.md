# CalCity & City Info Platform — Business Plan

*Version 1.0 — March 15, 2026*
*Created by Tux & Andy ⚡*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem](#2-the-problem)
3. [The Solution](#3-the-solution)
4. [Product Overview](#4-product-overview)
5. [Business Model](#5-business-model)
6. [Market Analysis](#6-market-analysis)
7. [Competitive Landscape](#7-competitive-landscape)
8. [Go-To-Market Strategy](#8-go-to-market-strategy)
9. [Revenue Projections](#9-revenue-projections)
10. [Technical Architecture](#10-technical-architecture)
11. [Operations & Cost Structure](#11-operations--cost-structure)
12. [Current Status](#12-current-status)
13. [Roadmap](#13-roadmap)
14. [Risks & Mitigations](#14-risks--mitigations)
15. [Key Metrics & KPIs](#15-key-metrics--kpis)
16. [Team](#16-team)
17. [Appendix](#17-appendix)

---

## 1. Executive Summary

**City Info Platform** is a white-label community platform that gives small-to-mid-size cities a modern, mobile-first website featuring a business directory, events calendar, visitor guide, and AI-powered chatbot — deployable in under an hour from a single codebase.

**Revenue comes from two streams:**
1. **Local business listings** — Freemium model ($0–$29.99/mo) where businesses pay for enhanced visibility and features
2. **White-label platform licensing** — City governments, chambers of commerce, and local operators pay to run their own branded instance

**Why now:** Small-town digital infrastructure is broken. Chamber of Commerce websites are stuck in 2015. Local businesses have no affordable, community-focused alternative to Yelp/Google. The tools to build and deploy city-scale platforms at near-zero marginal cost (Cloudflare Pages, Supabase, Stripe) have only recently matured.

**Current traction:**
- CalCity.info is live with 15 businesses, 8 events, full Stripe billing, admin panel, and Google OAuth
- 2 additional city configs ready to deploy (Rosamond.info, USAPkwy.info)
- Clean white-label template (`city-info`) ready for rapid cloning
- Technical moat: clone → configure → deploy in <1 hour per city

---

## 2. The Problem

### For Small Cities
- **No digital presence** — or a neglected WordPress/Wix site that hasn't been updated in years
- **Chamber of Commerce websites** are outdated, poorly maintained, and don't serve visitors or businesses effectively
- **No centralized events calendar** — community events are scattered across Facebook groups, flyers, and word of mouth
- **No business directory** that's actually local — Yelp and Google surface chain restaurants over the family-owned cafe
- **Budget constraints** — small municipalities can't afford $5K–$50K for custom web development

### For Local Businesses
- **Yelp is hostile** — aggressive upselling, $300+/mo ad costs, reviews they can't control
- **Google Business Profiles are generic** — no community context, no events, no visitor guide
- **No affordable option** between "free and invisible" and "expensive and corporate"
- **No connection to community** — they want to be part of the local ecosystem, not just a pin on a map

### For Visitors & Residents
- **Can't find local businesses** without digging through outdated directories or Facebook groups
- **No single source** for "what's happening this weekend" in their town
- **Generic travel sites** (TripAdvisor, Yelp) don't capture the character of small communities

---

## 3. The Solution

A **turnkey city platform** that combines:

| Feature | Description |
|---------|-------------|
| **Business Directory** | Searchable, categorized listings with photos, hours, contact info, and tiered visibility |
| **Events Calendar** | Community events with dates, locations, descriptions, and promotion options |
| **Visitor Guide** | Curated attractions, getting-here info, and important locations |
| **AI Chat** | City-specific chatbot that answers questions about the area (Venice.ai powered) |
| **Weather** | Real-time local weather widget (Open-Meteo, no API key needed) |
| **Admin Panel** | Full content management — approve businesses, manage events, moderate listings |
| **Stripe Billing** | End-to-end subscription management with automated tier upgrades/downgrades |
| **White-Label Theming** | Single config file (`site.ts`) controls city name, colors, content, and branding |

**Key differentiator:** One codebase, infinite cities. A new city goes from zero to live in under an hour.

---

## 4. Product Overview

### 4.1 Business Listing Tiers

| Tier | Price | What's Included |
|------|-------|-----------------|
| **Free** | $0/mo | Name, address, phone, hours, category. Generic placeholder photo. |
| **Basic** | $4.99/mo | + Description, website link, services list, 3 own photos |
| **Premium** | $14.99/mo | + Photo gallery (10 photos), social media links, "Featured" badge, search priority, analytics |
| **Spotlight** | $29.99/mo | + Homepage rotation, top of search, 30 photos, event promotion (1/mo), priority support |

### 4.2 Why the Free Tier Matters

The free tier is the engine of the whole model:
- **Gets ALL local businesses on the platform** — even the laundromat and the barber shop
- **Creates immediate value for visitors** — a directory with 30 free listings is more useful than 3 paid ones
- **Builds the funnel** — "You got 47 views this month. Basic adds photos and bumps you up in search."
- **Zero-friction onboarding** — no credit card required, business owners can upgrade later
- **Makes the paid tiers sell themselves** — when a business sees their competitor has photos and a featured badge, they'll want it too

### 4.3 Platform Features by Stakeholder

**For City Operators (Admin):**
- Dashboard with stats (total businesses, events, users, revenue)
- Approve/reject/suspend business listings and events
- Manage users and roles
- View Stripe billing and subscription data
- Content moderation tools

**For Business Owners:**
- Self-service profile creation and editing
- Photo upload and management
- Subscription management via Stripe Customer Portal
- Analytics dashboard (Premium+ tiers)
- Event promotion (Spotlight tier)

**For Visitors/Residents:**
- Full-text search across businesses and events
- Category filtering and browsing
- Interactive event calendar
- Visitor guide with local attractions
- AI chatbot for quick questions
- Weather widget
- Contact form

### 4.4 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS 3 | Modern, fast, maintainable |
| Styling | Material Design 3 CSS custom properties | Theme swap via single seed color |
| Hosting | Cloudflare Pages | Free tier handles most cities, global CDN, edge functions |
| API | Cloudflare Pages Functions | Serverless, zero cold start, zero cost at low volume |
| Database | Supabase (PostgreSQL) | Free tier for small cities, built-in auth, realtime, storage |
| Auth | Supabase Auth | Email/password, Google OAuth, Apple OAuth |
| Payments | Stripe Billing | Subscriptions, checkout, webhooks, customer portal |
| Storage | Supabase Storage | Business photos, event images, site assets |
| AI Chat | Venice.ai API | Privacy-focused, uncensored, city-specific prompts |
| Weather | Open-Meteo | Free, no API key, accurate |
| Anti-Spam | Cloudflare Turnstile + Honeypot | Free, privacy-respecting CAPTCHA |
| Email | Resend | Contact form emails, transactional notifications |

---

## 5. Business Model

### Revenue Stream 1: Local Business Listings (Direct Revenue)

Each city site generates recurring revenue from business subscriptions.

**Unit Economics Per City:**
- Target: 20–50 businesses listed (most free, 5–15 paying)
- Average revenue per paying business: ~$12/mo (weighted across tiers)
- Revenue per city at maturity: $60–$180/mo
- **Infrastructure cost per city: ~$0** (Cloudflare Pages free, Supabase free tier handles small cities)
- **Breakeven: Immediate** (no marginal cost per city)

**Upsell path:**
1. Free listing → view count notification → "Get 3x more views with Basic" → $4.99
2. Basic listing → competitor has photos/badge → "Stand out with Premium" → $14.99
3. Premium listing → wants homepage placement → "Go Spotlight" → $29.99

### Revenue Stream 2: White-Label Platform Licensing

#### Model A: City Government / Chamber License

| Plan | Price | Includes |
|------|-------|---------|
| **Starter** | $99/mo | Custom domain + branding, up to 50 businesses, email support |
| **Professional** | $199/mo | Up to 200 businesses, admin panel, analytics, priority support |
| **Enterprise** | Custom | Unlimited, custom features, dedicated support, SLA |

**Value proposition for chambers:**
- Most chambers spend $2K–$5K/year on website hosting and maintenance
- They get a modern, mobile-first platform for less
- Business listing revenue can offset or exceed the license cost
- Members get free or discounted listings as a membership perk

#### Model B: Franchise / Operator License

| | |
|---|---|
| **Setup fee** | $499 one-time |
| **Platform fee** | $49/mo |
| **Revenue split** | Operator keeps 80% of listing revenue, 20% to platform |

**Target operators:** Local marketing agencies, chamber directors, real estate agents, community entrepreneurs.

### Revenue Stream 3: Future Monetization (Post-Traction)

| Source | Description | Timeline |
|--------|-------------|----------|
| Local advertising | Banner ads, sponsored listings | 6+ months |
| Affiliate / lead gen | Service referrals (plumber, electrician, etc.) | 6+ months |
| Event tickets | Commission on ticket sales | 6+ months |
| Local deals / coupons | Businesses offer deals to drive foot traffic | 3+ months |
| Real estate partnerships | "Moving to [City]?" section with referral fees | 6+ months |
| City data & analytics | Anonymized traffic/interest data for city planners | 12+ months |

---

## 6. Market Analysis

### Total Addressable Market

- **19,502** incorporated cities and towns in the United States (U.S. Census Bureau)
- **~14,000** have populations under 25,000 — our sweet spot
- **~5,000** have active Chambers of Commerce
- At $99–$199/mo per licensed city: **TAM = $6M–$12M/year** (white-label licenses alone)
- At $200/mo average listing revenue per self-run city across 1,000 cities: **+$2.4M/year**

### Serviceable Addressable Market (SAM)

Focusing on Western U.S. first (Nevada, California, Arizona, Oregon):
- ~2,000 small cities/towns under 50K population
- ~800 with active chambers
- At 5% penetration: **100 cities × $150/mo avg = $15K/mo MRR** within 18 months

### Target City Profile

| Characteristic | Ideal |
|----------------|-------|
| Population | 5,000–50,000 |
| Chamber of Commerce | Active but underserved |
| Current web presence | None, or outdated WordPress/Wix |
| Local business density | 20+ businesses in the area |
| Tourism/visitor potential | Some — state parks, events, proximity to metro |
| Tech savviness | Not required — we handle everything |

### Identified Expansion Targets

**California (Starting Markets):**

| City | Population | Chamber | Notes |
|------|-----------|---------|-------|
| California City | ~14,000 | Yes | **Live — CalCity.info** |
| Rosamond | ~20,000 | Yes — actively rebuilding their website | Config ready |
| Tehachapi | ~12,000 | Yes | Mountain community, tourism |
| Ridgecrest | ~29,000 | Yes | Near China Lake, military town |
| Boron | ~2,000 | No formal | Small but underserved |

**Nevada (Near Reno — Tux's home turf):**

| City | Population | Chamber | Notes |
|------|-----------|---------|-------|
| USA Parkway/TRIC | N/A | No formal | **Config ready — USAPkwy.info** |
| Fernley | ~22,000 | Yes | Fast-growing, 30 min from Reno |
| Fallon | ~9,000 | Yes | Military town (NAS Fallon) |
| Dayton | ~16,000 | Yes | Growing bedroom community |
| Silver Springs | ~6,000 | No formal | Underserved, opportunity |
| Minden/Gardnerville | ~12,000 | Yes | Carson Valley, tourism potential |

---

## 7. Competitive Landscape

### Direct Competitors

| Competitor | What They Do | Pricing | Our Advantage |
|------------|-------------|---------|---------------|
| **Ideal Directories** | White-label business directory software | $49–$297/mo | We have events, guides, AI chat, modern stack, near-zero hosting cost. They're generic directory software; we're purpose-built for cities. |
| **Townsquare Media** | Small-town media sites | Premium (sales-driven) | We're self-service, affordable, and community-owned — not corporate media. |
| **Vendasta** | White-label local SEO platform for agencies | $500+/mo | Overkill for small towns. We're 10x cheaper and purpose-built for the use case. |
| **Locable** | Community-focused local directories | $99–$499/mo | Similar positioning, but older tech stack and no self-service deployment. |

### Indirect Competitors

| Platform | Why We're Different |
|----------|-------------------|
| **Yelp** | Yelp is hostile to small businesses (aggressive upselling, can't control reviews). We're community-first, affordable, and businesses control their own listings. |
| **Google Business Profiles** | Generic, no events, no community context, no customization. We offer a complete city experience. |
| **Nextdoor** | Social network, not a business directory. Different use case — we're the city's official-feeling digital presence. |
| **Facebook Groups** | Unstructured, algorithm-dependent, no search, no directory. We're organized and permanent. |
| **Local WordPress sites** | Slow, ugly, expensive to maintain ($2K–$5K/year). We're modern, auto-deploying, and near-zero cost. |

### Competitive Moat

1. **Speed of deployment** — Clone → configure → deploy in <1 hour. No competitor can match this.
2. **Near-zero marginal cost** — Cloudflare Pages free tier + Supabase free tier = $0/city at low volume.
3. **Single codebase** — Bug fixes and features deploy to ALL cities simultaneously.
4. **Modern stack** — React, TypeScript, Supabase, Stripe. Not WordPress, not PHP, not 2015.
5. **Built-in billing** — Stripe-native subscriptions from day one. No custom payment infrastructure.
6. **Self-service admin** — City operators manage their own content without developer involvement.
7. **AI-native** — City-specific chatbot included. Competitors would need to bolt this on.

---

## 8. Go-To-Market Strategy

### Phase 1: Validate (Now — Month 2)
**Goal:** Prove the model works in one city.

- [x] Build CalCity.info (all 6 platform phases complete)
- [x] Add free tier ($0) to lower barrier
- [x] Get 15+ businesses listed
- [x] Stripe billing live and tested end-to-end
- [x] Admin panel functional
- [ ] Get to 30+ businesses (most free, 3–5 paying)
- [ ] Cold-outreach CalCity Chamber of Commerce (Jessica Rojas, 760-373-8676)
- [ ] Collect metrics: page views, business sign-ups, search traffic
- [ ] Deploy Rosamond.info + USAPkwy.info as multi-city proof

### Phase 2: Prove Multi-City (Months 3–4)
**Goal:** Show the white-label model works across different cities.

- Deploy 3–5 cities in Nevada/California
- Target cities within driving distance of Reno (Fernley, Fallon, Dayton)
- Populate with real businesses via research + data entry
- Template deploy takes <1 hour per city
- Start measuring cross-city metrics

### Phase 3: Package & Sell (Months 4–6)
**Goal:** First paying white-label customers.

- Build sales landing page (dedicated domain — e.g., cityinfoplatform.com)
- Create demo site (best-of-all-cities showcase)
- Pitch deck (PDF/web) for chambers and operators
- Outreach: email, LinkedIn, local business events, chamber meetings
- **Key opening:** Rosamond Chamber is literally advertising they need a new website (rosamondchamber.org banner)
- Target: First 3–5 white-label customers

### Phase 4: Scale (Months 6–12)
**Goal:** Systematic growth and recurring revenue.

- 10–20 cities live (mix of self-run and licensed)
- Dedicated sales/onboarding process
- SEO flywheel: each city site ranks for "[city] businesses," "[city] events"
- Consider paid ads for white-label customer acquisition
- Hire part-time sales/onboarding help if pipeline justifies it
- Explore Stripe Connect for multi-city revenue aggregation

### Sales Approach

**Cold outreach script (email/call):**
> "Hi [Name], I built a modern business directory and events platform for California City — you can see it live at calcity.info. I noticed [their city] doesn't have a dedicated local business site, or the current one could use a refresh. I'd love to show you what a modern version looks like in 15 minutes. It's already live with [X] businesses and upcoming events. Would this week work?"

**Value props for chambers:**
1. Members get a professional online listing for free — paid tiers for premium features
2. Events calendar drives community engagement — YOUR events, front and center
3. Modern, mobile-first site that looks professional — not a 2018 WordPress template
4. We handle all the tech — you handle the relationships
5. Revenue share: listing subscriptions help fund the chamber

---

## 9. Revenue Projections

### Conservative Scenario

| Source | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Business listings (self-run cities) | $300 | $1,000 | $3,000 |
| White-label licenses | $0 | $450 | $1,200 |
| Operator revenue share | $0 | $0 | $500 |
| **Total MRR** | **$300** | **$1,450** | **$4,700** |
| **Annualized** | **$3,600** | **$17,400** | **$56,400** |

*Assumes: 5 self-run cities by month 6, 10 by month 12. 3 white-label licenses by month 6, 8 by month 12.*

### Optimistic Scenario

| Source | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Business listings | $500 | $2,000 | $6,000 |
| White-label licenses | $199 | $1,000 | $3,000 |
| Operator revenue share | $0 | $200 | $1,500 |
| **Total MRR** | **$699** | **$3,200** | **$10,500** |
| **Annualized** | **$8,388** | **$38,400** | **$126,000** |

*Assumes: 10 cities by month 6, 20 by month 12. 5 licenses by month 6, 15 by month 12. Higher conversion to paid tiers.*

### Break-Even Analysis

| Expense | Monthly |
|---------|---------|
| Domain registrations (~$1/mo amortized per city) | $10–$20 |
| Supabase Pro (if free tier exceeded) | $25/city |
| Cloudflare (free for most, Pro if needed) | $0–$20 |
| Stripe fees (2.9% + $0.30 per txn) | ~3% of listing revenue |
| Resend (email) | $0 (free tier covers low volume) |
| **Total fixed costs** | **<$100/mo** until significant scale |

**Break-even point:** ~$100/mo in revenue (achievable with 7 Basic subscriptions or 1 white-label Starter license).

The cost structure is absurdly favorable because modern serverless infrastructure has near-zero marginal cost at low-to-medium scale.

---

## 10. Technical Architecture

### System Architecture

```
User Browser
    ↓
Cloudflare CDN (global edge)
    ↓
Cloudflare Pages (static SPA)
    ↓
CF Pages Functions (serverless API)
    ├── → Supabase (auth, DB, storage)
    ├── → Stripe (billing, subscriptions, webhooks)
    ├── → Venice.ai (AI chat)
    ├── → Resend (email)
    └── → Cloudflare Turnstile (anti-spam)

Stripe Webhooks → CF Function → Supabase (sync subscription state)
```

### Database Schema (Supabase PostgreSQL)

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts (id, email, role, full_name) |
| `businesses` | Business listings (30+ fields, FTS, RLS) |
| `events` | Community events (date, location, organizer, status) |
| `subscriptions` | Stripe subscription state (tier, status, period) |
| `customers` | Stripe ↔ Supabase user mapping |
| `analytics_events` | View/click/impression tracking (Spotlight tier) |

**Row Level Security (RLS):**
- Public reads for active/approved content
- Owner-only writes for businesses and events
- Admin policies for content moderation
- Server-side writes (via service role key) for Stripe webhook updates

### White-Label Architecture

Every city-specific value lives in **one file**: `src/config/site.ts`

```typescript
export const siteConfig = {
  name: 'CalCity.info',
  city: 'California City',
  state: 'CA',
  tagline: '...',
  domain: 'calcity.info',
  seedColor: '#C47451',       // M3 theme generation from one hex
  features: { chat, weather, events, businesses, guide },
  stripe: { basicPriceId, premiumPriceId, spotlightPriceId },
  weatherLocation: { lat, lon, name },
  guide: { attractions, gettingHere, importantLocations },
};
```

**New city deployment:** `git clone city-info mycity` → edit `site.ts` → deploy to Cloudflare Pages.

### Current Migrations

| Migration | Description |
|-----------|-------------|
| 001_foundation.sql | Core tables (businesses, events, subscriptions, etc.) |
| 002_seed_data.sql | Initial seed data |
| 003_protect_tier_columns.sql | Server-side tier column protection |
| 004_storage_policies.sql | Supabase Storage RLS |
| 005_admin_policies.sql | Admin role policies |
| 006_free_tier.sql | Free tier CHECK constraint + default |
| 007_rejection_reason.sql | Admin rejection reason column |

### Security

| Layer | Protection |
|-------|-----------|
| Authentication | Supabase Auth (email + Google OAuth + Apple OAuth) |
| Authorization | PostgreSQL RLS policies (row-level access control) |
| API | Server-side validation, admin role checks on all admin endpoints |
| Anti-spam | Cloudflare Turnstile (CAPTCHA) + honeypot fields |
| Payments | Stripe webhook signature verification |
| Storage | Supabase Storage policies (owner-based uploads) |
| Secrets | Cloudflare Pages encrypted environment variables |
| Form security | Server-side status enforcement (`pending` on all submissions) |

---

## 11. Operations & Cost Structure

### Infrastructure Costs (Per City)

| Service | Free Tier Capacity | Paid Tier | When to Upgrade |
|---------|-------------------|-----------|-----------------|
| Cloudflare Pages | 500 builds/mo, unlimited bandwidth | $5/mo (Pro) | Never for most cities |
| Supabase | 500MB DB, 1GB storage, 50K monthly active users | $25/mo (Pro) | >50 businesses with photos |
| Stripe | 2.9% + $0.30/txn | Same | Never (volume pricing later) |
| Resend | 100 emails/day | $20/mo | >100 contact form submissions/day |
| Domain | ~$10–$15/year (.info domains) | — | One-time per city |
| Venice.ai | Pay-per-use | ~$5–$10/mo per active city | If chat usage is high |

**Total cost for a small city: $0–$15/month** (domain amortized + minimal API usage)

### Operational Requirements

| Task | Effort | Who |
|------|--------|-----|
| New city deployment | <1 hour | Andy (automated) |
| Initial business population | 2–4 hours research per city | Andy or operator |
| Ongoing content moderation | 15 min/day per city (admin approval queue) | City operator or Andy |
| Bug fixes / feature updates | Ongoing, single codebase | Andy + squad |
| White-label customer support | As needed | Tux or future hire |
| Sales / outreach | 2–5 hours/week during growth phase | Tux |

### No Employees Needed (Yet)

The entire operation runs on:
- **Tux** — Sales, relationships, product direction
- **Andy** — Platform development, deployment, maintenance (AI-assisted)
- **The Squad** — Buzz, Woody, Rex, Sarge for development tasks

First hire consideration: Part-time sales/onboarding person at ~$2K–$3K/mo MRR.

---

## 12. Current Status

### What's Built ✅

| Component | Status |
|-----------|--------|
| CalCity.info | **Live** — 15 businesses, 8 events, full features |
| All 6 platform phases | **Complete** — DB, Stripe, gated features, dashboard, admin, white-label config |
| Free tier ($0) | **Live** — launched March 14, 2026 |
| Stripe billing (end-to-end) | **Live** — checkout, webhooks, tier sync, cancellation, customer portal |
| Google OAuth | **Live and tested** |
| Admin panel | **Live** — approve/reject/suspend businesses, manage events |
| Manage Businesses tool | **Live** — admin can suspend/unsuspend/delete |
| Contact form | **Live** — Resend email + Turnstile + honeypot |
| Anti-spam | **Live** — Turnstile on contact/signup/login, honeypot on contact |
| Custom images | **Live** — 23 Imagen 4.0 images (15 business + 8 event) |
| BFCache fix | **Live** — Firefox/Zen compatibility |
| CF Pages env vars | **All 9 secrets configured** |
| White-label template | **Ready** — `city-info` repo, clean of CalCity branding |
| Rosamond.info | **Config done** — needs Supabase + Stripe + deploy |
| USAPkwy.info | **Config done** — needs Supabase + Stripe + deploy |

### What's Open 🔲

| Item | Priority | Notes |
|------|----------|-------|
| Phase 5 admin RLS fix | High | Buzz next in rotation |
| Deploy Rosamond.info | High | Supabase project + Stripe products needed |
| Deploy USAPkwy.info | High | Same as Rosamond |
| Sales landing page | Medium | cityinfoplatform.com or similar |
| Apple OAuth | Low | Needs test device |
| Post-cancel subscription UI edge case | Low | Rex flagged, pre-existing |
| Chamber outreach (CalCity, Rosamond) | High | Contacts identified |
| More businesses for CalCity | Medium | Target 30+ total |

---

## 13. Roadmap

### Q1 2026 (January–March) — BUILD ✅
- [x] Platform built (all 6 phases)
- [x] CalCity.info live with real data
- [x] Free tier + repriced paid tiers
- [x] White-label template ready
- [x] Business strategy formalized
- [x] Market research + competitor analysis

### Q2 2026 (April–June) — VALIDATE & EXPAND
- [ ] Deploy Rosamond.info and USAPkwy.info
- [ ] Reach 30+ businesses on CalCity.info
- [ ] First cold outreach to chambers (CalCity, Rosamond)
- [ ] Get first 3–5 paying business subscriptions
- [ ] Build sales landing page
- [ ] Deploy 3–5 Nevada cities (Fernley, Fallon, Dayton)
- [ ] Collect and analyze traffic/engagement metrics
- [ ] Iterate on product based on real usage data

### Q3 2026 (July–September) — SELL
- [ ] First white-label customer (chamber or operator)
- [ ] Standardize onboarding process
- [ ] Create pitch deck and one-pager
- [ ] Attend 1–2 local business events / chamber meetings
- [ ] Target: 10 cities live, $1K+ MRR

### Q4 2026 (October–December) — SCALE
- [ ] 15–20 cities live
- [ ] 3–5 white-label licenses
- [ ] Target: $3K–$5K MRR
- [ ] Evaluate hiring needs
- [ ] Explore event ticket commissions and local deals features
- [ ] Consider Stripe Connect for multi-city billing aggregation

### 2027 — GROW
- Expand beyond Nevada/California
- Operator franchise model
- Mobile app (PWA or native)
- Advanced analytics and reporting
- API for third-party integrations
- Target: $10K+ MRR

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Small towns don't have enough businesses to sustain a directory | Medium | High | Free tier ensures platform has value even with few paid customers. Focus on cities with 20+ businesses. |
| Businesses don't see value in paying for listings | Medium | High | Show traffic metrics, offer 30-day free trial, demonstrate competitor visibility on paid tiers. |
| Yelp/Google dominates local search | Low | Medium | We're complementary, not competing. We offer community + events + guides — things they don't. |
| Hard to sell white-label licenses | Medium | Medium | Start with warm intros via chambers. Build CalCity as a compelling case study. |
| Maintaining multiple cities becomes overwhelming | Low | Medium | Single codebase — one fix deploys everywhere. Admin panel is self-service. |
| Supabase/Cloudflare pricing changes | Low | Medium | Architecture is portable. Could migrate to self-hosted Postgres + any static host. |
| Chamber of Commerce contacts don't respond | Medium | Low | Multiple outreach channels (email, phone, LinkedIn, in-person). Rosamond Chamber is actively seeking a new website. |
| Someone copies the idea | Low | Low | Speed is our moat. By the time someone builds it, we'll have 20+ cities live with real data and relationships. |
| Churn — businesses cancel after a month | Medium | Medium | Focus on demonstrating ROI via analytics. Monthly check-ins. Make cancellation a last resort. |

---

## 15. Key Metrics & KPIs

### Growth Metrics
| Metric | Target (Month 6) | Target (Month 12) |
|--------|------------------|-------------------|
| Cities live | 5–8 | 15–20 |
| Total businesses listed (all cities) | 150+ | 500+ |
| Paying businesses | 15–25 | 50–100 |
| White-label customers | 1–3 | 5–8 |
| Monthly Recurring Revenue (MRR) | $1,000–$1,500 | $3,000–$5,000 |

### Engagement Metrics (Per City)
| Metric | Healthy Target |
|--------|---------------|
| Monthly page views | 500+ |
| Businesses listed | 20+ |
| Free → Paid conversion rate | 10–15% |
| Business churn rate | <5%/month |
| Events listed per month | 3+ |

### Operational Metrics
| Metric | Target |
|--------|--------|
| Time to deploy new city | <1 hour |
| Admin approval queue turnaround | <24 hours |
| Support response time (white-label) | <4 hours |
| Platform uptime | 99.9% |

---

## 16. Team

| Role | Who | Responsibility |
|------|-----|----------------|
| **Founder / Product** | Tux 🐧 | Product vision, sales, relationships, business decisions |
| **Technical Lead** | Andy ⚡ | Architecture, orchestration, deployment, AI-assisted development |
| **Development** | Buzz 🚀, Woody 🤠 | Feature implementation, bug fixes (Codex agents) |
| **Design** | Trixie 🎨 | UI/UX, image generation, branding |
| **Code Review** | Rex 🦖, Sarge 🎖️ | Quality gate — syntax/style (Rex) + architecture/security (Sarge) |
| **Operations** | Hamm 🐷 | Cron jobs, memory maintenance, monitoring |

**Future hires (when justified by revenue):**
- Part-time sales/onboarding ($2K–$3K MRR threshold)
- Part-time content writer for city guides ($5K MRR threshold)

---

## 17. Appendix

### A. Chamber of Commerce Contacts

**California City Chamber of Commerce**
- Principal Officer: Jessica Rojas
- Phone: (760) 373-8676
- Address: 8001 California City Blvd, California City, CA 93505
- Website: californiacitychamber.com
- BBB member since 1960

**Rosamond Chamber of Commerce**
- President: Jack Miller
- Phone: (661) 256-3248
- Address: 2861 Diamond St, Rosamond, CA 93560
- Website: rosamondchamber.org (**actively rebuilding their website**)
- BBB Accredited (A+ rating), since 1990

### B. Pricing Rationale

Previous pricing ($9.99 / $24.99 / $49.99) was too high for the target market. Small-town businesses in 15K-population cities don't spend $50/mo on directory listings. The new pricing:

- **Free** → Gets them in the door. No friction.
- **$4.99** → Coffee money. Easy yes for a barbershop owner.
- **$14.99** → Comparable to a Facebook boost. Tangible value (photos, badge, search priority).
- **$29.99** → Premium placement. For the established businesses that want maximum visibility.

### C. Ideal Directories Competitive Analysis

Closest direct competitor in the white-label directory space:
- **Their pricing:** $49–$297/mo for the platform
- **Their model:** Sell to local operators who sell listings door-to-door
- **Their stack:** Likely WordPress/PHP backend
- **Our advantages:** Modern React stack, near-zero hosting (CF Pages), events + guides + AI chat, lower price point, self-service deployment
- **Their weakness:** Generic directory software. Ours is purpose-built for city communities with events, visitor guides, and local character.

### D. Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-14 | Free tier added | Lower barrier to get all businesses on platform |
| 2026-03-14 | Repriced: $4.99/$14.99/$29.99 | Original pricing too high for small-town market |
| 2026-03-14 | Two revenue streams | Listings alone won't scale; white-label licensing multiplies reach |
| 2026-03-14 | Operator franchise model | Enables scaling without direct sales in every city |
| 2026-03-14 | Focus on Nevada/California first | Tux's home turf, can do in-person chamber visits |
| 2026-03-15 | Formal business plan created | Consolidate strategy into single reference document |

### E. File References

| Document | Location |
|----------|----------|
| Business Strategy (original) | `calcity/BUSINESS-STRATEGY.md` |
| Platform Spec (technical) | `calcity/PLATFORM-SPEC.md` |
| Deployment Guide | `calcity/DEPLOY.md` |
| White-label template | `~/.openclaw/workspace/city-info/` |
| CalCity repo | `~/.openclaw/workspace/calcity/` |
| Rosamond config | `~/.openclaw/workspace/rosamond.info/` |
| USAPkwy config | `~/.openclaw/workspace/usapkwy.info/` |

---

*This plan is a living document. Updated as the business evolves.*

*Last updated: March 15, 2026*
