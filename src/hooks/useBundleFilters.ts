
import { useState, useEffect } from "react";
import { Bundle } from "@/types/bundle";

interface BundleFilters {
  duration: [number, number];
  budget: [number, number];
  travelers: number;
  regions: string[];
  experiences: string[];
}

function mapDbBundle(db: Record<string, unknown>): Bundle {
  return {
    id: String(db.id),
    title: (db.title as string) || '',
    subtitle: (db.subtitle as string) || '',
    description: (db.description as string) || '',
    duration: Number(db.duration),
    pricePerPerson: Number(db.price_per_person),
    pricePerGroup: Number(db.price_per_group) || 0,
    maxGroupSize: Number(db.max_group_size) || 8,
    regions: (db.regions as string[]) || [],
    tags: (db.tags as string[]) || [],
    highlights: (db.highlights as string[]) || [],
    includes: (db.includes as string[]) || [],
    itinerary: (db.itinerary as Bundle['itinerary']) || [],
    images: (db.images as string[]) || [],
    addons: (db.addons as Bundle['addons']) || [],
  };
}

export function useBundleFilters() {
  const [dbBundles, setDbBundles] = useState<Bundle[]>([]);
  const [filteredBundles, setFilteredBundles] = useState<Bundle[]>([]);
  const [filters, setFilters] = useState<BundleFilters>({
    duration: [1, 14],
    budget: [30, 150],
    travelers: 4,
    regions: [],
    experiences: []
  });

  useEffect(() => {
    fetch('/api/bundles')
      .then(r => r.ok ? r.json() : [])
      .then(data => setDbBundles((data as Record<string, unknown>[]).map(mapDbBundle)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const filtered = dbBundles.filter(bundle => {
      if (bundle.duration < filters.duration[0] || bundle.duration > filters.duration[1]) {
        return false;
      }
      const budgetPerPerson = bundle.pricePerPerson;
      if (budgetPerPerson < filters.budget[0] || budgetPerPerson > filters.budget[1]) {
        return false;
      }
      if (filters.regions.length > 0 && !bundle.regions.some(region => filters.regions.includes(region))) {
        return false;
      }
      if (filters.experiences.length > 0 && !bundle.tags.some(tag => filters.experiences.includes(tag))) {
        return false;
      }
      return true;
    });

    setFilteredBundles(filtered);
  }, [filters, dbBundles]);

  const resetFilters = () => {
    setFilters({
      duration: [1, 14],
      budget: [30, 150],
      travelers: 4,
      regions: [],
      experiences: []
    });
  };

  return {
    filters,
    setFilters,
    filteredBundles,
    resetFilters
  };
}
