'use client';

import { useState, useMemo } from 'react';
import VendorCard from '@/components/VendorCard';
import type { Vendor } from '@/lib/supabase';

type SortOption = 'rating' | 'reviews' | 'name-asc' | 'name-desc' | 'verified' | 'newest';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'verified', label: 'Verified First' },
  { value: 'newest', label: 'Newest Added' },
];

function sortVendors(vendors: Vendor[], sort: SortOption): Vendor[] {
  const sorted = [...vendors];
  switch (sort) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'reviews':
      return sorted.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'verified':
      return sorted.sort((a, b) => {
        if (a.verified === b.verified) return (b.rating || 0) - (a.rating || 0);
        return a.verified ? -1 : 1;
      });
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    default:
      return sorted;
  }
}

interface SortableVendorGridProps {
  vendors: Vendor[];
  defaultSort?: SortOption;
  showCount?: boolean;
}

export default function SortableVendorGrid({ vendors, defaultSort = 'rating', showCount = true }: SortableVendorGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);

  const sortedVendors = useMemo(() => sortVendors(vendors, sortBy), [vendors, sortBy]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        {showCount && (
          <p className="text-gray-600">
            Showing {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
          </p>
        )}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVendors.map((vendor) => (
          <VendorCard key={vendor.slug} vendor={vendor} />
        ))}
      </div>
    </>
  );
}

export { SORT_OPTIONS, sortVendors };
export type { SortOption };
