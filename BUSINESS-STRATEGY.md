# CalCity & .info Sites — Business Strategy

*Created: March 14, 2026*

## Vision

A white-label city information platform that any small-to-mid-size city can deploy in minutes. Revenue from both direct business listings AND platform licensing.

## Current Assets

| Asset | Status |
|-------|--------|
| **CalCity.info** | Live — 15 businesses, 8 events, Stripe billing, admin panel, Google OAuth |
| **Rosamond.info** | Config done, needs Supabase + Stripe + deploy |
| **USAPkwy.info** | Config done, needs Supabase + Stripe + deploy |
| **city-info template** | Clone → edit `site.ts` → deploy |
| **Full stack** | React, TypeScript, Supabase, Stripe, Cloudflare Pages, Turnstile, Resend |

## Revenue Stream 1: Local Business Listings

### Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Name, address, phone, hours, category listing |
| **Basic** | $4.99/mo | + Photos, description, website link, search priority |
| **Premium** | $14.99/mo | + Gallery (10 photos), featured badge, analytics, event promotion |
| **Spotlight** | $29.99/mo | + Homepage rotation, top of search, social cross-promo, priority support |

### Why Free Tier Matters
- $9.99/mo is a hard sell to a laundromat in a 15k-pop town
- Free gets ALL businesses on the platform — instant value for visitors
- Visitors = traffic = proof to businesses that paid tiers are worth it
- Upsell path: "You got 47 views this month on your free listing — Basic adds photos and bumps you up in search"

### Unit Economics Per City
- Target: 20-30 businesses (mix of free and paid)
- Average revenue: $200-300/city/mo at maturity
- Cost per city: ~$0 (Cloudflare Pages free tier, Supabase free tier handles small cities)
- Breakeven: Immediately (infrastructure cost is near zero)

## Revenue Stream 2: White-Label Platform

### Model A: City Government / Chamber of Commerce License

**Pitch:** "Your own branded city website with business directory, events calendar, and visitor guide. Fully managed."

| Plan | Price | Includes |
|------|-------|----------|
| **Starter** | $99/mo | Custom domain, branding, up to 50 businesses, email support |
| **Professional** | $199/mo | Up to 200 businesses, admin panel, analytics, priority support |
| **Enterprise** | Custom | Unlimited, custom features, dedicated support, SLA |

**Value prop for chambers:**
- Most small-town chambers have terrible WordPress sites or nothing
- They spend $2k-5k/year on website hosting/maintenance already
- This gives them a modern, mobile-first platform for less
- Business listing revenue offsets or exceeds the license cost

### Model B: Franchise / Operator License

**Pitch:** "Run a city info site in your town. We provide the platform, you recruit the businesses."

| | |
|---|---|
| **Setup fee** | $499 one-time |
| **Platform fee** | $49/mo |
| **Revenue split** | Operator keeps 80% of listing revenue, platform keeps 20% |

**Target operators:**
- Local marketing agencies
- Chamber of Commerce directors (side project)
- Real estate agents (they know every business in town)
- Community-minded entrepreneurs

### White-Label Sales Infrastructure Needed
- [ ] Landing page / sales site (separate domain — e.g., cityinfoplatform.com)
- [ ] Demo site (fully populated, looks amazing)
- [ ] Pricing page with clear tiers
- [ ] One-pager / PDF pitch deck for outreach
- [ ] Onboarding flow (how fast can we get a new city live?)

## Revenue Stream 3: Future Monetization (Post-Traction)

| Source | Description | Timeline |
|--------|-------------|----------|
| **Local advertising** | Banner ads, sponsored listings | 6+ months |
| **Affiliate / lead gen** | Service referrals (plumber, electrician) | 6+ months |
| **Event tickets** | Commissions on ticket sales | 6+ months |
| **Local deals / coupons** | Businesses offer deals to drive foot traffic | 3+ months |
| **Real estate partnerships** | "Moving to [City]?" section, referral fees | 6+ months |
| **City data / analytics** | Sell anonymized traffic/interest data to city planners | 12+ months |

## Go-To-Market Strategy

### Phase 1: Validate (Now — 2 months)
- Add free tier to CalCity
- Get to 30+ businesses listed (most free, 3-5 paying)
- Approach CalCity Chamber of Commerce
- Deploy Rosamond + USAPkwy as proof of multi-city
- Collect metrics: page views, business sign-ups, search traffic

### Phase 2: Expand Nevada (Months 3-4)
- Target 5 cities within driving distance of Reno/Sparks:
  - Fernley, Fallon, Dayton, Silver Springs, Carson City
- Template deploy takes <1 hour per city
- Start populating with real businesses (research + data entry)

### Phase 3: Package & Sell (Months 4-6)
- Build sales landing page
- Create demo site (best-of-all-cities showcase)
- Pitch deck for chambers and local operators
- Outreach: email, LinkedIn, local business events
- First 3-5 white-label customers

### Phase 4: Scale (Months 6-12)
- 10-20 cities live
- Mix of self-run and licensed
- Hire part-time sales/onboarding help if needed
- SEO strategy: each city site ranks for "[city name] businesses", "[city name] events"
- Consider paid ads for white-label sales

## Revenue Projections

### Conservative

| Source | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Listing revenue (self-run cities) | $300 | $1,000 | $3,000 |
| White-label licenses | $0 | $447 | $1,192 |
| Operator rev share | $0 | $0 | $500 |
| **Total MRR** | **$300** | **$1,447** | **$4,692** |

### Optimistic

| Source | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Listing revenue | $500 | $2,000 | $6,000 |
| White-label licenses | $199 | $1,000 | $3,000 |
| Operator rev share | $0 | $200 | $1,500 |
| **Total MRR** | **$699** | **$3,200** | **$10,500** |

