import { Euro, BedDouble, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HotelRoom } from "@/types/hotel";
import { BedOption } from "./BedSelector";

interface PriceDisplayProps {
  room: HotelRoom;
  selectedBedOption: string;
  currentBedOption: BedOption;
}

const PriceDisplay = ({ room, selectedBedOption, currentBedOption }: PriceDisplayProps) => {
  const { t } = useLanguage();

  const getPrice = (room: HotelRoom, bedType: string) => {
    return room.prices[bedType] || room.prices.double || 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculatedPrice = getPrice(room, selectedBedOption);

  return (
    <div className="flex items-center gap-4 py-3 border-y border-border my-3">
      <div className="flex items-center gap-1">
        <Euro className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          {formatCurrency(calculatedPrice)}
        </span>
        <span className="text-xs text-muted-foreground">{t("card.perNight")}</span>
      </div>
      <div className="flex items-center gap-1">
        <BedDouble className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          {room.roomType}
        </span>
      </div>
      <div className="flex items-center gap-1 ml-auto">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          {currentBedOption.capacity}
        </span>
      </div>
    </div>
  );
};

export default PriceDisplay;
