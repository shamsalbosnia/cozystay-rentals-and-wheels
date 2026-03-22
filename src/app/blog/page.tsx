import { Metadata } from 'next';
import Blog from '@/views/Blog';

export const metadata: Metadata = {
  title: 'Bosnia & Herzegovina Travel Guide | Shams Al Bosnia Blog',
  description: 'Discover Bosnia & Herzegovina through our travel guides. City guides for Sarajevo and Mostar, attraction reviews, road trip routes and seasonal travel tips.',
  openGraph: {
    title: 'Bosnia & Herzegovina Travel Guide | Shams Al Bosnia',
    description: 'Travel guides, city highlights, attractions and tips for visiting Bosnia & Herzegovina.',
    url: 'https://www.shamsalbosnia.com/blog',
    images: [{ url: 'https://www.shamsalbosnia.com/lovable-uploads/stari-most.jpg', width: 1200, height: 630 }],
  },
};

export default function BlogPage() {
  return <Blog />;
}
