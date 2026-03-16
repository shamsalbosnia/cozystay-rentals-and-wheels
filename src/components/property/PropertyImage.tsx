
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyImageProps {
  imageUrl: string;
  hotelName: string;
  rating: number;
}

const PropertyImage = ({ imageUrl, hotelName, rating }: PropertyImageProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden h-48">
      <img
        src={imageUrl}
        alt={hotelName}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-0 right-0 bg-primary/90 text-white px-3 py-1 rounded-bl-lg font-medium">
        {t("card.hotel")}
      </div>
      {rating > 0 && (
        <div className="absolute bottom-0 left-0 bg-black/60 text-white px-3 py-1 rounded-tr-lg font-medium flex items-center">
          <Star className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" />
          <span>{rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
};

export default PropertyImage;
