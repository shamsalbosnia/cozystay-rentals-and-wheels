import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { idFromCarSlug } from '@/lib/slug';
import CarDetail from '@/views/CarDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCar(slug: string) {
  const id = idFromCarSlug(slug);
  if (isNaN(id)) return null;

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('cars')
    .select('id, name, type, image_url, price_per_day')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  return data ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCar(slug);

  if (!car) {
    return { title: 'Car not found | Shams Al Bosnia' };
  }

  return {
    title: `${car.name} | Car Rental Bosnia | Shams Al Bosnia`,
    description: `Rent the ${car.name} (${car.type}) in Bosnia & Herzegovina. ${car.price_per_day} BAM/day — unlimited mileage, no hidden fees. Book now.`,
    openGraph: {
      title: `${car.name} — ${car.price_per_day} BAM/day`,
      description: `Premium ${car.type} rental in Bosnia. Book the ${car.name} online.`,
      images: car.image_url ? [{ url: car.image_url, width: 1200, height: 630 }] : [],
      url: `https://www.shamsalbosnia.com/cars/${slug}`,
    },
  };
}

export default async function CarPage({ params }: Props) {
  const { slug } = await params;
  const id = idFromCarSlug(slug);
  if (isNaN(id)) notFound();

  return <CarDetail carId={id} />;
}
