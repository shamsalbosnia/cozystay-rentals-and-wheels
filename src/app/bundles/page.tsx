import { Metadata } from 'next';
import Bundles from '@/views/Bundles';

export const metadata: Metadata = {
  title: 'Tour Packages Bosnia & Herzegovina | Shams Al Bosnia',
  description: 'Explore Bosnia & Herzegovina with our curated tour packages. Sarajevo, Mostar, Kravica, national parks and more. Custom bundles available.',
  openGraph: {
    title: 'Tour Packages Bosnia & Herzegovina | Shams Al Bosnia',
    description: 'Curated tour packages across Bosnia & Herzegovina — Sarajevo, Mostar, Kravica and more.',
    url: 'https://www.shamsalbosnia.com/bundles',
    images: [{ url: 'https://www.shamsalbosnia.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function BundlesPage() {
  return <Bundles />;
}
