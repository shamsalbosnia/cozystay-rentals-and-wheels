import { useState, useEffect, useMemo } from 'react';
import { GroupedHotel } from '@/types/hotel';
import { GroupedApartment } from '@/types/apartment';
import { GroupedVilla } from '@/types/villa';
import { Hotel as DbHotel, Villa as DbVilla, Apartment as DbApartment } from '@/types/supabase';

export interface AccommodationFilters {
  location: string;
  capacity: number;
  accommodationType: 'all' | 'hotel' | 'apartment' | 'villa';
}

export type AccommodationItem = GroupedHotel | GroupedApartment | GroupedVilla;

function mapDbHotelToGrouped(hotel: DbHotel): GroupedHotel {
  const hasNameTranslations = hotel.name_en || hotel.name_bs || hotel.name_ar;
  const hasDescTranslations = hotel.description_en || hotel.description_bs || hotel.description_ar;
  return {
    id: `db-${hotel.id ?? 0}`,
    name: hotel.name,
    location: hotel.location,
    rating: Number(hotel.rating),
    nameTranslations: hasNameTranslations ? {
      en: hotel.name_en || hotel.name,
      bs: hotel.name_bs || hotel.name,
      ar: hotel.name_ar || hotel.name,
    } : undefined,
    descriptionTranslations: hasDescTranslations ? {
      en: hotel.description_en || hotel.description || '',
      bs: hotel.description_bs || hotel.description || '',
      ar: hotel.description_ar || hotel.description || '',
    } : undefined,
    rooms: [{
      id: `db-room-${hotel.id ?? 0}`,
      name: hotel.room_name,
      description: hotel.description ?? '',
      prices: {
        single: Number(hotel.price_single),
        double: Number(hotel.price_double),
        triple: Number(hotel.price_triple),
      },
      bathroom: hotel.bathroom,
      roomType: hotel.room_type,
      features: hotel.features ?? [],
      images: hotel.images ?? [],
      availability: hotel.availability,
    }],
  };
}

function mapDbVillaToGrouped(villa: DbVilla): GroupedVilla {
  const hasNameTranslations = villa.name_en || villa.name_bs || villa.name_ar;
  const hasDescTranslations = villa.description_en || villa.description_bs || villa.description_ar;
  return {
    id: `db-${villa.id ?? 0}`,
    name: villa.name,
    location: villa.location,
    rating: Number(villa.rating),
    nameTranslations: hasNameTranslations ? {
      en: villa.name_en || villa.name,
      bs: villa.name_bs || villa.name,
      ar: villa.name_ar || villa.name,
    } : undefined,
    descriptionTranslations: hasDescTranslations ? {
      en: villa.description_en || villa.description || '',
      bs: villa.description_bs || villa.description || '',
      ar: villa.description_ar || villa.description || '',
    } : undefined,
    rooms: [{
      id: `db-room-${villa.id ?? 0}`,
      name: villa.room_name,
      description: villa.description ?? '',
      price: Number(villa.price),
      bathroom: villa.bathroom,
      roomType: villa.room_type,
      features: villa.features ?? [],
      images: villa.images ?? [],
      availability: villa.availability,
    }],
  };
}

function mapDbApartmentToGrouped(apt: DbApartment): GroupedApartment {
  return {
    id: `db-${apt.id ?? 0}`,
    name: apt.address,
    location: apt.city,
    rating: 0,
    rooms: [{
      id: `db-room-${apt.id ?? 0}`,
      name: 'Apartman',
      description: `${apt.rooms} sobe, ${apt.size}m²`,
      price: Number(apt.price),
      bathroom: 1,
      roomType: 'Apartment',
      features: [],
      images: apt.image_url ? [apt.image_url] : [],
      availability: true,
    }],
  };
}

/**
 * Custom hook for accommodation filtering logic
 * Loads all data from the database/API only.
 */
export const useAccommodationFilters = () => {
  const [filters, setFilters] = useState<AccommodationFilters>({
    location: 'all',
    capacity: 2,
    accommodationType: 'all'
  });
  const [showFilters, setShowFilters] = useState(true);

  const [dbHotels, setDbHotels] = useState<GroupedHotel[]>([]);
  const [dbVillas, setDbVillas] = useState<GroupedVilla[]>([]);
  const [dbApartments, setDbApartments] = useState<GroupedApartment[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/hotels').then(r => r.ok ? r.json() : []),
      fetch('/api/villas').then(r => r.ok ? r.json() : []),
      fetch('/api/apartments').then(r => r.ok ? r.json() : []),
    ]).then(([hotels, villas, apartments]) => {
      setDbHotels((hotels as DbHotel[]).map(mapDbHotelToGrouped));
      setDbVillas((villas as DbVilla[]).map(mapDbVillaToGrouped));
      setDbApartments((apartments as DbApartment[]).map(mapDbApartmentToGrouped));
    }).catch(() => {});
  }, []);

  // Memoized filtered accommodations
  const filteredAccommodations = useMemo(() => {
    let filteredHotels: GroupedHotel[] = [];
    let filteredApartments: GroupedApartment[] = [];
    let filteredVillas: GroupedVilla[] = [];

    // Filter hotels by location
    if (filters.accommodationType === 'all' || filters.accommodationType === 'hotel') {
      filteredHotels = filters.location === 'all'
        ? dbHotels
        : dbHotels.filter(h => h.location === filters.location);

      if (filters.capacity > 0) {
        filteredHotels = filteredHotels.filter(hotel =>
          hotel.rooms.some(() => filters.capacity <= 3)
        );
      }
    }

    // Filter apartments by location
    if (filters.accommodationType === 'all' || filters.accommodationType === 'apartment') {
      filteredApartments = filters.location === 'all'
        ? dbApartments
        : dbApartments.filter(a => a.location === filters.location);

      if (filters.capacity > 0) {
        filteredApartments = filteredApartments.filter(apartment =>
          apartment.rooms.some(() => filters.capacity <= 4)
        );
      }
    }

    // Filter villas by location
    if (filters.accommodationType === 'all' || filters.accommodationType === 'villa') {
      filteredVillas = filters.location === 'all'
        ? dbVillas
        : dbVillas.filter(v => v.location === filters.location);

      if (filters.capacity > 0) {
        filteredVillas = filteredVillas.filter(villa =>
          villa.rooms.some(() => filters.capacity <= 6)
        );
      }
    }

    return [...filteredHotels, ...filteredApartments, ...filteredVillas] as AccommodationItem[];
  }, [filters, dbHotels, dbVillas, dbApartments]);

  const updateFilters = (newFilters: Partial<AccommodationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      location: 'all',
      capacity: 2,
      accommodationType: 'all'
    });
    setShowFilters(false);
  };

  return {
    filters,
    filteredAccommodations,
    showFilters,
    setShowFilters,
    updateFilters,
    resetFilters
  };
};
