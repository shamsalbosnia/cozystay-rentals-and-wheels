import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomBundleData } from "../CustomBundleWizard";
import { cn } from "@/lib/utils";
import { X, Plus, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RoomModal from "@/components/RoomModal";
import { GroupedHotel } from "@/types/hotel";
import { Hotel as DbHotel } from "@/types/supabase";

interface HotelSelectionStepProps {
  data: CustomBundleData;
  onUpdate: (data: CustomBundleData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

function mapDbHotelToGrouped(hotel: DbHotel): GroupedHotel {
  const hasNameTranslations = hotel.name_en || hotel.name_bs || hotel.name_ar;
  const hasDescTranslations = hotel.description_en || hotel.description_bs || hotel.description_ar;
  return {
    id: `db-${hotel.id ?? 0}`,
    name: hotel.name,
    location: hotel.location,
    rating: Number(hotel.rating),
    nameTranslations: hasNameTranslations ? {
      en: hotel.name_en || hotel.name,
      bs: hotel.name_bs || hotel.name,
      ar: hotel.name_ar || hotel.name,
    } : undefined,
    descriptionTranslations: hasDescTranslations ? {
      en: hotel.description_en || hotel.description || '',
      bs: hotel.description_bs || hotel.description || '',
      ar: hotel.description_ar || hotel.description || '',
    } : undefined,
    rooms: [{
      id: `db-room-${hotel.id ?? 0}`,
      name: hotel.room_name,
      description: hotel.description ?? '',
      prices: {
        single: Number(hotel.price_single),
        double: Number(hotel.price_double),
        triple: Number(hotel.price_triple),
      },
      bathroom: hotel.bathroom,
      roomType: hotel.room_type,
      features: hotel.features ?? [],
      images: hotel.images ?? [],
      availability: hotel.availability,
    }],
  };
}

const HotelSelectionStep = ({ data, onUpdate, onNext, onPrevious }: HotelSelectionStepProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomQuantities, setRoomQuantities] = useState<{
    single: number;
    double: number;
    triple: number;
  }>({
    single: 0,
    double: 0,
    triple: 0
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [dbHotels, setDbHotels] = useState<GroupedHotel[]>([]);

  useEffect(() => {
    fetch('/api/hotels')
      .then(r => r.ok ? r.json() : [])
      .then((hotels: DbHotel[]) => setDbHotels(hotels.map(mapDbHotelToGrouped)))
      .catch(() => {});
  }, []);

  // Get all blocked dates from existing hotel bookings
  const getBlockedDates = () => {
    const blockedDates = new Set<string>();
    data.hotels.forEach(hotel => {
      const start = new Date(hotel.checkIn);
      const end = new Date(hotel.checkOut);
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        blockedDates.add(d.toDateString());
      }
    });
    return blockedDates;
  };

  const blockedDates = getBlockedDates();

  const hotelsByCity = dbHotels.reduce<Record<string, GroupedHotel[]>>((acc, h) => {
    const loc = h.location || "Other";
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(h);
    return acc;
  }, {});
  const cities = Object.keys(hotelsByCity).sort();
  const availableHotels = selectedCity ? hotelsByCity[selectedCity] || [] : [];

  const addHotel = () => {
    const totalRooms = roomQuantities.single + roomQuantities.double + roomQuantities.triple;
    if (selectedCity && selectedHotel && checkInDate && checkOutDate && selectedRoom && totalRooms > 0) {
      const hotel = availableHotels.find(h => h.id === selectedHotel);
      if (hotel) {
        const selectedRoomData = hotel.rooms.find(r => r.id === selectedRoom);
        const totalPrice = 
          (roomQuantities.single * selectedRoomData!.prices.single) +
          (roomQuantities.double * selectedRoomData!.prices.double) +
          (roomQuantities.triple * selectedRoomData!.prices.triple);

        const newHotel = {
          id: selectedHotel,
          city: selectedCity,
          hotelName: hotel.name,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          roomType: selectedRoomData?.name || "",
          roomQuantities: { ...roomQuantities },
          totalPricePerNight: totalPrice,
          guests: data.userInfo.totalGuests + data.userInfo.kids02 + data.userInfo.kids211,
        };

        onUpdate({
          ...data,
          hotels: [...data.hotels, newHotel],
        });

        // Reset form
        setSelectedCity("");
        setSelectedHotel("");
        setCheckInDate(undefined);
        setCheckOutDate(undefined);
        setSelectedRoom("");
        setRoomQuantities({ single: 0, double: 0, triple: 0 });
        
      }
    }
  };

  const removeHotel = (index: number) => {
    const updatedHotels = data.hotels.filter((_, i) => i !== index);
    onUpdate({
      ...data,
      hotels: updatedHotels,
    });
  };


  const totalRooms = roomQuantities.single + roomQuantities.double + roomQuantities.triple;
  const canAddHotel = selectedCity && selectedHotel && checkInDate && checkOutDate && selectedRoom && totalRooms > 0;
  const canProceed = data.hotels.length > 0;
  const selectedHotelData = availableHotels.find(h => h.id === selectedHotel);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {t("bundle.wizard.step2.subtitle")}
        </h3>
        <p className="text-muted-foreground">
          {t("bundle.wizard.step2.description")}
        </p>
      </div>

      {/* Existing Hotels */}
      {data.hotels.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {t("bundle.wizard.step2.selectedHotels")}
          </Label>
          {data.hotels.map((hotel, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{hotel.hotelName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{hotel.city}</p>
                     {hotel.roomType && (
                       <p className="text-sm text-muted-foreground">
                         {hotel.roomType} • {hotel.guests} guests
                       </p>
                     )}
                     {hotel.roomQuantities && hotel.totalPricePerNight && (
                       <div className="text-sm text-muted-foreground mt-1">
                         <div>
                           {hotel.roomQuantities.single > 0 && `${hotel.roomQuantities.single} Single`}
                           {hotel.roomQuantities.single > 0 && (hotel.roomQuantities.double > 0 || hotel.roomQuantities.triple > 0) && ' + '}
                           {hotel.roomQuantities.double > 0 && `${hotel.roomQuantities.double} Double`}
                           {hotel.roomQuantities.double > 0 && hotel.roomQuantities.triple > 0 && ' + '}
                           {hotel.roomQuantities.triple > 0 && `${hotel.roomQuantities.triple} Triple`}
                         </div>
                         <div className="font-medium text-primary">€{hotel.totalPricePerNight}/night</div>
                       </div>
                     )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHotel(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">
                  {hotel.checkIn.toLocaleDateString()} - {hotel.checkOut.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Hotel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("bundle.wizard.step2.addHotel")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">
                {t("bundle.wizard.step2.selectCity")}
              </Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder={t("bundle.wizard.step2.cityPlaceholder")} />
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

            <div>
              <Label className="text-sm font-medium">
                {t("bundle.wizard.step2.selectHotel")}
              </Label>
              <Select 
                value={selectedHotel} 
                onValueChange={(value) => {
                  setSelectedHotel(value);
                  setSelectedRoom(""); // Reset room selection when hotel changes
                }}
                disabled={!selectedCity}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("bundle.wizard.step2.hotelPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {availableHotels.map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{hotel.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCity && availableHotels.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">No hotels in this city yet. Add hotels via Admin.</p>
              )}
              {selectedHotel && selectedHotelData && selectedHotelData.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 p-0 h-auto text-xs text-primary hover:text-primary/80"
                  onClick={() => setIsPreviewModalOpen(true)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Preview {selectedHotelData.name}
                </Button>
              )}
            </div>
          </div>

          {/* Room Selection */}
          {selectedHotelData && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Room Type</Label>
              <Select value={selectedRoom} onValueChange={(value) => {
                setSelectedRoom(value);
                setRoomQuantities({ single: 0, double: 0, triple: 0 });
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedHotelData.rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      <div>
                        <div className="font-medium">{room.name}</div>
                        <div className="text-sm text-muted-foreground">
                          €{room.prices.double}/night • {room.roomType}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Room Configuration */}
              {selectedRoom && (() => {
                const selectedRoomData = selectedHotelData.rooms.find(r => r.id === selectedRoom);
                if (!selectedRoomData) return null;

                const totalRoomPrice = 
                  (roomQuantities.single * selectedRoomData.prices.single) +
                  (roomQuantities.double * selectedRoomData.prices.double) +
                  (roomQuantities.triple * selectedRoomData.prices.triple);

                return (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-3">Room Configuration</h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {/* Single Room */}
                      {selectedRoomData.prices.single > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs">Single Room</Label>
                          <div className="text-xs text-muted-foreground">€{selectedRoomData.prices.single}/night</div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRoomQuantities(prev => ({ 
                                ...prev, 
                                single: Math.max(0, prev.single - 1) 
                              }))}
                              disabled={roomQuantities.single === 0}
                            >
                              -
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{roomQuantities.single}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRoomQuantities(prev => ({ 
                                ...prev, 
                                single: prev.single + 1 
                              }))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Double Room */}
                      {selectedRoomData.prices.double > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs">Double Room</Label>
                          <div className="text-xs text-muted-foreground">€{selectedRoomData.prices.double}/night</div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRoomQuantities(prev => ({ 
                                ...prev, 
                                double: Math.max(0, prev.double - 1) 
                              }))}
                              disabled={roomQuantities.double === 0}
                            >
                              -
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{roomQuantities.double}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRoomQuantities(prev => ({ 
                                ...prev, 
                                double: prev.double + 1 
                              }))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Triple Room */}
                      {selectedRoomData.prices.triple > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs">Triple Room</Label>
                          <div className="text-xs text-muted-foreground">€{selectedRoomData.prices.triple}/night</div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRoomQuantities(prev => ({ 
                                ...prev, 
                                triple: Math.max(0, prev.triple - 1) 
                              }))}
                              disabled={roomQuantities.triple === 0}
                            >
                              -
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{roomQuantities.triple}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRoomQuantities(prev => ({ 
                                ...prev, 
                                triple: prev.triple + 1 
                              }))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price Calculator */}
                    {totalRoomPrice > 0 && (
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total per night:</span>
                          <span className="text-lg font-bold text-primary">€{totalRoomPrice}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {roomQuantities.single > 0 && `${roomQuantities.single} Single`}
                          {roomQuantities.single > 0 && (roomQuantities.double > 0 || roomQuantities.triple > 0) && ' + '}
                          {roomQuantities.double > 0 && `${roomQuantities.double} Double`}
                          {roomQuantities.double > 0 && roomQuantities.triple > 0 && ' + '}
                          {roomQuantities.triple > 0 && `${roomQuantities.triple} Triple`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">
                {t("bundle.wizard.step2.checkIn")}
              </Label>
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                disabled={(date) => 
                  date < new Date() || 
                  (data.travelDates.arrival && date < data.travelDates.arrival) ||
                  (data.travelDates.departure && date > data.travelDates.departure) ||
                  blockedDates.has(date.toDateString())
                }
                className={cn("rounded-md border pointer-events-auto w-full")}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                {t("bundle.wizard.step2.checkOut")}
              </Label>
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                disabled={(date) => 
                  date < new Date() || 
                  (checkInDate && date <= checkInDate) ||
                  (data.travelDates.departure && date > data.travelDates.departure) ||
                  blockedDates.has(date.toDateString())
                }
                className={cn("rounded-md border pointer-events-auto w-full")}
              />
            </div>
          </div>

          <Button
            onClick={addHotel}
            disabled={!canAddHotel}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("bundle.wizard.step2.addHotelButton")}
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
          <Button onClick={onNext} disabled={!canProceed}>
            {t("bundle.wizard.next")}
          </Button>
        </div>
      </div>

      {/* Hotel Preview Modal */}
      {selectedHotelData && (
        <RoomModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          hotelName={selectedHotelData.name}
          hotelRooms={selectedHotelData.rooms}
        />
      )}
    </div>
  );
};

export default HotelSelectionStep;
