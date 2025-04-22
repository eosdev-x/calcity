# Cloudflare Pages Setup Guide for California City Website

This guide explains how to deploy the California City website with Supabase authentication to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Your GitHub repository connected to Cloudflare Pages
- Supabase project with credentials

## Step 1: Set Up Environment Variables in Cloudflare Pages

1. Log in to your Cloudflare dashboard
2. Navigate to **Pages** > Your project
3. Go to **Settings** > **Environment variables**
4. Add the following variables:
   - Name: `VITE_SUPABASE_URL` 
     Value: `https://qbuhadgmvrwquufqhmrz.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY` 
     Value: Your Supabase anon key
5. Make sure to add these to both **Production** and **Preview** environments
6. Click **Save**

## Step 2: Configure Build Settings

1. In your Cloudflare Pages project settings, set:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave as default)
   - **Node.js version**: 18 (or latest LTS)

## Step 3: Configure Supabase Authentication Settings

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Set the **Site URL** to your Cloudflare Pages URL (e.g., `https://calcity.pages.dev`)
4. Add the following **Redirect URLs**:
   - `https://calcity.pages.dev/auth/callback`
   - `https://calcity.pages.dev/auth/reset-password`
5. Click **Save**

## Step 4: Set Up the Profiles Table in Supabase

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the SQL from `supabase/profiles-table.sql`
5. Run the query to create the profiles table and triggers

## Step 5: Deploy Your Site

1. Push your changes to your GitHub repository
2. Cloudflare Pages will automatically detect the changes and start a new deployment
3. Monitor the deployment in the Cloudflare dashboard

## Troubleshooting

### Authentication Issues

If you encounter authentication issues:

1. Check the browser console for errors
2. Verify environment variables are correctly set in Cloudflare
3. Ensure redirect URLs are properly configured in Supabase
4. Check that the profiles table is correctly set up

### Routing Issues

If you encounter 404 errors when refreshing pages:

1. Verify that the `_redirects` file is in the `public` directory
2. Check that the Cloudflare Pages configuration is handling client-side routing

## Local Development

For local development:

1. Create a `.env` file in your project root
2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://qbuhadgmvrwquufqhmrz.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run `npm run dev` to start the development server

## Security Considerations

- Never commit your `.env` file to your repository
- Use environment variables in Cloudflare Pages for production
- Consider setting up role-based access control in Supabase
- Implement proper error handling for authentication failures
