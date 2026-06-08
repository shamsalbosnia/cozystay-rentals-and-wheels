'use client';

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Car, Users, Gauge,
  Fuel, Wind, DoorOpen, ArrowLeft, Loader2, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BookingModal from "@/components/BookingModal";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";
import { cn } from "@/lib/utils";
import { Car as CarType } from "@/types/supabase";

interface CarDetailProps {
  carId: number;
}

const SPECS_ICONS: Record<string, React.ElementType> = {
  transmission: Car,
  seats: Users,
  mileage: Gauge,
  fuel: Fuel,
  ac: Wind,
  doors: DoorOpen,
};

const CarDetail = ({ carId }: CarDetailProps) => {
  const router = useRouter();
  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/cars/${carId}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(data => {
        if (data) { setCar(data); setLoading(false); }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [carId]);

  // All images: prefer images[] array, fall back to image_url
  const allImages: string[] = car
    ? (car.images?.filter(Boolean).length ? car.images.filter(Boolean) : [car.image_url].filter(Boolean))
    : [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (emblaApi) setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((i: number) => {
    emblaApi?.scrollTo(i);
  }, [emblaApi]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !car) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold">Car not found</p>
        <Button variant="outline" onClick={() => router.push("/cars")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Fleet
        </Button>
      </div>
    );
  }

  const specs = [
    { icon: Car,   label: "Transmission", value: car.transmission },
    { icon: Users, label: "Seats",         value: `${car.seats} passengers` },
    { icon: Gauge, label: "Mileage",       value: "Unlimited" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/cars" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Fleet
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{car.name}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* LEFT — Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main carousel */}
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
                <div ref={emblaRef} className="overflow-hidden h-full">
                  <div className="flex h-full">
                    {allImages.map((src, i) => (
                      <div key={i} className="relative flex-[0_0_100%] h-full">
                        <img
                          src={src}
                          alt={`${car.name} — photo ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading={i === 0 ? "eager" : "lazy"}
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => emblaApi?.scrollPrev()}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => emblaApi?.scrollNext()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                      {activeIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {allImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => scrollTo(i)}
                      className={cn(
                        "shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
                        i === activeIndex
                          ? "border-primary opacity-100"
                          : "border-transparent opacity-50 hover:opacity-75"
                      )}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* RIGHT — Info + Booking */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Type badge + name */}
              <div className="mb-4">
                <Badge variant="secondary" className="mb-3 text-xs uppercase tracking-wide">
                  {car.type}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{car.name}</h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">{car.price_per_day}</span>
                <span className="text-lg text-muted-foreground">BAM / day</span>
              </div>

              <Separator className="mb-6" />

              {/* Specs grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center text-center p-3 rounded-xl bg-accent/50 gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-sm font-semibold leading-tight">{value}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              {car.features?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Features & Extras
                  </h3>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {car.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-primary" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator className="mb-6" />

              {/* Included */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Always Included
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Unlimited mileage",
                    "Sarajevo airport pickup & drop-off",
                    "24/7 roadside assistance",
                    "No hidden fees",
                    "Free cancellation up to 24h before",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                className="w-full rounded-full text-base font-semibold"
                onClick={() => setIsBookingOpen(true)}
              >
                Reserve This Car
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                No payment required now — we'll confirm your booking within 24h
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <FooterSection />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        type="car"
        itemName={car.name}
        carId={car.id}
      />
    </div>
  );
};

export default CarDetail;
