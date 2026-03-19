import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BedDouble, Bath, Star, MapPin, Euro } from "lucide-react";
import { GroupedApartment } from "@/types/apartment";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingModal from "./BookingModal";

interface ApartmentPropertyCardProps {
  apartment: GroupedApartment;
}

const ApartmentPropertyCard = ({ apartment }: ApartmentPropertyCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { t } = useLanguage();

  const lowestPrice = Math.min(...apartment.rooms.map(room => room.price));
  const mainImage = apartment.rooms[0]?.images[0] || "/placeholder.svg";
  const selectedRoom = apartment.rooms[0];

  const getFeatureTranslation = (feature: string) => {
    const translationKey = `card.features.${feature}`;
    const translation = t(translationKey);
    return translation && !translation.startsWith("card.features.") ? translation : feature;
  };

  const getApartmentNameTranslation = (name: string) => {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '');
    const translationKey = `apartments.name.${normalizedName}`;
    const translation = t(translationKey);
    return translation && !translation.startsWith("apartments.name.") ? translation : name;
  };

  const getLocationTranslation = (location: string) => {
    const normalizedLocation = location.toLowerCase().replace(/\s+/g, '');
    const translationKey = `cities.${normalizedLocation}`;
    const translation = t(translationKey);
    return translation && !translation.startsWith("cities.") ? translation : location;
  };

  const getRoomsText = (count: number) => {
    return count === 1 ? t("apartments.room") : t("apartments.rooms");
  };

  const getBathroomsText = (count: number) => {
    return count === 1 ? t("apartments.bathroom") : t("apartments.bathrooms");
  };

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-md">
        <div className="relative overflow-hidden">
          <AspectRatio ratio={4/3}>
            <img
              src={mainImage}
              alt={getApartmentNameTranslation(apartment.name)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </AspectRatio>
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              Apartment
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary/90 backdrop-blur-sm flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {apartment.rating}
            </Badge>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold">{getApartmentNameTranslation(apartment.name)}</h3>
          </div>

          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{getLocationTranslation(apartment.location)}</span>
          </div>

          <div className="flex items-center gap-4 py-3 border-y border-border mb-4">
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{apartment.rooms.length} {getRoomsText(apartment.rooms.length)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{apartment.rooms[0]?.bathroom || 1} {getBathroomsText(apartment.rooms[0]?.bathroom || 1)}</span>
            </div>
          </div>

          <div className="mb-4 flex-1">
            <h4 className="text-sm font-medium mb-2">{t("apartments.features")}:</h4>
            <div className="flex flex-wrap gap-1">
              {apartment.rooms[0]?.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {getFeatureTranslation(feature)}
                </Badge>
              ))}
              {apartment.rooms[0]?.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{apartment.rooms[0].features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Euro className="h-4 w-4" />
              <span className="text-2xl font-bold">{lowestPrice}</span>
              <span className="text-sm text-muted-foreground">/ {t("apartments.perNight")}</span>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full rounded-full mt-auto">
                {t("apartments.viewDetails")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{getApartmentNameTranslation(apartment.name)}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <AspectRatio ratio={16/10} className="mb-4">
                    <img
                      src={selectedRoom.images[0] || "/placeholder.svg"}
                      alt={getApartmentNameTranslation(apartment.name)}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </AspectRatio>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedRoom.images.slice(1, 4).map((image, index) => (
                      <AspectRatio key={index} ratio={1}>
                        <img
                          src={image}
                          alt={`${getApartmentNameTranslation(apartment.name)} ${index + 2}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </AspectRatio>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedRoom.name}</h3>
                    <p className="text-muted-foreground">{selectedRoom.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {getFeatureTranslation(feature)}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    €{selectedRoom.price} <span className="text-base font-normal text-muted-foreground">{t("apartments.perNight")}</span>
                  </div>
                  <Button onClick={handleBookNow} className="w-full" size="lg">
                    {t("apartments.bookNow")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        type="apartment"
        itemName={getApartmentNameTranslation(apartment.name)}
        apartmentId={parseInt(apartment.rooms[0]?.id || '0')}
      />
    </>
  );
};

export default ApartmentPropertyCard;
