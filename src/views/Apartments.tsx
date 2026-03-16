
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import TouristAttractions from "@/components/TouristAttractions";
import FooterSection from "@/components/home/FooterSection";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import PropertyCard from "@/components/PropertyCard";
import ApartmentPropertyCard from "@/components/ApartmentPropertyCard";
import VillaPropertyCard from "@/components/VillaPropertyCard";
import AccommodationFiltersRedesigned from "@/components/filters/AccommodationFiltersRedesigned";
import PaginationControls from "@/components/pagination/PaginationControls";
import { useAnimatedPage } from "@/hooks/useAnimatedPage";
import { useAccommodationFilters } from "@/hooks/useAccommodationFilters";
import { usePagination } from "@/hooks/usePagination";
import { GroupedHotel } from "@/types/hotel";
import { GroupedApartment } from "@/types/apartment";
import { GroupedVilla } from "@/types/villa";
import heroHotelImg from "@/assets/hero-hotel.jpg";
import heroApartmentImg from "@/assets/hero-apartment.jpg";

const ACCOMMODATION_TYPES = [
  { key: 'hotel' as const, label: 'Hotels', image: heroHotelImg.src },
  { key: 'villa' as const, label: 'Villas', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80' },
  { key: 'apartment' as const, label: 'Apartments', image: heroApartmentImg.src },
];

const Accommodations = () => {
  const { t } = useLanguage();
  
  // Initialize page animations
  useAnimatedPage();
  
  // Accommodation filtering logic
  const {
    filters,
    filteredAccommodations,
    showFilters,
    setShowFilters,
    updateFilters,
    resetFilters
  } = useAccommodationFilters();
  
  // Pagination logic
  const {
    currentPage,
    itemsPerPage,
    paginatedData: paginatedAccommodations,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange,
    handleItemsPerPageChange
  } = usePagination(filteredAccommodations, { defaultItemsPerPage: 10 });
  
  const getText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation && !translation.startsWith("apartments.") ? translation : fallback;
  };

  // Helper function to check if item is a hotel
  const isHotel = (item: GroupedHotel | GroupedApartment | GroupedVilla): item is GroupedHotel => {
    return 'rooms' in item && item.rooms.length > 0 && 'prices' in item.rooms[0];
  };

  // Helper function to check if item is a villa
  const isVilla = (item: GroupedHotel | GroupedApartment | GroupedVilla): item is GroupedVilla => {
    return 'rooms' in item && item.rooms.length > 0 && !('prices' in item.rooms[0]) && item.location === 'Vlasic';
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Dark hero section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-b from-foreground via-foreground/95 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb,196,167,103),0.08),transparent_70%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center pt-12 pb-16"
          >
            <p className="flex items-center justify-center gap-3 text-primary text-sm tracking-[0.25em] uppercase font-medium mb-6">
              <span className="h-px w-12 bg-primary/50" />
              Premium Accommodations
              <span className="h-px w-12 bg-primary/50" />
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background tracking-tight">
              {getText("apartments.title", "Find Your Perfect Stay")}
            </h1>
            <p className="mt-5 text-lg text-background/60 max-w-2xl mx-auto">
              {getText("apartments.subtitle", "Experience comfort and luxury in the heart of Bosnia's most beautiful locations")}
            </p>
          </motion.div>

          {/* Type selector cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto pb-8"
          >
            {ACCOMMODATION_TYPES.map((type) => (
              <button
                key={type.key}
                onClick={() => {
                  updateFilters({ accommodationType: type.key });
                  setTimeout(() => {
                    document.getElementById('accommodation-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className={`
                  relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer transition-all duration-300
                  ${filters.accommodationType === type.key
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-foreground scale-[1.02]'
                    : 'hover:scale-[1.02]'
                  }
                `}
              >
                <img
                  src={type.image}
                  alt={type.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <span className="text-white font-semibold text-xl">{type.label}</span>
                  <div className="h-0.5 w-8 bg-primary mt-2 rounded-full" />
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Light content section */}
      <section className="py-12 bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AccommodationFiltersRedesigned
            filters={filters}
            showFilters={showFilters}
            onFiltersChange={updateFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onResetFilters={resetFilters}
          />

          {filteredAccommodations.length > 0 ? (
            <>
              {/* Accommodations grid */}
              <div id="accommodation-results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedAccommodations.map((accommodation, index) => (
                  <AnimatedSection 
                    key={accommodation.id} 
                    animation="fade-up" 
                    delay={index * 100}
                    className="h-full"
                  >
                    {isHotel(accommodation) ? (
                      <PropertyCard hotel={accommodation} />
                    ) : isVilla(accommodation) ? (
                      <VillaPropertyCard villa={accommodation} />
                    ) : (
                      <ApartmentPropertyCard apartment={accommodation} />
                    )}
                  </AnimatedSection>
                ))}
              </div>

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          ) : (
            <AnimatedSection animation="fade-up" className="text-center py-16">
              <div className="max-w-md mx-auto">
                <AspectRatio ratio={4/3} className="bg-muted/40 rounded-lg mb-6 overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    <svg className="h-24 w-24 text-muted-foreground/50" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M8 10.01V10m4 0v-.01m4 .01v-.01M3 19.999V8.999c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2z"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 9.999h18m-9 3c0 .51.49 1 1 1 .51 0 1-.49 1-1 0-.51-.49-1-1-1-.51 0-1 .49-1 1zm-4 0c0 .51.49 1 1 1 .51 0 1-.49 1-1 0-.51-.49-1-1-1-.51 0-1 .49-1 1zm8 0c0 .51.49 1 1 1 .51 0 1-.49 1-1 0-.51-.49-1-1-1-.51 0-1 .49-1 1z"
                      />
                    </svg>
                  </div>
                </AspectRatio>
                <h3 className="text-xl font-medium mb-2">No accommodations found</h3>
                <p className="text-muted-foreground">
                  There are no accommodations available with the current filters. 
                  Try adjusting your filters or selecting different options.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      <TouristAttractions />
      
      <FooterSection />
    </div>
  );
};

export default Accommodations;
