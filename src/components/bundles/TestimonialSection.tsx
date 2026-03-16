
import AnimatedSection from "@/components/AnimatedSection";
import TestimonialCard from "@/components/TestimonialCard";
import { useLanguage } from "@/contexts/LanguageContext";

const TestimonialSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 bg-accent/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t("bundle.testimonials.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("bundle.testimonials.subtitle")}
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <AnimatedSection animation="fade-left" delay={0}>
            <TestimonialCard 
              quote={t("bundle.testimonials.quote1")}
              author={t("bundle.testimonials.author1")}
              role={t("bundle.testimonials.role1")}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200}>
            <TestimonialCard 
              quote={t("bundle.testimonials.quote2")}
              author={t("bundle.testimonials.author2")}
              role={t("bundle.testimonials.role2")}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-right" delay={400}>
            <TestimonialCard 
              quote={t("bundle.testimonials.quote3")}
              author={t("bundle.testimonials.author3")}
              role={t("bundle.testimonials.role3")}
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
