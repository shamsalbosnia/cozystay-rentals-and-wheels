'use client';

import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import FooterSection from "@/components/home/FooterSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { Car } from "@/types/supabase";

import imgElectric from "@/assets/car-type-electric.jpeg";
import imgLuxury from "@/assets/car-type-luxury.jpeg";
import imgSports from "@/assets/car-type-sports.jpeg";
import imgSuv from "@/assets/car-type-suv.jpeg";
import imgSedan from "@/assets/car-type-sedan.jpeg";

const TYPE_CARDS = [
  { key: 'Electric', label: 'Electric', image: imgElectric },
  { key: 'Luxury', label: 'Luxury', image: imgLuxury },
  { key: 'Sports Car', label: 'Sports Car', image: imgSports },
  { key: 'SUV', label: 'SUV', image: imgSuv },
  { key: 'Sedan', label: 'Sedan', image: imgSedan },
];

const Cars = () => {
  const { t } = useLanguage();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cars')
      .then(r => r.json())
      .then(data => { setCars(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredCars = useMemo(() => {
    if (!selectedType) return [];
    return cars.filter(c =>
      c.type.toLowerCase().includes(selectedType.toLowerCase())
    );
  }, [cars, selectedType]);

  const carForCard = (car: Car) => ({
    id: car.id || 0,
    name: car.name,
    image: car.image_url,
    pricePerDay: car.price_per_day,
    type: car.type,
    seats: car.seats,
    transmission: car.transmission,
    features: car.features,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-foreground via-foreground/95 to-background overflow-hidden">
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
              Premium Car Rentals
              <span className="h-px w-12 bg-primary/50" />
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background tracking-tight">
              Our Premium Car Fleet
            </h1>
            <p className="mt-5 text-lg text-background/60 max-w-2xl mx-auto">
              Choose from our selection of luxury and performance vehicles for your next adventure
            </p>
          </motion.div>

          {/* Type selector cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto pb-8"
          >
            {TYPE_CARDS.map((type) => (
              <button
                key={type.key}
                onClick={() => {
                  setSelectedType(selectedType === type.key ? null : type.key);
                  if (selectedType !== type.key) {
                    setTimeout(() => {
                      document.getElementById('cars-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }
                }}
                className={`
                  relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer transition-all duration-300
                  ${selectedType === type.key
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-foreground scale-[1.02]'
                    : 'hover:scale-[1.02]'
                  }
                `}
              >
                <img
                  src={type.image.src}
                  alt={type.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <span className="text-white font-semibold text-base">{type.label}</span>
                  <div className="h-0.5 w-8 bg-primary mt-2 rounded-full" />
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cars grid */}
      <section id="cars-grid" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !selectedType ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-lg text-muted-foreground">
                Select a vehicle category above to browse our fleet
              </p>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <motion.div
                  key={selectedType}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {selectedType} Vehicles
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} available
                  </p>
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {filteredCars.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <p className="text-lg">No {selectedType.toLowerCase()} vehicles available at the moment.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {filteredCars.map((car, idx) => (
                        <motion.div
                          key={car.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                          <CarCard car={carForCard(car)} carId={car.id} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Cars;
