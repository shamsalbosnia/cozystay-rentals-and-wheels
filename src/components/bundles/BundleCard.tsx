
import { Bundle } from "@/types/bundle";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface BundleCardProps {
  bundle: Bundle;
  onClick: () => void;
}

const BundleCard = ({ bundle, onClick }: BundleCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {bundle.images.slice(0, 3).map((image, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={16/9}>
                  <img 
                    src={image} 
                    alt={`${bundle.title} - image ${index + 1}`}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute inset-y-0 left-0 flex items-center">
            <CarouselPrevious className="relative left-0 ml-2 bg-black/40 hover:bg-black/60 text-white border-none" />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <CarouselNext className="relative right-0 mr-2 bg-black/40 hover:bg-black/60 text-white border-none" />
          </div>
        </Carousel>

        <div className="absolute top-4 right-4 flex flex-wrap gap-1 justify-end max-w-[70%]">
          {bundle.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-black/70 text-white text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-2">{t(bundle.title)}</CardTitle>
        <CardDescription className="line-clamp-1">{t(bundle.subtitle)}</CardDescription>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {t(bundle.description)}
        </p>
        
        <div className="space-y-1 text-sm">
          {bundle.highlights.slice(0, 4).map((highlight, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{t(highlight)}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t flex justify-between items-center">
        <div className="text-sm">
          <div className="font-medium text-foreground">
            {t("bundle.card.from")} €{bundle.pricePerPerson} <span className="text-muted-foreground">{t("bundle.card.perPerson")}</span>
          </div>
          <div className="text-muted-foreground text-xs">
            {bundle.duration} {bundle.duration === 1 ? t("bundle.card.day") : t("bundle.card.days")} · {bundle.regions.join(", ")}
          </div>
        </div>
        <Button onClick={onClick}>{t("bundle.card.viewDetails")}</Button>
      </CardFooter>
    </Card>
  );
};

export default BundleCard;
