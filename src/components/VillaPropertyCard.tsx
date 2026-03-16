
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, Bath } from "lucide-react";
import { GroupedVilla } from "@/types/villa";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import BookingModal from "@/components/BookingModal";

interface VillaPropertyCardProps {
  villa: GroupedVilla;
}

const VillaPropertyCard = ({ villa }: VillaPropertyCardProps) => {
  const { t, language } = useLanguage();
  const [selectedRoom, setSelectedRoom] = useState(villa.rooms[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const getFeatureTranslation = (feature: string) => {
    const translationKey = `card.features.${feature}`;
    const translation = t(translationKey);
    return translation && !translation.startsWith("card.features.") ? translation : feature;
  };

  const getVillaName = () => {
    if (villa.nameTranslations) {
      return villa.nameTranslations[language] || villa.name;
    }
    const normalizedName = villa.name.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/&/g, '&')
      .replace(/,/g, '')
      .replace(/\./g, '');
    const translationKey = `villas.name.${normalizedName}`;
    const translation = t(translationKey);
    return translation && !translation.startsWith("villas.name.") ? translation : villa.name;
  };

  const getLocationTranslation = (location: string) => {
    const normalizedLocation = location.toLowerCase().replace(/\s+/g, '');
    const translationKey = `cities.${normalizedLocation}`;
    const translation = t(translationKey);
    return translation && !translation.startsWith("cities.") ? translation : location;
  };

  const getBathroomsText = (count: number) => {
    return count === 1 ? t("villas.bathroom") : t("villas.bathrooms");
  };

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  const villaName = getVillaName();

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardHeader className="p-0">
          <AspectRatio ratio={16/10}>
            <img
              src={selectedRoom.images[0] || "/placeholder.svg"}
              alt={villaName}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </CardHeader>
        
        <CardContent className="p-4 flex-grow">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{villaName}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {getLocationTranslation(villa.location)}
              </div>
            </div>
            <div className="flex items-center bg-primary/10 rounded-full px-2 py-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{villa.rating}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">€{selectedRoom.price}</span>
              <span className="text-sm text-muted-foreground">{t("villas.perNight")}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{selectedRoom.roomType}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{selectedRoom.bathroom} {getBathroomsText(selectedRoom.bathroom)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {selectedRoom.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {getFeatureTranslation(feature)}
                </Badge>
              ))}
              {selectedRoom.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedRoom.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">{t("villas.viewDetails")}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{villaName}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <AspectRatio ratio={16/10} className="mb-4">
                    <img
                      src={selectedRoom.images[0] || "/placeholder.svg"}
                      alt={villaName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </AspectRatio>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedRoom.images.slice(1, 4).map((image, index) => (
                      <AspectRatio key={index} ratio={1}>
                        <img
                          src={image}
                          alt={`${villaName} ${index + 2}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </AspectRatio>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedRoom.name}</h3>
                    <p className="text-muted-foreground">
                      {villa.descriptionTranslations
                        ? villa.descriptionTranslations[language] || selectedRoom.description
                        : selectedRoom.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {getFeatureTranslation(feature)}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    €{selectedRoom.price} <span className="text-base font-normal text-muted-foreground">{t("villas.perNight")}</span>
                  </div>
                  <Button onClick={handleBookNow} className="w-full" size="lg">
                    {t("villas.bookNow")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        type="villa"
        itemName={`${villaName} - ${selectedRoom.name}`}
      />
    </>
  );
};

export default VillaPropertyCard;
