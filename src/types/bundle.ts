
export interface Bundle {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: number;
  pricePerPerson: number;
  pricePerGroup: number;
  maxGroupSize: number;
  regions: string[];
  tags: string[];
  highlights: string[];
  includes: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  images: string[];
  addons?: {
    name: string;
    price: number;
  }[];
}
