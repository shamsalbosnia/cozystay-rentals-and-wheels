import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Providers } from './Providers';
import '@/index.css';

export const metadata: Metadata = {
  title: 'شمس البوسنة | Shams Albosnia',
  description: 'Your refined gateway to the beauty of Bosnia and Herzegovina - Car rentals, accommodations, tour bundles.',
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
        <Analytics />
      </body>
    </html>
  );
}
