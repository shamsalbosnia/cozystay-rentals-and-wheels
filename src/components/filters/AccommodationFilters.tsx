import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import AnimatedSection from "@/components/AnimatedSection";
import { AccommodationFilters } from "@/hooks/useAccommodationFilters";

interface AccommodationFiltersProps {
  filters: AccommodationFilters;
  showFilters: boolean;
  onFiltersChange: (filters: Partial<AccommodationFilters>) => void;
  onToggleFilters: () => void;
  onResetFilters: () => void;
}

const AccommodationFiltersComponent = ({
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

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "rounded-full",
            showFilters && "bg-primary text-primary-foreground"
          )}
          onClick={onToggleFilters}
        >
          {t("accommodations.filters")}
        </Button>
      </div>
      
      {showFilters && (
        <AnimatedSection animation="fade-down" className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-sm mb-6 max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t("accommodations.filters")}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetFilters}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              {t("accommodations.resetFilters")}
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Location filter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>{t("form.location")}</Label>
              </div>
              <ToggleGroup 
                type="single" 
                value={filters.location} 
                onValueChange={(value) => value && onFiltersChange({ location: value })}
                className="flex flex-wrap gap-2"
              >
                {['all', 'Sarajevo', 'Mostar', 'Konjic', 'Travnik', 'Jajce', 'Bihac'].map((location) => (
                  <ToggleGroupItem 
                    key={location}
                    value={location} 
                    variant="outline"
                    className={cn(
                      "text-xs md:text-sm py-2",
                      filters.location === location && "bg-primary text-primary-foreground"
                    )}
                  >
                    {location === 'all' ? 'All Locations' : location}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            
            {/* Capacity filter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>{t("accommodations.capacity")}</Label>
                <span className="text-sm bg-primary/10 px-2 py-0.5 rounded-full">
                  {filters.capacity}+
                </span>
              </div>
              <Slider
                defaultValue={[2]}
                min={1}
                max={6}
                step={1}
                onValueChange={(value) => onFiltersChange({ capacity: value[0] })}
                value={[filters.capacity]}
                className="py-4"
              />
            </div>
          </div>
        </AnimatedSection>
      )}
    </>
  );
};

export default AccommodationFiltersComponent;