
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, Users, Gauge, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import BookingModal from "./BookingModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarCardProps {
  car: {
    id: number;
    name: string;
    image: string;
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
  const { t } = useLanguage();

  return (
    <div className={cn(
      "glass-card rounded-2xl overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-md", 
      className
    )}>
      <div className="relative overflow-hidden h-48">
        <img 
          src={car.image} 
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
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
