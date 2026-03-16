import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomBundleData } from "../CustomBundleWizard";
import { cn } from "@/lib/utils";
import { X, Plus, MapPin, Clock, Euro } from "lucide-react";
import { adventuresByCity } from "@/data/adventures";

interface AdventuresStepProps {
  data: CustomBundleData;
  onUpdate: (data: CustomBundleData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AdventuresStep = ({ data, onUpdate, onNext, onPrevious }: AdventuresStepProps) => {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAdventures, setSelectedAdventures] = useState<string[]>([]);

  const [mergedAdventuresByCity, setMergedAdventuresByCity] = useState<Record<string, any[]>>(adventuresByCity as any);

  useEffect(() => {
    fetch('/api/adventures')
      .then(r => r.ok ? r.json() : [])
      .then((dbAdventures: any[]) => {
        if (!dbAdventures.length) return;
        const merged: Record<string, any[]> = { ...adventuresByCity };
        dbAdventures.forEach(a => {
          if (!merged[a.city]) merged[a.city] = [];
          // avoid duplicates by id
          if (!merged[a.city].find((x: any) => x.id === String(a.id))) {
            merged[a.city] = [...merged[a.city], {
              id: String(a.id),
              title: a.title,
              description: a.description_en || a.description || '',
              description_en: a.description_en || '',
              description_bs: a.description_bs || '',
              description_ar: a.description_ar || '',
              duration: a.duration,
              price: a.price || 0,
              image: a.image || '',
              city: a.city,
            }];
          }
        });
        setMergedAdventuresByCity(merged);
      })
      .catch(() => {});
  }, []);

  const cities = Object.keys(mergedAdventuresByCity);
  const availableAdventures = selectedCity ? (mergedAdventuresByCity[selectedCity] || []) : [];

  // Get all dates from hotel bookings to ensure adventures are within stay dates
  const getAvailableDates = () => {
    const availableDates = new Set<string>();
    data.hotels.forEach(hotel => {
      const start = new Date(hotel.checkIn);
      const end = new Date(hotel.checkOut);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        availableDates.add(d.toDateString());
      }
    });
    return availableDates;
  };

  const availableDates = getAvailableDates();

  const addAdventures = () => {
    if (selectedDate && selectedCity && selectedAdventures.length > 0) {
      const adventures = selectedAdventures.map(id => {
        const adventure = availableAdventures.find(a => a.id === id);
        return {
          id,
          title: adventure?.title || "",
          city: selectedCity,
          date: selectedDate,
          price: adventure?.price || 0,
          duration: adventure?.duration || ""
        };
      });

      onUpdate({
        ...data,
        adventures: [...(data.adventures || []), ...adventures]
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedCity("");
      setSelectedAdventures([]);
    }
  };

  const removeAdventure = (index: number) => {
    const updatedAdventures = (data.adventures || []).filter((_, i) => i !== index);
    onUpdate({
      ...data,
      adventures: updatedAdventures
    });
  };

  const handleAdventureToggle = (adventureId: string) => {
    setSelectedAdventures(prev => 
      prev.includes(adventureId) 
        ? prev.filter(id => id !== adventureId)
        : [...prev, adventureId]
    );
  };

  const canAddAdventures = selectedDate && selectedCity && selectedAdventures.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Adventures Selection
        </h3>
        <p className="text-muted-foreground">
          Enrich your trip with unique adventure experiences in each city.
        </p>
      </div>

      {/* Existing Adventures */}
      {data.adventures && data.adventures.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Selected Adventures</Label>
          {data.adventures.map((adventure, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{adventure.title}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {adventure.city} • {adventure.date.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {adventure.duration}
                      {adventure.price > 0 && (
                        <>
                          <span className="ml-2">•</span>
                          <Euro className="h-3 w-3 ml-1" />
                          {adventure.price}
                        </>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAdventure(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Adventure */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Adventures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => 
                  !availableDates.has(date.toDateString()) || 
                  date < new Date()
                }
                className={cn("rounded-md border pointer-events-auto w-full")}
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Select City</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a city..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCity && availableAdventures.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Available Adventures</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableAdventures.map((adventure) => (
                      <Card 
                        key={adventure.id}
                        className={`cursor-pointer transition-all ${
                          selectedAdventures.includes(adventure.id) ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => handleAdventureToggle(adventure.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{adventure.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? (adventure as any).description_ar || adventure.description :
                                 language === 'bs' ? (adventure as any).description_bs || adventure.description :
                                 (adventure as any).description_en || adventure.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {adventure.duration}
                                {adventure.price && (
                                  <>
                                    <span>•</span>
                                    <Euro className="h-3 w-3" />
                                    {adventure.price}
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="w-4 h-4 rounded border-2 border-primary flex items-center justify-center ml-2">
                              {selectedAdventures.includes(adventure.id) && (
                                <div className="w-2 h-2 bg-primary rounded"></div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={addAdventures}
            disabled={!canAddAdventures}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Selected Adventures
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          {t("bundle.wizard.previous")}
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={onNext}>
            {t("bundle.wizard.skip")}
          </Button>
          <Button onClick={onNext}>
            {t("bundle.wizard.next")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdventuresStep;
