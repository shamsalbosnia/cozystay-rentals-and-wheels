'use client';

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";
import { useAnimatedPage } from "@/hooks/useAnimatedPage";
import { useLanguage } from "@/contexts/LanguageContext";
import BundleDetailsModal from "@/components/bundles/BundleDetailsModal";
import CustomBundleWizard from "@/components/bundles/CustomBundleWizard";
import BundleHeroSection from "@/components/bundles/BundleHeroSection";
import BundleFilters from "@/components/bundles/BundleFilters";
import BundlesList from "@/components/bundles/BundlesList";
import WhyBookWithUs from "@/components/bundles/WhyBookWithUs";
import TestimonialSection from "@/components/bundles/TestimonialSection";
import BundleCTASection from "@/components/bundles/BundleCTASection";
import { useBundleFilters } from "@/hooks/useBundleFilters";
import AnimatedSection from "@/components/AnimatedSection";
import { Bundle } from "@/types/bundle";

const Bundles = () => {
  const { t } = useLanguage();
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomBundleOpen, setIsCustomBundleOpen] = useState(false);
  const { filters, setFilters, filteredBundles, resetFilters } = useBundleFilters();

  useAnimatedPage();

  const handleBundleClick = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setIsModalOpen(true);
  };

  const scrollToPackages = () => {
    const element = document.getElementById('packages-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <BundleHeroSection onBrowsePackages={scrollToPackages} />
      
      {/* Main Content Section */}
      <section className="py-16 bg-gradient-to-b from-background to-accent/10">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("bundle.main.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("bundle.main.subtitle")}
            </p>
            <div className="mt-8">
              <button
                onClick={() => setIsCustomBundleOpen(true)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:bg-primary/90 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                {t("bundle.main.createBundle")}
              </button>
            </div>
          </AnimatedSection>
          
          {/* Filters */}
          <AnimatedSection className="mb-12" animation="fade-up">
            <BundleFilters 
              filters={filters} 
              setFilters={setFilters} 
              resetFilters={resetFilters} 
            />
          </AnimatedSection>
          
          {/* Bundles Section */}
          <BundlesList 
            filteredBundles={filteredBundles} 
            onBundleClick={handleBundleClick} 
            resetFilters={resetFilters}
          />
        </div>
      </section>
      
      {/* Why Book With Us Section */}
      <WhyBookWithUs />
      
      {/* Testimonial Section */}
      <TestimonialSection />
      
      {/* CTA Section */}
      <BundleCTASection />
      
      <FooterSection />
      
      {/* Bundle Details Modal */}
      {selectedBundle && (
        <BundleDetailsModal
          bundle={selectedBundle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      
      {/* Custom Bundle Wizard */}
      <CustomBundleWizard
        isOpen={isCustomBundleOpen}
        onClose={() => setIsCustomBundleOpen(false)}
      />
    </div>
  );
};

export default Bundles;
