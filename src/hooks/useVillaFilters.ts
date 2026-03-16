
import { useState, useMemo } from 'react';
import { GroupedVilla } from '@/types/villa';

export interface VillaFilters {
  location: string;
  capacity: number;
  priceRange: [number, number];
}

export const useVillaFilters = (villas: GroupedVilla[] = []) => {
  const [filters, setFilters] = useState<VillaFilters>({
    location: 'all',
    capacity: 2,
    priceRange: [50, 300]
  });

  const filteredVillas = useMemo(() => {
    let filtered = filters.location === 'all'
      ? villas
      : villas.filter(v => v.location === filters.location);

    // Filter by capacity (assuming each room can accommodate up to 4 people)
    if (filters.capacity > 0) {
      filtered = filtered.filter(villa =>
        villa.rooms.some(room => filters.capacity <= 4)
      );
    }

    // Filter by price range
    filtered = filtered.filter(villa =>
      villa.rooms.some(room =>
        room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1]
      )
    );

    return filtered;
  }, [filters, villas]);

  const updateFilters = (newFilters: Partial<VillaFilters>) => {
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
    filteredVillas,
    updateFilters,
    resetFilters
  };
};
