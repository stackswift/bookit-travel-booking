export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration_hours: number;
  rating: number;
  review_count: number;
  image_url: string;
  category: string;
  highlights: string[];
  included: string[];
  created_at: string;
}

export interface Slot {
  id: string;
  experience_id: string;
  date: string;
  time: string;
  available_spots: number;
  max_spots: number;
}

export interface Booking {
  id: string;
  slot_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  num_guests: number;
  total_price: number;
  promo_code?: string;
  discount_amount: number;
  status: string;
  created_at: string;
}

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_amount: number;
}
