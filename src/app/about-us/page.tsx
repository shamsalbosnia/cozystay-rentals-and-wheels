import { Metadata } from 'next';
import AboutUs from '@/views/AboutUs';

export const metadata: Metadata = {
  title: 'About Us | Shams Al Bosnia',
  description: 'Learn about Shams Al Bosnia — your trusted travel partner in Bosnia & Herzegovina offering car rentals, luxury accommodations and tour packages.',
  openGraph: {
    title: 'About Us | Shams Al Bosnia',
    description: 'Your trusted travel partner in Bosnia & Herzegovina.',
    url: 'https://www.shamsalbosnia.com/about-us',
    images: [{ url: 'https://www.shamsalbosnia.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function AboutUsPage() {
  return <AboutUs />;
}
