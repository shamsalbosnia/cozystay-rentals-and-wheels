import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { PropertyFilters as PropertyFiltersType } from "@/hooks/usePropertyFilters";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFiltersChange: (filters: Partial<PropertyFiltersType>) => void;
}

const PropertyFilters = ({ filters, onFiltersChange }: PropertyFiltersProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const locations = ["All", "Sarajevo", "Mostar", "Bihać", "Trebinje"];
  const propertyTypes = ["All", "Land", "House", "Commercial"];

  const formatCurrency = (value: number) => `${value.toLocaleString('en-US')} BAM`;

  // Handle location toggle selection
  const handleLocationToggle = (value: string[]) => {
    if (value.length === 0) {
      onFiltersChange({ locations: ["All"] });
      return;
    }
    
    if (value.includes("All") && value.length > 1 && !filters.locations.includes("All")) {
      onFiltersChange({ locations: ["All"] });
      toast({ description: "Showing all locations" });
      return;
    }
    
    if (value.includes("All") && value.length > 1 && filters.locations.includes("All")) {
      const locationsOnly = value.filter(v => v !== "All");
      onFiltersChange({ locations: locationsOnly });
      return;
    }
    
    onFiltersChange({ locations: value });
  };
  
  // Handle property type toggle selection
  const handlePropertyTypeToggle = (value: string[]) => {
    if (value.length === 0) {
      onFiltersChange({ propertyTypes: ["All"] });
      return;
    }
    
    if (value.includes("All") && value.length > 1 && !filters.propertyTypes.includes("All")) {
      onFiltersChange({ propertyTypes: ["All"] });
      toast({ description: "Showing all property types" });
      return;
    }
    
    if (value.includes("All") && value.length > 1 && filters.propertyTypes.includes("All")) {
      const typesOnly = value.filter(v => v !== "All");
      onFiltersChange({ propertyTypes: typesOnly });
      return;
    }
    
    onFiltersChange({ propertyTypes: value });
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <Label className="mb-2 block">{t("realestate.filters.location")}</Label>
          <ToggleGroup 
            type="multiple" 
            value={filters.locations} 
            onValueChange={handleLocationToggle}
            className="flex flex-wrap gap-2"
          >
            {locations.map(location => (
              <ToggleGroupItem 
                key={location} 
                value={location}
                variant="outline"
                className={cn(
                  "text-xs md:text-sm py-2",
                  filters.locations.includes(location) && "bg-primary text-primary-foreground"
                )}
              >
                {location}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        <div>
          <Label className="mb-2 block">{t("realestate.filters.propertyType")}</Label>
          <ToggleGroup 
            type="multiple" 
            value={filters.propertyTypes} 
            onValueChange={handlePropertyTypeToggle}
            className="flex flex-wrap gap-2"
          >
            {propertyTypes.map(type => (
              <ToggleGroupItem 
                key={type} 
                value={type}
                variant="outline"
                className={cn(
                  "text-xs md:text-sm py-2",
                  filters.propertyTypes.includes(type) && "bg-primary text-primary-foreground"
                )}
              >
                {type}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        <div>
          <Label className="mb-2 block">{t("realestate.filters.priceRange")}</Label>
          <Slider
            min={0}
            max={500000}
            step={5000}
            value={filters.priceRange}
            onValueChange={(value) => onFiltersChange({ priceRange: value as [number, number] })}
            className="my-6"
          />
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(filters.priceRange[0])}</span>
            <span>{formatCurrency(filters.priceRange[1])}</span>
          </div>
        </div>
        
        <div>
          <Label className="mb-2 block">{t("realestate.filters.size")}</Label>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={filters.sizeRange}
            onValueChange={(value) => onFiltersChange({ sizeRange: value as [number, number] })}
            className="my-6"
          />
          <div className="flex justify-between text-sm">
            <span>{filters.sizeRange[0]} m²</span>
            <span>{filters.sizeRange[1]} m²</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="md:w-1/3">
          <Label className="mb-2 block">{t("realestate.filters.sortBy")}</Label>
          <Select value={filters.sortBy} onValueChange={(value) => onFiltersChange({ sortBy: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t("realestate.filters.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("realestate.filters.newest")}</SelectItem>
              <SelectItem value="price-low">{t("realestate.filters.priceLow")}</SelectItem>
              <SelectItem value="price-high">{t("realestate.filters.priceHigh")}</SelectItem>
              <SelectItem value="size">{t("realestate.filters.area")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;