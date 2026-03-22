import { Metadata } from 'next';
import Apartments from '@/views/Apartments';

export const metadata: Metadata = {
  title: 'Hotels, Villas & Apartments in Bosnia | Shams Al Bosnia',
  description: 'Book hotels, villas and apartments in Bosnia & Herzegovina. Comfortable stays in Sarajevo, Mostar and across BiH. Best prices guaranteed.',
  openGraph: {
    title: 'Hotels, Villas & Apartments in Bosnia | Shams Al Bosnia',
    description: 'Book hotels, villas and apartments across Bosnia & Herzegovina.',
    url: 'https://www.shamsalbosnia.com/apartments',
    images: [{ url: 'https://www.shamsalbosnia.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function ApartmentsPage() {
  return <Apartments />;
}
