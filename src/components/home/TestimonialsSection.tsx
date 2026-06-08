'use client';

import AnimatedSection from "@/components/AnimatedSection";
import TestimonialCard from "@/components/TestimonialCard";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      quote: t("home.testimonials.quote1"),
      author: t("home.testimonials.author1"),
      role: t("home.testimonials.role1"),
    },
    {
      quote: t("home.testimonials.quote2"),
      author: t("home.testimonials.author2"),
      role: t("home.testimonials.role2"),
    },
    {
      quote: t("home.testimonials.quote3"),
      author: t("home.testimonials.author3"),
      role: t("home.testimonials.role3"),
    },
  ];

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

        {/* Carousel on mobile/tablet, grid on lg+ */}
        <div className="hidden lg:grid grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, i) => (
            <TestimonialCard key={i} quote={item.quote} author={item.author} role={item.role} />
          ))}
        </div>

        <div className="lg:hidden">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {testimonials.map((item, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2">
                  <TestimonialCard quote={item.quote} author={item.author} role={item.role} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-4 mt-6">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
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
