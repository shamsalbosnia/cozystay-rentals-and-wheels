
-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create apartments table
CREATE TABLE IF NOT EXISTS apartments (
  id SERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  rooms INTEGER NOT NULL,
  size NUMERIC(10, 2) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create storage buckets for car and apartment images
DO $$
BEGIN
  -- Create cars bucket if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_policies 
    WHERE policyname = 'Cars images are publicly accessible.'
  ) THEN
    -- Create cars bucket
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('cars', 'cars', true)
    ON CONFLICT (id) DO NOTHING;

    -- Allow public access to car images
    CREATE POLICY "Cars images are publicly accessible."
      ON storage.objects FOR SELECT
      USING (bucket_id = 'cars');
      
    -- Allow authenticated users to upload car images
    CREATE POLICY "Users can upload car images."
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'cars');
      
    -- Allow users to update their car images
    CREATE POLICY "Users can update car images."
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'cars');
      
    -- Allow users to delete their car images
    CREATE POLICY "Users can delete car images."
      ON storage.objects FOR DELETE
      USING (bucket_id = 'cars');
  END IF;

  -- Create apartments bucket if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_policies 
    WHERE policyname = 'Apartment images are publicly accessible.'
  ) THEN
    -- Create apartments bucket
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('apartments', 'apartments', true)
    ON CONFLICT (id) DO NOTHING;

    -- Allow public access to apartment images
    CREATE POLICY "Apartment images are publicly accessible."
      ON storage.objects FOR SELECT
      USING (bucket_id = 'apartments');
      
    -- Allow authenticated users to upload apartment images
    CREATE POLICY "Users can upload apartment images."
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'apartments');
      
    -- Allow users to update their apartment images
    CREATE POLICY "Users can update apartment images."
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'apartments');
      
    -- Allow users to delete their apartment images
    CREATE POLICY "Users can delete apartment images."
      ON storage.objects FOR DELETE
      USING (bucket_id = 'apartments');
  END IF;
END $$;

-- Add RLS (Row Level Security) to tables
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;

-- Create policies for cars table
CREATE POLICY "Cars are viewable by everyone" 
  ON cars FOR SELECT 
  USING (true);

CREATE POLICY "Cars can be inserted by authenticated users" 
  ON cars FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Cars can be updated by authenticated users" 
  ON cars FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Cars can be deleted by authenticated users" 
  ON cars FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create policies for apartments table
CREATE POLICY "Apartments are viewable by everyone"
  ON apartments FOR SELECT
  USING (true);

CREATE POLICY "Apartments can be inserted by authenticated users"
  ON apartments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Apartments can be updated by authenticated users"
  ON apartments FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Apartments can be deleted by authenticated users"
  ON apartments FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- HOTELS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  room_name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  description TEXT,
  price_single NUMERIC(10,2) NOT NULL,
  price_double NUMERIC(10,2) NOT NULL,
  price_triple NUMERIC(10,2) NOT NULL,
  bathroom INTEGER DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotels are viewable by everyone"
  ON hotels FOR SELECT
  USING (true);

CREATE POLICY "Hotels can be inserted by authenticated users"
  ON hotels FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Hotels can be updated by authenticated users"
  ON hotels FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Hotels can be deleted by authenticated users"
  ON hotels FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- VILLAS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS villas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  room_name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  bathroom INTEGER DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE villas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Villas are viewable by everyone"
  ON villas FOR SELECT
  USING (true);

CREATE POLICY "Villas can be inserted by authenticated users"
  ON villas FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Villas can be updated by authenticated users"
  ON villas FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Villas can be deleted by authenticated users"
  ON villas FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS FOR HOTELS AND VILLAS
-- ============================================================
DO $$
BEGIN
  -- Create hotels bucket if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_policies
    WHERE policyname = 'Hotel images are publicly accessible.'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('hotels', 'hotels', true)
    ON CONFLICT (id) DO NOTHING;

    CREATE POLICY "Hotel images are publicly accessible."
      ON storage.objects FOR SELECT
      USING (bucket_id = 'hotels');

    CREATE POLICY "Users can upload hotel images."
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'hotels');

    CREATE POLICY "Users can update hotel images."
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'hotels');

    CREATE POLICY "Users can delete hotel images."
      ON storage.objects FOR DELETE
      USING (bucket_id = 'hotels');
  END IF;

  -- Create villas bucket if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_policies
    WHERE policyname = 'Villa images are publicly accessible.'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('villas', 'villas', true)
    ON CONFLICT (id) DO NOTHING;

    CREATE POLICY "Villa images are publicly accessible."
      ON storage.objects FOR SELECT
      USING (bucket_id = 'villas');

    CREATE POLICY "Users can upload villa images."
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'villas');

    CREATE POLICY "Users can update villa images."
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'villas');

    CREATE POLICY "Users can delete villa images."
      ON storage.objects FOR DELETE
      USING (bucket_id = 'villas');
  END IF;
END $$;

-- ============================================================
-- ADD MULTILINGUAL FIELDS TO HOTELS AND VILLAS
-- ============================================================
ALTER TABLE hotels
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS name_bs TEXT,
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_bs TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT;

ALTER TABLE villas
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS name_bs TEXT,
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_bs TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT;
