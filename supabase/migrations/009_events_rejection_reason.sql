-- Add rejection_reason column to events table (was missing from 007)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
