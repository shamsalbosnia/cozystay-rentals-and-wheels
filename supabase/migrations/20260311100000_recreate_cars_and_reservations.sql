-- Drop old cars table (had wrong schema: make, model, year, color, price)
DROP TABLE IF EXISTS public.cars CASCADE;

-- Cars table matching the CarCard UI
CREATE TABLE public.cars (
  id serial PRIMARY KEY,
  name text NOT NULL,
  image_url text,
  price_per_day integer NOT NULL,
  type text NOT NULL,
  seats integer NOT NULL DEFAULT 5,
  transmission text NOT NULL DEFAULT 'Automatic',
  features text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cars_is_active ON public.cars (is_active) WHERE is_active = true;

-- Car reservations table
CREATE TABLE public.car_reservations (
  id serial PRIMARY KEY,
  car_id integer NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

CREATE INDEX idx_car_reservations_lookup ON public.car_reservations (car_id, start_date, end_date);
CREATE INDEX idx_car_reservations_status ON public.car_reservations (status);

-- updated_at triggers
CREATE TRIGGER cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER car_reservations_updated_at
  BEFORE UPDATE ON public.car_reservations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cars are publicly readable" ON public.cars FOR SELECT USING (true);
CREATE POLICY "Reservations are publicly readable" ON public.car_reservations FOR SELECT USING (true);
CREATE POLICY "Anyone can create a reservation request" ON public.car_reservations FOR INSERT WITH CHECK (true);
