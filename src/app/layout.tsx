import type { Metadata } from 'next';
import { Tajawal, Playfair_Display } from 'next/font/google';
import { Providers } from './Providers';
import '@/index.css';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  display: 'swap',
  variable: '--font-tajawal',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

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
    <html lang="en" suppressHydrationWarning className={`${tajawal.variable} ${playfair.variable}`}>
      <head />
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: 'Shams Al Bosnia',
              url: 'https://www.shamsalbosnia.com',
              logo: 'https://www.shamsalbosnia.com/lovable-uploads/shams-albosnia-logo.png',
              image: 'https://www.shamsalbosnia.com/og-image.jpg',
              description: 'Car rentals, hotels, villas, apartments and tour packages in Bosnia & Herzegovina.',
              telephone: '+38761228100',
              email: 'info@shamsalbosnia.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Milana Perloga 14a',
                addressLocality: 'Sarajevo',
                postalCode: '71000',
                addressCountry: 'BA',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 43.8563,
                longitude: 18.4131,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                opens: '08:00',
                closes: '20:00',
              },
              sameAs: ['https://www.shamsalbosnia.com'],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Travel Services',
                itemListElement: [
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Car Rental Bosnia' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hotel Booking Bosnia' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tour Packages Bosnia' } },
                ],
              },
            }),
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
