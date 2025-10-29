-- Create experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_hours INTEGER NOT NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create slots table
CREATE TABLE public.slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  available_spots INTEGER NOT NULL DEFAULT 10,
  max_spots INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(experience_id, date, time)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id UUID NOT NULL REFERENCES public.slots(id) ON DELETE RESTRICT,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  num_guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  promo_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create promo_codes table
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'percentage' or 'fixed'
  value DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Public read access for experiences and slots
CREATE POLICY "Anyone can view experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Anyone can view slots" ON public.slots FOR SELECT USING (true);
CREATE POLICY "Anyone can view promo codes" ON public.promo_codes FOR SELECT USING (true);

-- Allow anyone to create bookings
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their bookings" ON public.bookings FOR SELECT USING (true);

-- Insert sample promo codes
INSERT INTO public.promo_codes (code, type, value, min_amount, active) VALUES
('SAVE10', 'percentage', 10, 0, true),
('FLAT100', 'fixed', 100, 500, true);

-- Insert sample experiences
INSERT INTO public.experiences (title, description, location, price, duration_hours, rating, review_count, image_url, category, highlights, included) VALUES
('Scuba Diving Adventure', 'Dive into crystal-clear waters and explore vibrant coral reefs teeming with marine life. Perfect for beginners and experienced divers alike.', 'Maldives', 4500, 3, 4.9, 234, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'Water Sports', ARRAY['Professional instructor', 'All equipment included', 'Underwater photography'], ARRAY['Diving gear', 'Safety equipment', 'Refreshments']),
('Mountain Trekking Expedition', 'Challenge yourself with breathtaking mountain trails offering panoramic views of snow-capped peaks and pristine valleys.', 'Himalayas', 3200, 6, 4.8, 156, 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', 'Adventure', ARRAY['Expert guide', 'Scenic viewpoints', 'Wildlife spotting'], ARRAY['Trekking poles', 'First aid kit', 'Snacks']),
('Cultural Heritage Tour', 'Immerse yourself in rich history and traditions. Visit ancient temples, palaces, and interact with local artisans.', 'Jaipur', 1800, 4, 4.7, 89, 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', 'Culture', ARRAY['Historical sites', 'Local guide', 'Traditional lunch'], ARRAY['Transportation', 'Entry fees', 'Lunch']),
('Hot Air Balloon Ride', 'Float above stunning landscapes at sunrise. Experience the magic of silent flight and capture unforgettable aerial views.', 'Cappadocia', 5500, 2, 5.0, 312, 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800', 'Aerial', ARRAY['Sunrise flight', 'Champagne toast', 'Flight certificate'], ARRAY['Balloon ride', 'Insurance', 'Breakfast']),
('Wildlife Safari', 'Embark on an exciting safari to spot majestic wildlife in their natural habitat. Elephants, lions, and more await!', 'Serengeti', 6200, 5, 4.9, 198, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', 'Nature', ARRAY['Game drive', 'Expert naturalist', 'Close encounters'], ARRAY['4x4 vehicle', 'Binoculars', 'Packed lunch']),
('Cooking Class Experience', 'Learn to prepare authentic local cuisine with a master chef. Take home recipes and new culinary skills.', 'Bangkok', 2100, 3, 4.6, 145, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', 'Food', ARRAY['Hands-on cooking', 'Market tour', 'Recipe booklet'], ARRAY['Ingredients', 'Apron', 'Meal']),
('Surfing Lessons', 'Ride the waves with professional instructors. From basics to advanced techniques, all levels welcome!', 'Bali', 2800, 2, 4.8, 267, 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800', 'Water Sports', ARRAY['Pro instructor', 'Beach location', 'Surfboard provided'], ARRAY['Surfboard', 'Wetsuit', 'Insurance']),
('Photography Walk', 'Capture stunning cityscapes and hidden gems with a professional photographer. Improve your skills while exploring.', 'Paris', 1500, 3, 4.7, 92, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'Culture', ARRAY['Pro photographer', 'Iconic locations', 'Editing tips'], ARRAY['Photography tips', 'Location guide', 'Refreshments']);

-- Create function to generate slots for experiences
CREATE OR REPLACE FUNCTION generate_slots_for_experience(exp_id UUID, num_days INTEGER DEFAULT 30)
RETURNS void AS $$
DECLARE
  slot_date DATE;
  slot_time TIME;
BEGIN
  FOR i IN 0..num_days-1 LOOP
    slot_date := CURRENT_DATE + i;
    -- Generate morning and afternoon slots
    INSERT INTO public.slots (experience_id, date, time, available_spots, max_spots)
    VALUES 
      (exp_id, slot_date, '09:00:00', 10, 10),
      (exp_id, slot_date, '14:00:00', 10, 10)
    ON CONFLICT (experience_id, date, time) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate slots for all experiences
DO $$
DECLARE
  exp_record RECORD;
BEGIN
  FOR exp_record IN SELECT id FROM public.experiences LOOP
    PERFORM generate_slots_for_experience(exp_record.id, 30);
  END LOOP;
END $$;