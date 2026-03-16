
import { useState } from "react";
import { Bundle } from "@/types/bundle";
import AnimatedSection from "@/components/AnimatedSection";
import BundleCard from "@/components/bundles/BundleCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface BundlesListProps {
  filteredBundles: Bundle[];
  onBundleClick: (bundle: Bundle) => void;
  resetFilters: () => void;
}

const BundlesList = ({ filteredBundles, onBundleClick, resetFilters }: BundlesListProps) => {
  const { t } = useLanguage();
  
  return (
    <div id="packages-section" className="pt-4">
      <AnimatedSection className="mb-8" animation="fade-up">
        <h3 className="text-2xl font-semibold">
          {t("bundle.availablePackages")} ({filteredBundles.length})
        </h3>
      </AnimatedSection>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBundles.map((bundle, index) => (
          <AnimatedSection 
            key={bundle.id} 
            className="h-full"
            animation="fade-up"
            delay={index * 100}
          >
            <BundleCard 
              bundle={bundle}
              onClick={() => onBundleClick(bundle)}
            />
          </AnimatedSection>
        ))}
      </div>
      
      {filteredBundles.length === 0 && (
        <AnimatedSection className="text-center py-12" animation="fade-up">
          <div className="max-w-md mx-auto">
            <h4 className="text-xl font-medium mb-2">{t("bundle.list.noPackagesTitle")}</h4>
            <p className="text-muted-foreground mb-6">
              {t("bundle.list.noPackagesDesc")}
            </p>
            <Button 
              onClick={resetFilters}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              {t("bundle.list.resetFilters")}
            </Button>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default BundlesList;
