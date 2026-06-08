'use client';

import { useState } from "react";
import { MapPin, Calendar, ChevronDown, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const BA_CITIES = [
  "Sarajevo",
  "Mostar",
  "Banja Luka",
  "Tuzla",
  "Zenica",
  "Neum",
  "Trebinje",
];

const AGE_GROUPS = [
  { value: "18-24", label: "18–24" },
  { value: "25-29", label: "25–29" },
  { value: "30+", label: "30+" },
];

interface StickyBookingWidgetProps {
  onSearch: (filters: {
    pickupCity: string;
    returnCity: string;
    pickupDate: Date | undefined;
    returnDate: Date | undefined;
    ageGroup: string;
  }) => void;
}

const StickyBookingWidget = ({ onSearch }: StickyBookingWidgetProps) => {
  const [pickupCity, setPickupCity] = useState("");
  const [differentReturn, setDifferentReturn] = useState(false);
  const [returnCity, setReturnCity] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [ageGroup, setAgeGroup] = useState("30+");

  const handleSearch = () => {
    onSearch({ pickupCity, returnCity: differentReturn ? returnCity : pickupCity, pickupDate, returnDate, ageGroup });
    const grid = document.getElementById("cars-grid");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-end gap-3">

          {/* Pickup city */}
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-muted-foreground mb-1 block">Pickup location</label>
            <Select value={pickupCity} onValueChange={setPickupCity}>
              <SelectTrigger className="h-9 text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary shrink-0" />
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {BA_CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Different return toggle */}
          <button
            type="button"
            onClick={() => { setDifferentReturn(v => !v); if (differentReturn) setReturnCity(""); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pb-1"
          >
            {differentReturn
              ? <ToggleRight className="h-4 w-4 text-primary" />
              : <ToggleLeft className="h-4 w-4" />
            }
            <span className="hidden sm:inline">Different return</span>
          </button>

          {/* Return city (conditional) */}
          {differentReturn && (
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-muted-foreground mb-1 block">Return location</label>
              <Select value={returnCity} onValueChange={setReturnCity}>
                <SelectTrigger className="h-9 text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {BA_CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Pickup date */}
          <div className="flex-1 min-w-[130px]">
            <label className="text-xs text-muted-foreground mb-1 block">Pickup date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("h-9 w-full justify-start text-sm font-normal", !pickupDate && "text-muted-foreground")}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  {pickupDate ? format(pickupDate, "dd MMM") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarUI
                  mode="single"
                  selected={pickupDate}
                  onSelect={setPickupDate}
                  disabled={date => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return date */}
          <div className="flex-1 min-w-[130px]">
            <label className="text-xs text-muted-foreground mb-1 block">Return date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("h-9 w-full justify-start text-sm font-normal", !returnDate && "text-muted-foreground")}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  {returnDate ? format(returnDate, "dd MMM") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarUI
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={date => date < (pickupDate ?? new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Driver age */}
          <div className="w-[90px]">
            <label className="text-xs text-muted-foreground mb-1 block">Driver age</label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGE_GROUPS.map(ag => (
                  <SelectItem key={ag.value} value={ag.value}>{ag.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CTA */}
          <Button
            onClick={handleSearch}
            className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 gap-2"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search Cars</span>
          </Button>

        </div>
      </div>
    </div>
  );
};

export default StickyBookingWidget;
