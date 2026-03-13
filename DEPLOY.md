# Deploying a New City Site

## Quick Start
1. Fork this repo
2. Edit `src/config/site.ts` with your city's details
3. Set up external services (see below)
4. Deploy to Cloudflare Pages

## Step 1: Configure Your City
Edit `src/config/site.ts`:
- `name`: Your site name (e.g., 'Rosamond.info')
- `city`: Full city name (e.g., 'Rosamond')
- `state`: State abbreviation (e.g., 'CA')
- `tagline`: City tagline
- `seedColor`: One hex color — generates your entire theme
- `features`: Toggle sections on/off
- `weather`: Lat/lon for your city
- `guide`: Local info content

Theme customization: Edit CSS custom properties in `src/index.css`. For a quick approach, use the Material Theme Builder (https://www.figma.com/community/plugin/1034969338659738588) to generate colors from your seed color. (Future enhancement: generate M3 palettes from `seedColor` programmatically.)

## Step 2: Supabase
1. Create a new Supabase project
2. Run all migrations from `supabase/` in order (001-005)
3. Enable Auth providers (Email, Google, Apple)
4. Create storage bucket: 'business-photos' (public)
5. Copy: Project URL, Anon Key, Service Role Key

## Step 3: Stripe
1. Create Stripe account
2. Create 3 subscription products (Basic .99, Premium 4.99, Spotlight 9.99)
3. Copy the 3 price IDs
4. Set up webhook: https://yourdomain.com/api/stripe/webhook
   Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed
5. Copy webhook secret
6. Enable Customer Portal

## Step 4: Cloudflare Pages
1. Create Pages project, connect your Git repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables (see below)
5. Add custom domain

## Environment Variables
| Variable | Where | Notes |
|----------|-------|-------|
| VITE_SUPABASE_URL | Pages | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Pages | Supabase anon key |
| VITE_STRIPE_PUBLISHABLE_KEY | Pages | Stripe pk_test/pk_live |
| STRIPE_SECRET_KEY | Pages (encrypted) | Stripe sk_test/sk_live |
| STRIPE_WEBHOOK_SECRET | Pages (encrypted) | Stripe webhook secret |
| SUPABASE_URL | Pages | Same as VITE_SUPABASE_URL |
| SUPABASE_SERVICE_ROLE_KEY | Pages (encrypted) | Supabase service role |
| RESEND_API_KEY | Pages (encrypted) | For contact form |
| TURNSTILE_SECRET | Pages (encrypted) | Cloudflare Turnstile |
| VENICE_API_KEY | Pages (encrypted) | AI chat (optional) |

## Step 5: Launch
1. Sign up on your site
2. Set yourself as admin: UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
3. Add 5-10 seed businesses (approve them)
4. Add 3-5 upcoming events (approve them)
5. Test: signup, business creation, Stripe checkout, contact form
