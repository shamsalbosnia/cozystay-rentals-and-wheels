export interface NameTranslations {
  en: string;
  bs: string;
  ar: string;
}

export interface RoomPrice {
  single: number;
  double: number;
  triple: number;
  [key: string]: number;
}

export interface HotelRoom {
  id: string;
  name: string;
  description: string;
  prices: RoomPrice;
  bathroom: number;
  roomType: string;
  features: string[];
  images: string[];
  availability: boolean;
}

export interface GroupedHotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  rooms: HotelRoom[];
  nameTranslations?: NameTranslations;
  descriptionTranslations?: NameTranslations;
}
