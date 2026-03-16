
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, Users, MapPin, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BundleFiltersProps {
  filters: {
    duration: [number, number];
    budget: [number, number];
    travelers: number;
    regions: string[];
    experiences: string[];
  };
  setFilters: (filters: any) => void;
  resetFilters: () => void;
}

const BundleFilters = ({ filters, setFilters, resetFilters }: BundleFiltersProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRegionToggle = (region: string) => {
    if (filters.regions.includes(region)) {
      setFilters({
        ...filters,
        regions: filters.regions.filter(r => r !== region)
      });
    } else {
      setFilters({
        ...filters,
        regions: [...filters.regions, region]
      });
    }
  };

  const handleExperienceToggle = (experience: string) => {
    if (filters.experiences.includes(experience)) {
      setFilters({
        ...filters,
        experiences: filters.experiences.filter(e => e !== experience)
      });
    } else {
      setFilters({
        ...filters,
        experiences: [...filters.experiences, experience]
      });
    }
  };

  // Available regions and experiences - Updated to include both Sarajevo and Mostar locations
  const regions = ["Sarajevo", "Mostar", "Bihać", "Travnik", "Konjic", "Blagaj", "Jajce"];
  const experiences = ["Adventure", "Nature", "History", "Culture", "Food", "Wine", "Relaxation", "City", "Mountain"];

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-medium">{t("bundle.filters.title")}</h3>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t("bundle.filters.simpleView") : t("bundle.filters.advancedFilters")}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
          >
            {t("bundle.filters.reset")}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6">
        {/* Duration Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {t("bundle.filters.duration")}
            </Label>
            <span className="text-sm">{filters.duration[0]} - {filters.duration[1]} {t("bundle.filters.durationDays")}</span>
          </div>
          <Slider
            defaultValue={[3, 14]}
            value={filters.duration}
            min={3}
            max={14}
            step={1}
            onValueChange={(value) => setFilters({ ...filters, duration: value as [number, number] })}
            className="py-4"
          />
        </div>
        
        {/* Budget Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>{t("bundle.filters.budgetRange")}</Label>
            <span className="text-sm">€{filters.budget[0]} - €{filters.budget[1]}</span>
          </div>
          <Slider
            defaultValue={[200, 3000]}
            value={filters.budget}
            min={200}
            max={3000}
            step={50}
            onValueChange={(value) => setFilters({ ...filters, budget: value as [number, number] })}
            className="py-4"
          />
        </div>
        
        {/* Travelers Filter */}
        {isExpanded && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {t("bundle.filters.travelers")}
              </Label>
              <span className="text-sm">{filters.travelers} {t("bundle.filters.travelersCount")}</span>
            </div>
            <Slider
              defaultValue={[4]}
              value={[filters.travelers]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setFilters({ ...filters, travelers: value[0] })}
              className="py-4"
            />
          </div>
        )}
        
        {/* Region Filters */}
        {isExpanded && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-4 w-4" />
              <Label>{t("bundle.filters.regions")}</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <Badge
                  key={region}
                  variant={filters.regions.includes(region) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleRegionToggle(region)}
                >
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Experience Filters */}
        {isExpanded && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Label>{t("bundle.filters.experiences")}</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {experiences.map((experience) => (
                <Badge
                  key={experience}
                  variant={filters.experiences.includes(experience) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleExperienceToggle(experience)}
                >
                  {experience}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BundleFilters;
