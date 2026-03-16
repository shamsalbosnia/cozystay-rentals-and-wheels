import { NameTranslations } from './hotel';

export interface VillaRoom {
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

export interface GroupedVilla {
  id: string;
  name: string;
  location: string;
  rating: number;
  rooms: VillaRoom[];
  nameTranslations?: NameTranslations;
  descriptionTranslations?: NameTranslations;
}
