
import AnimatedSection from "@/components/AnimatedSection";
import FeatureCard from "@/components/FeatureCard";
import { Users, Car, Hotel, Check, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyBookWithUs = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t("bundle.whyBook.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("bundle.whyBook.subtitle")}
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <AnimatedSection animation="fade-up" delay={0}>
            <FeatureCard
              icon={<Users />}
              title={t("bundle.whyBook.localGuides")}
              description={t("bundle.whyBook.localGuidesDesc")}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={100}>
            <FeatureCard
              icon={<Car />}
              title={t("bundle.whyBook.transport")}
              description={t("bundle.whyBook.transportDesc")}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200}>
            <FeatureCard
              icon={<Hotel />}
              title={t("bundle.whyBook.hotels")}
              description={t("bundle.whyBook.hotelsDesc")}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={300}>
            <FeatureCard
              icon={<Check />}
              title={t("bundle.whyBook.pricing")}
              description={t("bundle.whyBook.pricingDesc")}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={400}>
            <FeatureCard
              icon={<Heart />}
              title={t("bundle.whyBook.customizable")}
              description={t("bundle.whyBook.customizableDesc")}
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default WhyBookWithUs;
