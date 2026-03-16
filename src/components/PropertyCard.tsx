import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { GroupedHotel } from "@/types/hotel";
import BedSelector, { bedOptions, BedOption } from "./property/BedSelector";
import PriceDisplay from "./property/PriceDisplay";
import PropertyFeatures from "./property/PropertyFeatures";
import PropertyImage from "./property/PropertyImage";
import PropertyDetailModal from "./PropertyDetailModal";

interface PropertyCardProps {
  hotel: GroupedHotel;
  className?: string;
}

const PropertyCard = ({ hotel, className }: PropertyCardProps) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBedOption, setSelectedBedOption] = useState<string>("double");
  const { t, language } = useLanguage();

  const hasMultipleRooms = hotel.rooms.length > 1;
  const defaultRoom = hotel.rooms[0];
  
  // Find the room that matches the selected bed option
  const selectedRoom = hotel.rooms.find(room => {
    const roomBedType = room.roomType.toLowerCase();
    return roomBedType.includes(selectedBedOption) || 
           (selectedBedOption === "single" && roomBedType.includes("single")) ||
           (selectedBedOption === "double" && (roomBedType.includes("double") || roomBedType.includes("dbl"))) ||
           (selectedBedOption === "triple" && (roomBedType.includes("triple") || roomBedType.includes("trpl")));
  }) || defaultRoom;
  
  const roomImageUrl = selectedRoom.images.length > 0 
    ? selectedRoom.images[0] 
    : "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2070&auto=format&fit=crop";

  // Get the selected bed option
  const currentBedOption = bedOptions.find(option => option.id === selectedBedOption) || bedOptions[1];

  const handlePropertyClick = () => {
    setIsDetailModalOpen(true);
  };

  // Get hotel display name - use DB translations if available, otherwise fall back to translation key
  const getHotelName = () => {
    if (hotel.nameTranslations) {
      return hotel.nameTranslations[language] || hotel.name;
    }
    const key = `card.hotels.${hotel.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`;
    return t(key, hotel.name);
  };

  // Get room description - use DB translations if available, otherwise fall back to translation key
  const getRoomDescription = () => {
    if (hotel.descriptionTranslations) {
      return hotel.descriptionTranslations[language] || selectedRoom.description;
    }
    const hotelKey = hotel.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    const roomKey = selectedRoom.roomType.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    const key = roomKey
      ? `card.rooms.${hotelKey}.${roomKey}.description`
      : `card.rooms.${hotelKey}.description`;
    return t(key, selectedRoom.description || '');
  };

  // Function to generate city translation key
  const getCityTranslationKey = (cityName: string) => {
    if (!cityName) return "cities.bosnia";
    return `cities.${cityName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`;
  };

  // Function to get translated room type
  const getRoomTypeTranslation = (roomType: string) => {
    if (!roomType) return "Hotel Room";
    const roomTypeKey = `roomType.${roomType.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`;
    const translation = t(roomTypeKey);
    return translation && !translation.startsWith("roomType.") ? translation : roomType;
  };

  const hotelName = getHotelName();

  return (
    <div
      className={cn(
        "glass-card rounded-2xl overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <PropertyImage 
        imageUrl={roomImageUrl}
        hotelName={hotelName}
        rating={hotel.rating}
      />

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="text-xl font-semibold">{hotelName}</h3>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{t(getCityTranslationKey(hotel.location), hotel.location)}</span>
        </div>

        <BedSelector 
          selectedBedOption={selectedBedOption}
          onBedOptionChange={setSelectedBedOption}
        />

        <PriceDisplay 
          room={selectedRoom}
          selectedBedOption={selectedBedOption}
          currentBedOption={currentBedOption}
        />

        <div className="mb-4 flex-1">
          <p className="text-sm text-muted-foreground mb-4">
            {getRoomDescription()}
          </p>
          <PropertyFeatures features={selectedRoom.features} />
        </div>

        <Button
          className="w-full justify-between group rounded-full mt-auto"
          onClick={handlePropertyClick}
        >
          <span>
            {hasMultipleRooms ? t("card.viewRoomOptions") : t("card.viewRoomDetails")}
          </span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Property detail modal */}
      <PropertyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        hotel={hotel}
        hotelName={hotelName}
        location={t(getCityTranslationKey(hotel.location), hotel.location)}
      />
    </div>
  );
};

export default PropertyCard;
