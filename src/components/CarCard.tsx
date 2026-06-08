
import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Car, Users, Gauge, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import BookingModal from "./BookingModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarCardProps {
  car: {
    id: number;
    name: string;
    image: string;
    images?: string[];
    pricePerDay: number;
    type: string;
    seats: number;
    transmission: string;
    features: string[];
  };
  carId?: number;
  className?: string;
}

const CarCard = ({ car, carId, className }: CarCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();

  // Build the full images list — deduplicate fallback
  const allImages: string[] = (() => {
    const imgs = car.images?.filter(Boolean) ?? [];
    if (imgs.length > 0) return imgs;
    if (car.image) return [car.image];
    return [];
  })();

  const hasMultiple = allImages.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    setActiveIndex(emblaApi.selectedScrollSnap() === 0 ? allImages.length - 1 : emblaApi.selectedScrollSnap() - 1);
  }, [emblaApi, allImages.length]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!emblaApi) return;
    emblaApi.scrollNext();
    setActiveIndex(emblaApi.selectedScrollSnap() === allImages.length - 1 ? 0 : emblaApi.selectedScrollSnap() + 1);
  }, [emblaApi, allImages.length]);

  // Keep dot indicator in sync
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Register the select listener once emblaApi is ready
  if (emblaApi) {
    emblaApi.on("select", onSelect);
  }

  return (
    <div className={cn(
      "glass-card rounded-2xl overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-md",
      className
    )}>
      {/* Image carousel */}
      <div className="relative overflow-hidden h-48 bg-muted">
        {hasMultiple ? (
          <>
            <div ref={emblaRef} className="overflow-hidden h-full w-full">
              <div className="flex h-full">
                {allImages.map((src, i) => (
                  <div key={i} className="relative flex-[0_0_100%] h-full">
                    <img
                      src={src}
                      alt={`${car.name} — photo ${i + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Prev / Next arrows — visible on hover */}
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                         w-7 h-7 rounded-full bg-black/50 text-white
                         flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         hover:bg-black/70"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                         w-7 h-7 rounded-full bg-black/50 text-white
                         flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         hover:bg-black/70"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Image count badge */}
            <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-md">
              {activeIndex + 1}/{allImages.length}
            </div>
          </>
        ) : (
          <img
            src={allImages[0] ?? car.image}
            alt={car.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">{car.name}</h3>
          <span className="text-sm font-medium text-muted-foreground">{car.type}</span>
        </div>

        <div className="flex items-center gap-4 py-3 border-y border-border my-3">
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{car.seats} {t("cars.seats")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{t("cars.unlimited")}</span>
          </div>
        </div>

        <div className="mb-4 flex-1">
          <h4 className="text-sm font-medium mb-2">{t("cars.features")}:</h4>
          <ul className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
            {car.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 text-primary p-0.5">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button
          className="w-full justify-between group rounded-full mt-auto"
          onClick={() => setIsBookingModalOpen(true)}
        >
          <span>{t("cars.book")}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        type="car"
        itemName={car.name}
        carId={carId || car.id}
      />
    </div>
  );
};

export default CarCard;
