
export interface ApartmentRoom {
  id: string;
  name: string;
  description: string;
  price: number;
  bathroom: number;
  roomType: string;
  features: string[];
  images: string[];
  availability: boolean;
}

export interface GroupedApartment {
  id: string;
  name: string;
  location: string;
  rating: number;
  rooms: ApartmentRoom[];
}
