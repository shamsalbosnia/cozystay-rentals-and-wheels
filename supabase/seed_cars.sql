INSERT INTO public.cars (name, image_url, price_per_day, type, seats, transmission, features) VALUES
  ('Mercedes S-Class', 'https://images.unsplash.com/photo-1575650557914-d7e042c38409', 150, 'Luxury Sedan', 5, 'Automatic', '{"Leather Seats","Navigation","Premium Sound"}'),
  ('BMW X5', 'https://images.unsplash.com/photo-1520031441872-956195501c07', 120, 'SUV', 5, 'Automatic', '{"Panoramic Roof","Heated Seats","Cruise Control"}'),
  ('Audi A4', 'https://images.unsplash.com/photo-1504972090022-6bdb113c424a', 100, 'Sedan', 5, 'Automatic', '{"Bluetooth","Backup Camera","Keyless Entry"}'),
  ('Tesla Model 3', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89', 140, 'Electric', 5, 'Automatic', '{"Autopilot","Long Range Battery","Premium Interior"}'),
  ('Range Rover Sport', 'https://images.unsplash.com/photo-1550355291-bbee04a92027', 180, 'Luxury SUV', 7, 'Automatic', '{"Off-Road Capability","Premium Audio","Leather Interior"}'),
  ('Porsche 911', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', 250, 'Sports Car', 2, 'Manual', '{"High Performance","Sport Mode","Carbon Fiber Interior"}'),
  ('Jeep Wrangler', 'https://images.unsplash.com/photo-1528040118031-37490bb9d219', 90, 'SUV', 4, 'Manual', '{"4x4","Removable Top","Off-Road Tires"}'),
  ('Cadillac Escalade', 'https://images.unsplash.com/photo-1531154486971-b609e9e68dd6', 200, 'Luxury SUV', 7, 'Automatic', '{"Premium Sound","Leather Seats","Advanced Safety Features"}'),
  ('Toyota Camry', 'https://images.unsplash.com/photo-1559416523-140ddc3d238c', 70, 'Sedan', 5, 'Automatic', '{"Fuel Efficient","Backup Camera","Bluetooth"}')
ON CONFLICT DO NOTHING;