## Competitive Landscape

| Competitor | Weakness | Our Advantage |
|------------|----------|---------------|
| **Yelp** | Generic, expensive ads, not community-focused | Hyper-local, community-owned feel, affordable |
| **Google Business** | No events, no community, no customization | Full events calendar, visitor guide, city branding |
| **Nextdoor** | Social network, not business directory | Dedicated business platform with Stripe billing |
| **Local WordPress sites** | Slow, ugly, expensive to maintain | Modern stack, automatic deploys, near-zero hosting cost |
| **Townsquare Media** | Expensive, generic small-town sites | Affordable, custom-branded, self-service admin |

## Key Metrics to Track

- **Businesses per city** (free + paid breakdown)
- **Conversion rate** (free → paid)
- **Monthly page views per city**
- **Average revenue per city**
- **White-label pipeline** (leads → demos → conversions)
- **Churn rate** (business subscription cancellations)
- **SEO rankings** per city for target keywords

## Technical Moat

- **Clone-and-deploy in <1 hour** — no competitor can match this speed
- **Near-zero marginal cost** — Cloudflare Pages + Supabase free tiers
- **Single codebase** — bug fixes and features deploy to ALL cities
- **Stripe-native billing** — no custom payment infrastructure
- **Admin panel included** — city operators are self-service

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Small towns don't have enough businesses | Free tier ensures platform has value even with few paying customers |
| Businesses don't see value | Show traffic metrics, offer first month free trial |
| Yelp/Google dominates | We're complementary, not competing — focus on community and events |
| Hard to sell white-label | Start with warm intros via chambers, build case study first |
| Maintaining multiple cities | Single codebase, automated deploys, admin self-service |

---

## Deep Dive: Market Research (March 14, 2026)

### Chamber of Commerce Contacts

**California City Chamber of Commerce**
- Address: 8001 California City Blvd, California City, CA 93505
- Phone: (760) 373-8676
- Principal Officer: Jessica Rojas
- Website: californiacitychamber.com (basic Wix-style site)
- Members page: ~20 businesses listed, very basic format
- BBB member since 1960, nonprofit (EIN: 95-2908601)
- Part of Greater Bakersfield Chamber network

**Rosamond Chamber of Commerce**
- Address: 2861 Diamond St, Rosamond, CA 93560
- Phone: (661) 256-3248
- President: Jack Miller
- Website: rosamondchamber.org (WordPress, outdated — banner says "building a new website")
- Also listed at rosamondchamber.com (even more outdated, still shows 2018 member application)
- BBB Accredited (A+ rating), since 1990
- ~30 business members listed

**Key Insight:** Both chambers have terrible websites. Rosamond is literally advertising they're building a new one. This is our opening.

### Direct Competitor: Ideal Directories (idealdirectories.com)

This is the closest competitor to our model:
- **What they sell:** White-label business directory websites
- **Pricing:**
  - Basic: ~$49/mo (up to 500 listings)
  - Professional: ~$149/mo (up to 2,500 listings, client billing)
  - Enterprise: $297/mo (up to 10,000 listings, 10 admin accounts, priority support)
- **Includes:** Hosting, SSL, Stripe integration, banner ads, SEO, coupon codes
- **Their model:** Sell the platform to local operators who then sell listings to businesses
- **Revenue guidance:** "Hire commission-only sales reps" to sell listings door-to-door

**Our advantages over Ideal Directories:**
1. **Modern stack** — React + Supabase + Cloudflare vs their likely WordPress/PHP backend
2. **Near-zero hosting** — CF Pages free tier vs their $297/mo
3. **Better features** — Events calendar, visitor guide, weather, admin panel, SEO baked in
4. **We own the code** — Can customize anything, no platform lock-in
5. **Lower price point** — We can undercut massively and still be profitable
6. **Supabase + Stripe native** — Real-time data, webhooks, subscription management built in

**Their weakness:** Generic directory software. Ours is purpose-built for CITIES with events, guides, and community features. Different value prop.

### Other Competitors / Adjacent Players
- **Vendasta** — White-label local SEO/listings platform for agencies ($500+/mo). Enterprise, overkill for small towns.
- **Nextdoor** — Social network, not a business directory. Different use case.
- **Townsquare Media** — Big media company running small-town sites. Expensive, generic.
- **Google Business / Yelp** — Universal directories, not community-focused.

### Nevada Expansion Targets (Near Reno)

| City | Population | Chamber | Notes |
|------|-----------|---------|-------|
| Fernley | ~22,000 | Yes | Fast-growing, 30 min from Reno |
| Fallon | ~9,000 | Yes | Military town (NAS Fallon) |
| Dayton | ~16,000 | Yes | Growing bedroom community |
| Silver Springs | ~6,000 | No formal | Underserved, opportunity |
| Minden/Gardnerville | ~12,000 | Yes | Carson Valley, tourism |
| Sparks | ~115,000 | Yes | Adjacent to Reno, many businesses |

### Pitch Strategy for Chambers

**Cold approach (email/call):**
"Hi [Name], I built a modern business directory and events platform for California City (calcity.info). I noticed [their city] doesn't have a dedicated local business site — or the current one could use an upgrade. I'd love to show you what a modern version looks like. It's already live with [X] businesses and upcoming events. Would 15 minutes work this week?"

**Value props for chambers:**
1. "Your members get a professional online listing for free — paid tiers for premium features"
2. "Events calendar drives community engagement — YOUR events, front and center"
3. "Modern, mobile-first site that actually looks good — not a 2018 WordPress template"
4. "We handle all the tech — you handle the relationships"
5. "Revenue share: listing subscriptions help fund the chamber"
