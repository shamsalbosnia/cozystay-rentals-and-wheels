'use client';

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Car, Hotel, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import heroCarImg from "@/assets/hero-car.jpg";
import heroHotelImg from "@/assets/hero-hotel.jpg";
import heroApartmentImg from "@/assets/hero-apartment.jpg";

const SERVICES = [
  {
    href: "/cars",
    scrollTo: undefined,
    icon: Car,
    labelKey: "home.service.car",
    fallback: "استئجار سيارة",
    image: heroCarImg,
  },
  {
    href: "/apartments",
    scrollTo: undefined,
    icon: Hotel,
    labelKey: "home.service.hotel",
    fallback: "حجز فندق",
    image: heroHotelImg,
  },
  {
    href: "/apartments",
    scrollTo: undefined,
    icon: Home,
    labelKey: "home.service.apartment",
    fallback: "استئجار شقة",
    image: heroApartmentImg,
  },
];

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground/95 to-background z-0" />

      {/* Branding */}
      <div className="relative z-10 text-center mb-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <div className="h-px w-16 bg-primary" />
          <span className="text-primary tracking-widest text-sm font-medium">
            شمس البوسنة
          </span>
          <div className="h-px w-16 bg-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-primary-foreground leading-relaxed"
        >
          {t("hero.title", "اكتشف البوسنة والهرسك")}
        </motion.h1>
      </div>

      {/* Three service cards */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 max-w-6xl mx-auto">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const cardContent = (
              <>
                {/* Image */}
                <img
                  src={service.image.src}
                  alt={service.fallback}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent transition-all duration-500 group-hover:from-foreground/95" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-primary group-hover:scale-110">
                    <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-primary-foreground text-center">
                    {t(service.labelKey, service.fallback)}
                  </h2>
                  {/* RTL arrow — points left */}
                  <div className="mt-4 flex items-center gap-2 text-primary text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-[-4px]">
                    <span>{t("common.viewMore", "عرض المزيد")}</span>
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                  <div className="mt-2 w-8 h-0.5 bg-primary transition-all duration-500 group-hover:w-16" />
                </div>
              </>
            );

            return (
              <motion.div
                key={service.href}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
              >
                {service.scrollTo ? (
                  <div
                    className="group relative block aspect-[3/4] md:aspect-[2/3] rounded-lg overflow-hidden shadow-2xl cursor-pointer"
                    onClick={() => {
                      document.getElementById(service.scrollTo!)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }}
                  >
                    {cardContent}
                  </div>
                ) : (
                  <Link
                    href={service.href}
                    className="group relative block aspect-[3/4] md:aspect-[2/3] rounded-lg overflow-hidden shadow-2xl"
                  >
                    {cardContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;