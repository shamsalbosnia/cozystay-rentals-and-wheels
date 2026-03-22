import type { Metadata } from 'next';
import { Providers } from './Providers';
import '@/index.css';

export const metadata: Metadata = {
  title: 'شمس البوسنة | Shams Albosnia',
  description: 'Your refined gateway to the beauty of Bosnia and Herzegovina - Car rentals, accommodations, tour bundles.',
  openGraph: {
    title: 'شمس البوسنة | Shams Albosnia',
    description: 'Your refined gateway to the beauty of Bosnia and Herzegovina - Car rentals, accommodations, tour bundles.',
    url: 'https://www.shamsalbosnia.com',
    siteName: 'Shams Albosnia',
    images: [
      {
        url: 'https://www.shamsalbosnia.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Shams Albosnia',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شمس البوسنة | Shams Albosnia',
    description: 'Your refined gateway to the beauty of Bosnia and Herzegovina - Car rentals, accommodations, tour bundles.',
    images: ['https://www.shamsalbosnia.com/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
