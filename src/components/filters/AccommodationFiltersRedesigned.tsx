
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { X, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { AccommodationFilters } from "@/hooks/useAccommodationFilters";

interface AccommodationFiltersProps {
  filters: AccommodationFilters;
  showFilters: boolean;
  onFiltersChange: (filters: Partial<AccommodationFilters>) => void;
  onToggleFilters: () => void;
  onResetFilters: () => void;
}

const AccommodationFiltersRedesigned = ({
  filters,
  showFilters,
  onFiltersChange,
  onToggleFilters,
  onResetFilters
}: AccommodationFiltersProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleResetFilters = () => {
    onResetFilters();
    toast({
      description: "Filters have been reset",
    });
  };

  const locations = ['all', 'Sarajevo', 'Mostar', 'Konjic', 'Travnik', 'Jajce', 'Bihac', 'Vlasic'];
  const accommodationTypes = [
    { value: 'all', label: t('accommodations.type.all') },
    { value: 'hotel', label: t('accommodations.type.hotel') },
    { value: 'apartment', label: t('accommodations.type.apartment') },
    { value: 'villa', label: t('accommodations.type.villa') }
  ];

  // Function to get location translation key
  const getLocationTranslationKey = (location: string) => {
    if (location === 'all') {
      return 'accommodations.allLocations';
    }
    return `cities.${location.toLowerCase()}`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-8 bg-background/95 backdrop-blur-sm shadow-lg border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t("accommodations.filters")}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleResetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-2" />
          {t("accommodations.resetFilters")}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Accommodation Type filter */}
        <div className="space-y-4">
          <Label className="text-base font-medium">{t("accommodations.type")}</Label>
          <div className="flex flex-wrap gap-2">
            {accommodationTypes.map((type) => (
              <Badge
                key={type.value}
                variant={filters.accommodationType === type.value ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105",
                  filters.accommodationType === type.value 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-muted border-2"
                )}
                onClick={() => onFiltersChange({ accommodationType: type.value as 'all' | 'hotel' | 'apartment' | 'villa' })}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Location filter */}
        <div className="space-y-4">
          <Label className="text-base font-medium">{t("form.location")}</Label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Badge
                key={location}
                variant={filters.location === location ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105",
                  filters.location === location 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-muted border-2"
                )}
                onClick={() => onFiltersChange({ location })}
              >
                {t(getLocationTranslationKey(location))}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Capacity filter */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">{t("accommodations.capacity")}</Label>
            <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
              {filters.capacity}+ guests
            </Badge>
          </div>
          <div className="px-2">
            <Slider
              value={[filters.capacity]}
              onValueChange={(value) => onFiltersChange({ capacity: value[0] })}
              min={1}
              max={6}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1 guest</span>
              <span>6+ guests</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationFiltersRedesigned;
