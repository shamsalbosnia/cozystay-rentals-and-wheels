import { Metadata } from 'next';
import Cars from '@/views/Cars';

export const metadata: Metadata = {
  title: 'Car Rentals in Bosnia & Herzegovina | Shams Al Bosnia',
  description: 'Rent a car in Bosnia & Herzegovina. Wide selection of vehicles — Sedan, SUV, Luxury and more. Best prices, flexible pickup in Sarajevo and Mostar.',
  openGraph: {
    title: 'Car Rentals Bosnia & Herzegovina | Shams Al Bosnia',
    description: 'Rent a car in Bosnia — Sedan, SUV, Luxury vehicles. Flexible pickup in Sarajevo and Mostar.',
    url: 'https://www.shamsalbosnia.com/cars',
    images: [{ url: 'https://www.shamsalbosnia.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function CarsPage() {
  return <Cars />;
}
