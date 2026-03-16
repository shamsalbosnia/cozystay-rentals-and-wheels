-- Seed: default admin (run migrations first)
-- Password: admin123 (change in production!)
INSERT INTO public.admins (email, password_hash, full_name, role)
VALUES (
  'admin@cozystay.com',
  crypt('admin123', gen_salt('bf')),
  'Administrator',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
