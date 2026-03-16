import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import TouristAttractions from "@/components/TouristAttractions";
import FooterSection from "@/components/home/FooterSection";
import AnimatedSection from "@/components/AnimatedSection";
import PropertyFilters from "@/components/filters/PropertyFilters";
import PaginationControls from "@/components/pagination/PaginationControls";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnimatedPage } from "@/hooks/useAnimatedPage";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";
import { usePagination } from "@/hooks/usePagination";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { GroupedHotel } from "@/types/hotel";

const RealEstate = () => {
  const { t } = useLanguage();
  const { filters, filteredProperties, updateFilters } = usePropertyFilters();
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData: paginatedProperties,
    handlePageChange,
    handleItemsPerPageChange,
    startIndex,
    endIndex,
    totalItems
  } = usePagination(filteredProperties, { defaultItemsPerPage: 10 });

  useAnimatedPage();
  
  const getText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation && !translation.startsWith("realestate.") ? translation : fallback;
  };


  // Convert property data to hotel format for PropertyCard compatibility
  const convertPropertyToHotel = (property: any): GroupedHotel => {
    return {
      id: String(property.id),
      name: property.title,
      location: property.location,
      rating: property.rating || 0,
      rooms: [
        {
          id: `${property.id}-room`,
          name: property.type,
          description: property.description,
          prices: {
            single: property.price,
            double: property.price * 1.2,
            triple: property.price * 1.4,
          },
          bathroom: 1,
          roomType: property.type,
          features: property.features || [],
          images: [property.image],
          availability: true
        }
      ]
    };
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-20 pb-12 bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {getText("realestate.title", "Invest in the Heart of the Balkans")}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {getText("realestate.subtitle", "Explore unique land plots, countryside homes, and premium properties across Bosnia and Herzegovina")}
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" className="mb-8">
            <PropertyFilters filters={filters} onFiltersChange={updateFilters} />
          </AnimatedSection>
          
          {/* Pagination Controls */}
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

          {paginatedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProperties.map((property, index) => (
                <AnimatedSection 
                  key={property.id} 
                  animation="fade-up" 
                  delay={index * 100}
                  className="h-full"
                >
                  <PropertyCard hotel={convertPropertyToHotel(property)} />
                </AnimatedSection>
              ))}
            </div>
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
                        d="M3 9.999h18m-9 3c0 .51.49 1 1 1 .51 0 1-.49 1-1 0-.51-.49-1-1-1-.51 0-1 .49-1 1zm-4 0c0 .51.49 1 1 1 .51 0 1-.49 1-1 0-.51-.49-1-1-1-.51 0-1 .49-1 1z"
                      />
                    </svg>
                  </div>
                </AspectRatio>
                <h3 className="text-xl font-medium mb-2">No properties found</h3>
                <p className="text-muted-foreground">
                  There are no properties matching your current filters. 
                  Try adjusting your search criteria.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
      
      <section className="py-16 bg-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {getText("realestate.whyTitle", "Why Buy Property With Us")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {getText("realestate.whySubtitle", "Expert guidance and support through every step of your property purchase")}
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedSection animation="fade-up" delay={100} className="text-center">
              <div className="bg-background rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">{getText("home.realestate.verifiedTitle", "Verified Listings")}</h3>
              <p className="text-muted-foreground">{getText("home.realestate.verifiedDescription", "All our properties are thoroughly verified with clear legal status")}</p>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={200} className="text-center">
              <div className="bg-background rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">{getText("home.realestate.legalTitle", "Legal Assistance")}</h3>
              <p className="text-muted-foreground">{getText("home.realestate.legalDescription", "Professional legal support throughout the buying process")}</p>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={300} className="text-center">
              <div className="bg-background rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">{getText("home.realestate.expertiseTitle", "Local Expertise")}</h3>
              <p className="text-muted-foreground">{getText("home.realestate.expertiseDescription", "Deep knowledge of local markets, regulations and property values")}</p>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={400} className="text-center">
              <div className="bg-background rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">{getText("home.realestate.supportTitle", "Multilingual Support")}</h3>
              <p className="text-muted-foreground">{getText("home.realestate.supportDescription", "Assistance available in English, Bosnian, and Arabic")}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 rounded-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <AnimatedSection animation="fade-right">
                  <h2 className="text-2xl font-bold mb-4">{getText("realestate.ctaTitle", "Want to sell your land or property?")}</h2>
                  <p className="text-muted-foreground mb-6">{getText("realestate.ctaSubtitle", "Contact us to list your real estate and reach global buyers.")}</p>
                  <Button size="lg" className="rounded-full px-8">
                    {getText("realestate.ctaButton", "List Your Property")}
                  </Button>
                </AnimatedSection>
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625" 
                  alt="Beautiful property in Bosnia" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <TouristAttractions />
      
      <FooterSection />
    </div>
  );
};

export default RealEstate;
