
import AnimatedSection from "@/components/AnimatedSection";
import FeatureCard from "@/components/FeatureCard";
import { MapPin, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ApartmentSection = () => {
  const { t } = useLanguage();
  const [showImagePreview, setShowImagePreview] = useState(false);
  
  return (
    <section id="apartments" className="py-24 bg-gradient-to-b from-background to-accent/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("home.apartments.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("home.apartments.subtitle")}
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <AnimatedSection className="relative group" animation="fade-left">
            <div className="overflow-hidden rounded-2xl">
              <img 
                src="https://www.hoteleuropegroup.ba/img/s/600x600/upload/images/gallery/foto/122017/hoteleurope//8b141341f9b2d5173c5d18f8289dbe88.jpg" 
                alt="Hotel Europe in Sarajevo" 
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                onClick={() => setShowImagePreview(true)}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-6">
                <h3 className="text-white text-xl font-semibold">{t("home.apartments.sarajevo")}</h3>
                <p className="text-white/80 mt-2">{t("home.apartments.startingFrom")}</p>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="grid gap-6 h-full">
              <FeatureCard 
                icon={<MapPin className="h-6 w-6" />}
                title={t("home.apartments.primeLocations")}
                description={t("home.apartments.primeLocationsDesc")}
              />
              <FeatureCard 
                icon={<Hotel className="h-6 w-6" />}
                title={t("home.apartments.luxuryAmenities")}
                description={t("home.apartments.luxuryAmenitiesDesc")}
              />
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-right" delay={400}>
            <div className="glass-card rounded-2xl h-full flex flex-col justify-between p-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">{t("home.apartments.features")}</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{t("home.apartments.concierge")}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{t("home.apartments.wifi")}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{t("home.apartments.decor")}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{t("home.apartments.smartHome")}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{t("home.apartments.furnishings")}</span>
                  </li>
                </ul>
              </div>
              <Link href="/apartments">
                <Button variant="outline" className="mt-6 w-full rounded-full justify-between group">
                  <span>{t("home.apartments.viewAll")}</span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Image Preview Dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="relative">
            <img 
              src="https://www.hoteleuropegroup.ba/img/s/600x600/upload/images/gallery/foto/122017/hoteleurope//8b141341f9b2d5173c5d18f8289dbe88.jpg" 
              alt="Hotel Europe in Sarajevo" 
              className="w-full object-contain max-h-[80vh]"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute top-2 right-2 rounded-full" 
              onClick={() => setShowImagePreview(false)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ApartmentSection;
