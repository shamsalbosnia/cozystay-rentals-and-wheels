
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BedDouble, Bath, ArrowRight, MapPin, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import BookingModal from "./BookingModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface ApartmentCardProps {
  apartment: {
    id: number;
    name: string;
    image: string;
    pricePerNight: number;
    location: string;
    beds: number;
    bathrooms: number;
    size: string;
    features: string[];
  };
  className?: string;
}

const ApartmentCard = ({ apartment, className }: ApartmentCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "glass-card rounded-2xl overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={apartment.image}
          alt={apartment.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">{apartment.name}</h3>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{apartment.location}</span>
        </div>

        <div className="flex items-center gap-4 py-3 border-y border-border my-3">
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {apartment.beds}{" "}
              {apartment.beds > 1
                ? t("apartments.beds")
                : t("apartments.bed")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {apartment.bathrooms}{" "}
              {apartment.bathrooms > 1
                ? t("apartments.bathrooms")
                : t("apartments.bathroom")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{apartment.size}</span>
          </div>
        </div>

        <div className="mb-4 flex-1">
          <h4 className="text-sm font-medium mb-2">{t("apartments.features")}:</h4>
          <ul className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
            {apartment.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 text-primary p-0.5">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
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
          <span>{t("common.bookNow")}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        type="apartment"
        itemName={apartment.name}
      />
    </div>
  );
};

export default ApartmentCard;
