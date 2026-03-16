
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BedOption {
  id: string;
  label: string;
  capacity: number;
}

const bedOptions: BedOption[] = [
  { id: "single", label: "Single", capacity: 1 },
  { id: "double", label: "Double", capacity: 2 },
  { id: "triple", label: "Triple", capacity: 3 }
];

interface BedSelectorProps {
  selectedBedOption: string;
  onBedOptionChange: (value: string) => void;
}

const BedSelector = ({ selectedBedOption, onBedOptionChange }: BedSelectorProps) => {
  const { t } = useLanguage();

  return (
    <Tabs 
      defaultValue={selectedBedOption} 
      value={selectedBedOption} 
      onValueChange={onBedOptionChange} 
      className="mb-4"
    >
      <TabsList className="w-full grid grid-cols-3">
        {bedOptions.map((option) => (
          <TabsTrigger key={option.id} value={option.id} className="text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{t(`card.bedTypes.${option.id}`)}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default BedSelector;
export { bedOptions };
export type { BedOption };
