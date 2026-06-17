-- ============================================================================
-- SQL Schema for ZeroWaste Connect
-- Copy and paste this directly into your Supabase SQL Editor
-- Tables: profiles, donations
-- Includes: Constraints, Row Level Security (RLS) policies, and Auth triggers
-- ============================================================================

-- 1. ENUM OR CONSTRAINT TYPES (USING CHECKS FOR DURABLE STORAGE IN SCHEMAS)
-- We will use strict CONSTRAINT checks for 'role' and 'status' parameters.

-- 2. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('DONOR', 'RECIPIENT')),
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. CREATE DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity TEXT NOT NULL, -- e.g., "5 marmitas", "2 kg de cenoura"
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'AVAILABLE' NOT NULL CHECK (status IN ('AVAILABLE', 'RESERVED', 'COMPLETED')),
    donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    pickup_instructions TEXT,
    
    -- Ensure latitude and longitude bounds
    CONSTRAINT valid_lat CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT valid_lng CHECK (longitude BETWEEN -180 AND 180)
);

-- Enable RLS for donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Profiles RLS:
-- Anyone can view profiles (to show donor names on donations)
CREATE POLICY "Public profiles are viewable by anyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Users can only modify their own profiles
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Donations RLS:
-- Anyone (authenticated or guest) can list/see active donations
CREATE POLICY "Donations are viewable by everyone" 
ON public.donations FOR SELECT 
USING (true);

-- Donors can create donations (if their profile role is 'DONOR')
CREATE POLICY "Donors can insert donations" 
ON public.donations FOR INSERT 
WITH CHECK (
    auth.uid() = donor_id 
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'DONOR'
    )
);

-- Donors can edit or delete their own donations
CREATE POLICY "Donors can modify their own donations" 
ON public.donations FOR UPDATE 
USING (
    auth.uid() = donor_id
);

-- Recipients can reserve active donations
CREATE POLICY "Recipients can reserve active donations"
ON public.donations FOR UPDATE
USING (
    -- Allow any recipient user to update status/recipient_id if status was AVAILABLE
    status = 'AVAILABLE' 
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'RECIPIENT'
    )
)
WITH CHECK (
    -- Enforce that recipient_id is indeed set to their auth state or NULL
    (recipient_id = auth.uid() AND status = 'RESERVED')
);


-- ============================================================================
-- AUTH TRIGGER FOR AUTOMATIC PROFILE CREATION
-- When a user registers in Supabase Auth, they automatically get a row in public.profiles.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, phone, address)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Utilizador'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'RECIPIENT'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'address'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
