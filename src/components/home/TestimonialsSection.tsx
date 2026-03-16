
import AnimatedSection from "@/components/AnimatedSection";
import TestimonialCard from "@/components/TestimonialCard";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TestimonialsSection = () => {
  const { t } = useLanguage();
  return (
    <section id="testimonials" className="py-24 bg-accent/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("home.testimonials.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("home.testimonials.subtitle")}
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <AnimatedSection animation="fade-left" delay={0}>
            <TestimonialCard 
              quote={t("home.testimonials.quote1")}
              author={t("home.testimonials.author1")}
              role={t("home.testimonials.role1")}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200}>
            <TestimonialCard 
              quote={t("home.testimonials.quote2")}
              author={t("home.testimonials.author2")}
              role={t("home.testimonials.role2")}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-right" delay={400}>
            <TestimonialCard 
              quote={t("home.testimonials.quote3")}
              author={t("home.testimonials.author3")}
              role={t("home.testimonials.role3")}
            />
          </AnimatedSection>
        </div>
        
        <AnimatedSection className="mt-16 text-center" animation="fade-up" delay={600}>
          <div className="flex items-center justify-center space-x-1 mb-8">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <span className="ml-2 text-lg font-medium">{t("home.testimonials.rating")}</span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TestimonialsSection;
