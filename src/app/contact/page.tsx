import { Metadata } from 'next';
import Contact from '@/views/Contact';

export const metadata: Metadata = {
  title: 'Contact Us | Shams Al Bosnia',
  description: 'Get in touch with Shams Al Bosnia. We are based in Sarajevo, Bosnia & Herzegovina. Call us or send a message for car rentals, accommodation and tour inquiries.',
  openGraph: {
    title: 'Contact Shams Al Bosnia',
    description: 'Based in Sarajevo, Bosnia & Herzegovina. Contact us for car rentals, accommodation and tours.',
    url: 'https://www.shamsalbosnia.com/contact',
    images: [{ url: 'https://www.shamsalbosnia.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return <Contact />;
}
