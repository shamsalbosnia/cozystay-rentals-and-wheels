
import { useState, useMemo } from 'react';
import { GroupedApartment } from '@/types/apartment';

export interface ApartmentFilters {
  location: string;
  capacity: number;
  priceRange: [number, number];
}

export const useApartmentFilters = (apartments: GroupedApartment[] = []) => {
  const [filters, setFilters] = useState<ApartmentFilters>({
    location: 'all',
    capacity: 2,
    priceRange: [50, 300]
  });

  const filteredApartments = useMemo(() => {
    let filtered = filters.location === 'all'
      ? apartments
      : apartments.filter(a => a.location === filters.location);

    // Filter by capacity (assuming each room can accommodate up to 4 people)
    if (filters.capacity > 0) {
      filtered = filtered.filter(apartment =>
        apartment.rooms.some(room => filters.capacity <= 4)
      );
    }

    // Filter by price range
    filtered = filtered.filter(apartment =>
      apartment.rooms.some(room =>
        room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1]
      )
    );

    return filtered;
  }, [filters, apartments]);

  const updateFilters = (newFilters: Partial<ApartmentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      location: 'all',
      capacity: 2,
      priceRange: [50, 300]
    });
  };

  return {
    filters,
    filteredApartments,
    updateFilters,
    resetFilters
  };
};
