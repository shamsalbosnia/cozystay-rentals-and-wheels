import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";

const BundleCTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566296194069-86c6067c1acd?q=80&w=2952')" }}>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            {t("bundle.cta.readyTitle")}
          </h2>
          <p className="text-xl mb-8">
            {t("bundle.cta.readySubtitle")}
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:bg-primary/90 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            {t("bundle.cta.planTrip")}
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BundleCTASection;
