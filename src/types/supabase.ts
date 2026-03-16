export interface Car {
  id?: number;
  name: string;
  image_url: string;
  images: string[];
  price_per_day: number;
  type: string;
  seats: number;
  transmission: string;
  features: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CarReservation {
  id?: number;
  car_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
  car?: Car;
}

export interface Apartment {
  id?: number;
  address: string;
  city: string;
  rooms: number;
  size: number;
  price: number;
  image_url?: string;
  created_at?: string;
}

export interface Hotel {
  id?: number;
  name: string;
  location: string;
  rating: number;
  room_name: string;
  room_type: string;
  description?: string;
  price_single: number;
  price_double: number;
  price_triple: number;
  bathroom: number;
  features: string[];
  images: string[];
  availability: boolean;
  // Multilingual fields
  name_en?: string;
  name_bs?: string;
  name_ar?: string;
  description_en?: string;
  description_bs?: string;
  description_ar?: string;
  created_at?: string;
}

export interface Villa {
  id?: number;
  name: string;
  location: string;
  rating: number;
  room_name: string;
  room_type: string;
  description?: string;
  price: number;
  bathroom: number;
  features: string[];
  images: string[];
  availability: boolean;
  // Multilingual fields
  name_en?: string;
  name_bs?: string;
  name_ar?: string;
  description_en?: string;
  description_bs?: string;
  description_ar?: string;
  created_at?: string;
}
