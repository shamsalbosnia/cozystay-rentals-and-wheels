import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";

const RealEstateSection = () => {
  const { t } = useLanguage();
  
  const getText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation && !translation.startsWith("home.") ? translation : fallback;
  };
  
  return (
    <section className="py-16 bg-accent/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            {t("home.realestate.title")}
          </h2>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatedSection animation="fade-up" delay={100} className="text-center">
            <div className="bg-background rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">
              {t("home.realestate.verifiedTitle")}
            </h3>
            <p className="text-muted-foreground">
              {t("home.realestate.verifiedDescription")}
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200} className="text-center">
            <div className="bg-background rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">
              {t("home.realestate.legalTitle")}
            </h3>
            <p className="text-muted-foreground">
              {t("home.realestate.legalDescription")}
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={300} className="text-center">
            <div className="bg-background rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">
              {t("home.realestate.expertiseTitle")}
            </h3>
            <p className="text-muted-foreground">
              {t("home.realestate.expertiseDescription")}
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={400} className="text-center">
            <div className="bg-background rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">
              {t("home.realestate.multilingualTitle")}
            </h3>
            <p className="text-muted-foreground">
              {t("home.realestate.multilingualDescription")}
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default RealEstateSection;