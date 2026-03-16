
import AnimatedSection from "@/components/AnimatedSection";
import BookingForm from "@/components/BookingForm";
import { Search, Calendar, Key } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BookingSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="booking" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493962853295-0fd70327578a')] bg-cover bg-center bg-no-repeat brightness-[0.15] z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/60 z-10" />
      
      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection animation="fade-right">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("booking.title") || "Book Your Stay or Car"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("booking.subtitle") || "Quick and easy booking process"}
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mr-4">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{t("booking.find.title") || "Find the Perfect Match"}</h3>
                  <p className="mt-1 text-muted-foreground">{t("booking.find.desc") || "Browse through our selection of premium apartments and cars"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mr-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{t("booking.minutes.title") || "Book in Minutes"}</h3>
                  <p className="mt-1 text-muted-foreground">{t("booking.minutes.desc") || "Our streamlined booking process makes it quick and hassle-free"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mr-4">
                  <Key className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{t("booking.enjoy.title") || "Enjoy Your Stay"}</h3>
                  <p className="mt-1 text-muted-foreground">{t("booking.enjoy.desc") || "Relax and enjoy your time in Bosnia with our quality services"}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-left">
            <div className="glass-card rounded-2xl p-8 backdrop-blur-lg">
              <h3 className="text-2xl font-bold mb-6">{t("booking.availability") || "Check Availability"}</h3>
              <BookingForm />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
