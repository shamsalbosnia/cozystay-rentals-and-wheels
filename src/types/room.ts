
export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  size: number;
  images: string[];
  amenities: string[];
  availability: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
  roomTypes: RoomType[];
}
