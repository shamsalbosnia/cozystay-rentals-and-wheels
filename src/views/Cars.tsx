'use client';

import { useState, useEffect, useMemo } from "react";
import { Loader2, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import StickyBookingWidget from "@/components/StickyBookingWidget";
import FooterSection from "@/components/home/FooterSection";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "seats-asc", label: "Seats: Fewest First" },
  { value: "seats-desc", label: "Seats: Most First" },
];

interface BookingFilters {
  pickupCity: string;
  returnCity: string;
  pickupDate: Date | undefined;
  returnDate: Date | undefined;
  ageGroup: string;
}

const Cars = () => {
  const { t } = useLanguage();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Sidebar filters
  const [transmission, setTransmission] = useState<string>("all");
  const [minSeats, setMinSeats] = useState<number>(1);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sort
  const [sort, setSort] = useState<string>("price-asc");

  // Booking widget context
  const [bookingFilters, setBookingFilters] = useState<BookingFilters | null>(null);

  useEffect(() => {
    fetch('/api/cars')
      .then(r => r.json())
      .then(data => { setCars(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const maxPossiblePrice = useMemo(
    () => Math.max(500, ...cars.map(c => c.price_per_day)),
    [cars]
  );

  const filteredAndSorted = useMemo(() => {
    let result = cars;

    if (selectedType) {
      result = result.filter(c => c.type.toLowerCase().includes(selectedType.toLowerCase()));
    }
    if (transmission !== "all") {
      result = result.filter(c => c.transmission.toLowerCase() === transmission.toLowerCase());
    }
    result = result.filter(c => c.seats >= minSeats && c.price_per_day <= maxPrice);

    result = [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price_per_day - b.price_per_day;
      if (sort === "price-desc") return b.price_per_day - a.price_per_day;
      if (sort === "seats-asc") return a.seats - b.seats;
      if (sort === "seats-desc") return b.seats - a.seats;
      return 0;
    });

    return result;
  }, [cars, selectedType, transmission, minSeats, maxPrice, sort]);

  const activeFilterCount = [
    transmission !== "all",
    minSeats > 1,
    maxPrice < maxPossiblePrice,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setTransmission("all");
    setMinSeats(1);
    setMaxPrice(maxPossiblePrice);
    setSelectedType(null);
  };

  const carForCard = (car: Car) => ({
    id: car.id || 0,
    name: car.name,
    image: car.image_url,
    images: car.images?.length ? car.images : [car.image_url].filter(Boolean),
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

      {/* Sticky booking widget */}
      <StickyBookingWidget
        onSearch={(filters) => {
          setBookingFilters(filters);
          setTimeout(() => {
            document.getElementById('cars-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }}
      />

      {/* Active booking context banner */}
      {bookingFilters?.pickupCity && (
        <div className="bg-primary/10 border-b border-primary/20 py-2">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm">
            <span className="text-primary font-medium">
              Showing cars for <strong>{bookingFilters.pickupCity}</strong>
              {bookingFilters.pickupDate && ` · ${bookingFilters.pickupDate.toLocaleDateString()}`}
              {bookingFilters.returnDate && ` → ${bookingFilters.returnDate.toLocaleDateString()}`}
              {bookingFilters.ageGroup && ` · Driver age: ${bookingFilters.ageGroup}`}
            </span>
            <button onClick={() => setBookingFilters(null)} className="text-muted-foreground hover:text-foreground ml-4">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main content: sidebar + grid */}
      <section id="cars-grid" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">

            {/* Filter sidebar — desktop */}
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="sticky top-[120px] rounded-2xl border border-border p-5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={resetFilters} className="text-xs text-primary hover:underline">
                      Reset ({activeFilterCount})
                    </button>
                  )}
                </div>

                {/* Transmission */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Transmission</p>
                  <div className="flex flex-col gap-2">
                    {["all", "Automatic", "Manual"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setTransmission(opt)}
                        className={`text-sm text-left px-3 py-1.5 rounded-lg transition-colors ${
                          transmission === opt
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        {opt === "all" ? "All" : opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minimum seats */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Min. seats: <span className="text-foreground font-semibold">{minSeats}+</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 4, 5, 7].map(n => (
                      <button
                        key={n}
                        onClick={() => setMinSeats(n)}
                        className={`text-sm px-3 py-1 rounded-lg border transition-colors ${
                          minSeats === n
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {n}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max price */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Max price: <span className="text-foreground font-semibold">{maxPrice} BAM/day</span>
                  </p>
                  <Slider
                    min={50}
                    max={maxPossiblePrice}
                    step={10}
                    value={[maxPrice]}
                    onValueChange={([v]) => setMaxPrice(v)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>50</span>
                    <span>{maxPossiblePrice}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main grid area */}
            <div className="flex-1 min-w-0">
              {/* Toolbar: count + sort + mobile filter toggle */}
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div>
                  {!loading && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{filteredAndSorted.length}</span> vehicles
                      {selectedType && <span> · {selectedType}</span>}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden gap-2"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>

                  {/* Sort */}
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="h-8 text-xs w-[190px]">
                      <ArrowUpDown className="h-3 w-3 mr-1.5 shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(o => (
                        <SelectItem key={o.value} value={o.value} className="text-xs">
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredAndSorted.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-lg text-muted-foreground">
                    {selectedType
                      ? `No ${selectedType.toLowerCase()} vehicles match your filters.`
                      : "No vehicles match your filters."}
                  </p>
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Clear filters
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedType}-${transmission}-${minSeats}-${maxPrice}-${sort}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
                  >
                    {filteredAndSorted.map((car, idx) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.07 }}
                      >
                        <CarCard car={carForCard(car)} carId={car.id} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-background z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Transmission</p>
                  <div className="flex flex-col gap-2">
                    {["all", "Automatic", "Manual"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setTransmission(opt)}
                        className={`text-sm text-left px-3 py-1.5 rounded-lg transition-colors ${
                          transmission === opt ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                        }`}
                      >
                        {opt === "all" ? "All" : opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Min. seats: <span className="text-foreground font-semibold">{minSeats}+</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 4, 5, 7].map(n => (
                      <button
                        key={n}
                        onClick={() => setMinSeats(n)}
                        className={`text-sm px-3 py-1 rounded-lg border transition-colors ${
                          minSeats === n ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                        }`}
                      >
                        {n}+
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Max price: <span className="text-foreground font-semibold">{maxPrice} BAM/day</span>
                  </p>
                  <Slider
                    min={50}
                    max={maxPossiblePrice}
                    step={10}
                    value={[maxPrice]}
                    onValueChange={([v]) => setMaxPrice(v)}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={resetFilters}>Reset</Button>
                  <Button className="flex-1" onClick={() => setSidebarOpen(false)}>Apply</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  );
};

export default Cars;
