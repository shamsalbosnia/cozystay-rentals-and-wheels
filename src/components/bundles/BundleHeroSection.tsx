
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "@/components/AnimatedSection";

interface BundleHeroSectionProps {
  onBrowsePackages: () => void;
}

const BundleHeroSection = ({ onBrowsePackages }: BundleHeroSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full">
      <div className="absolute inset-0 bg-cover bg-center z-0" 
           style={{ backgroundImage: "url('https://images.pexels.com/photos/20282456/pexels-photo-20282456/free-photo-of-view-of-the-srebrenik-fortress-in-srebrenik-in-bosnia-and-herzegovina.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-4">
        <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            {t("bundle.hero.title")}
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            {t("bundle.hero.subtitle")}
          </p>
          <button 
            onClick={onBrowsePackages}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:bg-primary/90 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            {t("bundle.hero.browsePackages")}
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BundleHeroSection;
