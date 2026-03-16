
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { MapPin, Euro, Building, Ruler, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { GroupedHotel } from "@/types/hotel";

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: GroupedHotel;
  hotelName: string;
  location: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Phone number is required" }),
  message: z.string().min(10, { message: "Please provide a message with at least 10 characters" })
});

const PropertyDetailModal = ({ isOpen, onClose, hotel, hotelName, location }: PropertyDetailModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(hotel.rooms[0]?.id || "");
  const [selectedBedOption, setSelectedBedOption] = useState<string>("double");

  const bedOptions = [
    { id: "single", label: "Single", capacity: 1 },
    { id: "double", label: "Double", capacity: 2 },
    { id: "triple", label: "Triple", capacity: 3 }
  ];

  const selectedRoom = hotel.rooms.find(room => room.id === selectedRoomId) || hotel.rooms[0];
  const roomImageUrl = selectedRoom?.images.length > 0 
    ? selectedRoom.images[0] 
    : "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2070&auto=format&fit=crop";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: `Hello, I'm interested in your property "${hotelName}" (Ref: ${hotel.id}). Please contact me with more information about the ${selectedRoom?.roomType} room.`
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRoomTypeTranslation = (roomType: string) => {
    if (!roomType) return "Hotel Room";
    
    const roomTypeKey = `roomType.${roomType.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`;
    const translation = t(roomTypeKey);
    
    return translation && !translation.startsWith("roomType.") ? translation : roomType;
  };

  const getPrice = (bedType: string) => {
    return selectedRoom?.prices[bedType] || selectedRoom?.prices.double || 0;
  };

  // Use actual room images from the data
  const images = selectedRoom?.images.length > 0 
    ? selectedRoom.images 
    : [roomImageUrl];

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: t("modal.property.inquirySent"),
        description: t("modal.property.contactSoon"),
      });
      form.reset();
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{hotelName}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" />
            {location}, Bosnia and Herzegovina
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {/* Room Type Selector */}
            {hotel.rooms.length > 1 && (
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Room Type</label>
                <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotel.rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {getRoomTypeTranslation(room.roomType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Bed Configuration Selector */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Bed Configuration</label>
              <Tabs value={selectedBedOption} onValueChange={setSelectedBedOption}>
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
            </div>

            <Carousel className="w-full mb-6">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index} className="basis-full">
                    <div className="overflow-hidden rounded-lg h-72">
                      <img 
                        src={image} 
                        alt={`${hotelName} - Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">{t("modal.property.details")}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("modal.property.price")}</p>
                      <p className="font-medium">{formatCurrency(getPrice(selectedBedOption))}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("modal.property.size")}</p>
                      <p className="font-medium">35 m²</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("modal.property.type")}</p>
                      <p className="font-medium">{getRoomTypeTranslation(selectedRoom?.roomType || "")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-medium">{bedOptions.find(opt => opt.id === selectedBedOption)?.capacity} guests</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-medium mb-2">{t("modal.property.description")}</h4>
                <p className="text-muted-foreground mb-4">{selectedRoom?.description || "Comfortable accommodation with modern amenities."}</p>
                
                <h4 className="font-medium mb-2">{t("common.features")}</h4>
                <ul className="grid grid-cols-1 gap-2">
                  {selectedRoom?.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t("modal.property.interested")}</h3>
            <p className="text-muted-foreground mb-6">
              {t("modal.property.contactInfo")}
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  form={form}
                  name="name"
                  label={t("modal.property.name")}
                  placeholder={t("modal.property.namePlaceholder")}
                  required
                />
                
                <FormInput
                  form={form}
                  name="email"
                  label={t("modal.property.email")}
                  placeholder={t("modal.property.emailPlaceholder")}
                  type="email"
                  required
                />
                
                <FormInput
                  form={form}
                  name="phone"
                  label={t("modal.property.phone")}
                  placeholder={t("modal.property.phonePlaceholder")}
                  required
                />
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t("modal.property.message")}
                    <span className="text-destructive"> *</span>
                  </label>
                  <Textarea
                    id="message"
                    placeholder={t("modal.property.messagePlaceholder")}
                    {...form.register("message")}
                    className={form.formState.errors.message ? "border-destructive" : ""}
                  />
                  {form.formState.errors.message && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("modal.property.sending") : t("modal.property.submitInquiry")}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailModal;
