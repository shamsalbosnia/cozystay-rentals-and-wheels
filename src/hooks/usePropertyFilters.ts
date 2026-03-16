import { useState, useMemo } from 'react';

export interface PropertyFilters {
  locations: string[];
  propertyTypes: string[];
  priceRange: [number, number];
  sizeRange: [number, number];
  sortBy: string;
}

export interface Property {
  id: number;
  title: string;
  type: string;
  location: string;
  price: number;
  size: number;
  image: string;
  description: string;
  features: string[];
}

const properties: Property[] = [];

/**
 * Custom hook for property filtering logic
 * Centralizes filtering logic for reusability
 */
export const usePropertyFilters = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    locations: ["All"],
    propertyTypes: ["All"],
    priceRange: [0, 500000],
    sizeRange: [0, 10000],
    sortBy: "newest"
  });

  // Memoized filtered properties
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Filter by location
    if (filters.locations.length > 0 && !filters.locations.includes("All")) {
      filtered = filtered.filter(property => filters.locations.includes(property.location));
    }

    // Filter by property type
    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes("All")) {
      filtered = filtered.filter(property => filters.propertyTypes.includes(property.type));
    }

    // Filter by price range
    filtered = filtered.filter(
      property => property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );

    // Filter by size range
    filtered = filtered.filter(
      property => property.size >= filters.sizeRange[0] && property.size <= filters.sizeRange[1]
    );

    // Sort properties
    switch (filters.sortBy) {
      case "newest":
        // Keep original order as "newest"
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "size":
        filtered.sort((a, b) => b.size - a.size);
        break;
      default:
        break;
    }

    return filtered;
  }, [filters]);

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      locations: ["All"],
      propertyTypes: ["All"],
      priceRange: [0, 500000],
      sizeRange: [0, 10000],
      sortBy: "newest"
    });
  };

  return {
    filters,
    filteredProperties,
    allProperties: properties,
    updateFilters,
    resetFilters
  };
};
