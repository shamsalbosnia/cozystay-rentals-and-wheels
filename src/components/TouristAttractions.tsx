import { useEffect, useRef, useState } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface AttractionProps {
  image: string;
  title: string;
  location: string;
  description: string;
  reverse?: boolean;
  isBackground?: boolean;
}

const Attraction = ({ 
  image, 
  title, 
  location, 
  description, 
  reverse = false,
  isBackground = false 
}: AttractionProps) => {
  if (isBackground) {
    return (
      <div className="relative w-full h-full opacity-30 transition-opacity duration-1000">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700"
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col md:flex-row gap-8 md:gap-12 py-16 md:py-24 items-center", 
      reverse && "md:flex-row-reverse"
    )}>
      <AnimatedSection 
        className="w-full md:w-1/2" 
        animation={reverse ? "fade-right" : "fade-left"}
      >
        <div className="overflow-hidden rounded-2xl">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-[300px] md:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </AnimatedSection>
      
      <AnimatedSection 
        className="w-full md:w-1/2 space-y-4" 
        animation={reverse ? "fade-left" : "fade-right"}
        delay={200}
      >
        <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {location}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </AnimatedSection>
    </div>
  );
};

const TouristAttractions = ({ isBackground = false }) => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const attractions = [
    {
      image: "https://s.inyourpocket.com/gallery/276982.jpg",
      title: t("attractions.sarajevo.title") || "Old Bridge in Mostar",
      location: t("attractions.sarajevo.location") || "Mostar",
      description: t("attractions.sarajevo.description") || "One of Bosnia's most recognizable landmarks, the Old Bridge (Stari Most) is a 16th-century Ottoman bridge that crosses the river Neretva.",
    },
    {
      image: "https://osmccsa.edu.ba/v2/wp-content/uploads/2020/08/sarajevo_post-004-a-740x493.jpg",
      title: t("attractions.mostar.title") || "Baščaršija",
      location: t("attractions.mostar.location") || "Sarajevo",
      description: t("attractions.mostar.description") || "The historical and cultural center of Sarajevo, Baščaršija was built in the 15th century when Isa-Beg Isaković founded the town."
    },
    {
      image: "http://freetour.com/images/tours/3912/travnik-and-jajce-tour-from-sarajevo-10.jpg",
      title: t("attractions.jajce.title") || "Jajce Waterfall",
      location: t("attractions.jajce.location") || "Jajce",
      description: t("attractions.jajce.description") || "A beautiful 17-meter high waterfall where the Pliva River meets the Vrbas in the heart of the historic town of Jajce.",
    },
    {
      image: "https://magazin.bihamk.ba/assets/photos/article/big/1658729389-bjelasnica-zmajevi-u-luci-mira.jpg?v1658729903",
      title: t("attractions.mountain.title") || "Mountain Landscapes",
      location: t("attractions.mountain.location") || "Bjelašnica",
      description: t("attractions.mountain.description") || "Bosnia and Herzegovina features stunning mountain landscapes with pristine nature.",
    },
    {
      image: "https://npuna.com/wp-content/uploads/2020/03/ili-ova-za-17-dan-rijeke-une-scaled.jpg",
      title: t("attractions.river.title") || "Una River",
      location: t("attractions.river.location") || "Una National Park",
      description: t("attractions.river.description") || "The Una River is known for its crystal clear emerald waters and breathtaking waterfalls."
    }
  ];
  
  useEffect(() => {
    if (!isBackground) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % attractions.length);
    }, 7000);
    
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollY = window.scrollY;
      const parallaxElements = sectionRef.current.querySelectorAll('.parallax-bg');
      
      parallaxElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const speed = parseFloat(htmlElement.dataset.speed || '0.15');
        htmlElement.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [attractions.length, isBackground]);
  
  if (isBackground) {
    return (
      <div ref={sectionRef} className="absolute inset-0 overflow-hidden">
        {attractions.map((attraction, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="w-full h-full">
              <img 
                src={attraction.image} 
                alt={attraction.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 parallax-bg z-0" data-speed="0.05">
                <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/80 opacity-70"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div ref={sectionRef} className="relative overflow-hidden">
      <div className="absolute inset-0 parallax-bg z-0" data-speed="0.05">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background/20 opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("attractions.title") || "Explore Bosnia's Beauty"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("attractions.subtitle") || "Discover the stunning natural and cultural sites across Bosnia and Herzegovina"}
          </p>
        </AnimatedSection>
        
        <div className="space-y-8 md:space-y-0">
          {attractions.map((attraction, index) => (
            <Attraction
              key={index}
              image={attraction.image}
              title={attraction.title}
              location={attraction.location}
              description={attraction.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouristAttractions;
