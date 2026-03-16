'use client';

import { useState } from "react";
import { Bundle } from "@/types/bundle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, MapPin, Calendar, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingModal from "@/components/BookingModal";

interface BundleDetailsModalProps {
  bundle: Bundle;
  isOpen: boolean;
  onClose: () => void;
}

const BundleDetailsModal = ({ bundle, isOpen, onClose }: BundleDetailsModalProps) => {
  const { t } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const bundleNumericId = parseInt(bundle.id);
  const bundleId = isNaN(bundleNumericId) ? undefined : bundleNumericId;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="h-[calc(90vh-2rem)]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {bundle.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
              <DialogTitle className="text-2xl md:text-3xl mb-1">{t(bundle.title)}</DialogTitle>
              <p className="text-lg text-muted-foreground">{t(bundle.subtitle)}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{bundle.duration} {bundle.duration === 1 ? t("bundle.card.day") : t("bundle.card.days")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{t("bundle.modal.upTo")} {bundle.maxGroupSize} {t("bundle.modal.travelers")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{bundle.regions.join(", ")}</span>
                </div>
              </div>
            </DialogHeader>
            
            <Carousel className="w-full mb-8">
              <CarouselContent>
                {bundle.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <AspectRatio ratio={16/9}>
                      <img 
                        src={image} 
                        alt={`${bundle.title} - image ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-2">
                <CarouselPrevious className="static translate-y-0 transform-none h-8 w-8" />
                <CarouselNext className="static translate-y-0 transform-none h-8 w-8" />
              </div>
            </Carousel>

            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="mb-4 w-full grid grid-cols-4">
                <TabsTrigger value="overview">{t("bundle.modal.overview")}</TabsTrigger>
                <TabsTrigger value="itinerary">{t("bundle.modal.itinerary")}</TabsTrigger>
                <TabsTrigger value="includes">{t("bundle.modal.includes")}</TabsTrigger>
                <TabsTrigger value="addons">{t("bundle.modal.addons")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <p className="text-muted-foreground">
                  {t(bundle.description)}
                </p>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">{t("bundle.modal.highlights")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {bundle.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-1 shrink-0" />
                        <span>{t(highlight)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="itinerary">
                <div className="space-y-6">
                  {bundle.itinerary.map((day) => (
                    <Card key={day.day}>
                      <CardHeader className="py-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{t("bundle.card.day")} {day.day}: {t(day.title)}</CardTitle>
                          </div>
                          <Badge>{`${t("bundle.card.day")} ${day.day}`}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-muted-foreground">{t(day.description)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="includes">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-3">{t("bundle.modal.whatsIncluded")}</h3>
                  <div className="grid gap-2">
                    {bundle.includes.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-1 shrink-0" />
                        <span>{t(item)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="addons">
                {bundle.addons && bundle.addons.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-3">{t("bundle.modal.optionalAddons")}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {bundle.addons.map((addon, index) => (
                        <Card key={index}>
                          <CardHeader className="py-4">
                            <CardTitle className="text-base">{addon.name}</CardTitle>
                            <CardDescription>€{addon.price} {t("bundle.card.perPerson")}</CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t("bundle.modal.noAddons")}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="border-t pt-6 mt-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                <div>
                  <div className="text-2xl font-semibold mb-1">
                    €{bundle.pricePerPerson} <span className="text-base font-normal text-muted-foreground">{t("bundle.card.perPerson")}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("bundle.modal.groupPrice")} {bundle.maxGroupSize} {t("bundle.modal.people")} €{bundle.pricePerGroup}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" onClick={onClose}>
                    {t("bundle.modal.close")}
                  </Button>
                  <Button onClick={() => setIsBookingOpen(true)}>
                    {t("bundle.modal.bookPackage")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>

    <BookingModal
      isOpen={isBookingOpen}
      onClose={() => setIsBookingOpen(false)}
      type="bundle"
      itemName={t(bundle.title)}
      bundleId={bundleId}
    />
    </>
  );
};

export default BundleDetailsModal;
