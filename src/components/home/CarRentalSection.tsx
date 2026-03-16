import AnimatedSection from "@/components/AnimatedSection";
import FeatureCard from "@/components/FeatureCard";
import { Car, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const CarRentalSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="cars" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("cars.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("cars.subtitle")}
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <AnimatedSection animation="fade-right" delay={400}>
            <div className="glass-card rounded-2xl h-full flex flex-col justify-between p-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">{t("cars.features")}</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{t("cars.unlimited")}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Sarajevo airport pickup & dropoff</span>
                  </li>
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>24/7 roadside assistance</span>
                  </li>
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>No hidden fees</span>
                  </li>
                  <li className="flex items-center">
                    <div className="rounded-full bg-primary/10 text-primary p-1 mr-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Flexible rental periods</span>
                  </li>
                </ul>
              </div>
              <Link href="/cars">
                <Button variant="outline" className="mt-6 w-full rounded-full justify-between group">
                  <span>{t("cars.search")}</span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="grid gap-6 h-full">
              <FeatureCard 
                icon={<Car className="h-6 w-6" />}
                title={t("home.cars.luxuryFleet")}
                description={t("home.cars.luxuryFleetDesc")}
                to="/cars"
              />
              <FeatureCard 
                icon={<Key className="h-6 w-6" />}
                title={t("home.cars.easyPickup")}
                description={t("home.cars.easyPickupDesc")}
              />
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="relative group" animation="fade-left">
            <div className="overflow-hidden rounded-2xl">
              <img 
                src="https://xehay.vn/uploads/images/2023/11/03/xehay-alphard-261123-10.jpg" 
                alt="Luxury Car for Bosnia Road Trip" 
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-6">
                <h3 className="text-white text-xl font-semibold">Luxury Cars</h3>
                <p className="text-white/80 mt-2">From €60/day</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default CarRentalSection;
