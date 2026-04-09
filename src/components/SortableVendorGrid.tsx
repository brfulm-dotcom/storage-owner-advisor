'use client';

import { useState, useMemo } from 'react';
import VendorCard from '@/components/VendorCard';
import type { Vendor } from '@/lib/supabase';

type SortOption = 'default' | 'rating' | 'reviews' | 'name-asc' | 'name-desc' | 'verified' | 'newest';
type ServiceAreaFilter = 'all' | 'national' | 'local';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Recommended' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'verified', label: 'Verified First' },
  { value: 'newest', label: 'Newest Added' },
];

const SERVICE_AREA_OPTIONS: { value: ServiceAreaFilter; label: string; icon: string }[] = [
  { value: 'all',      label: 'All',               icon: '' },
  { value: 'national', label: 'National / Online',  icon: '🌐' },
  { value: 'local',    label: 'Local / Regional',   icon: '📍' },
];

// Tier priority: featured first, then premium, then free
function getTierPriority(tier?: string): number {
  switch (tier) {
    case 'featured': return 0;
    case 'premium': return 1;
    default: return 2;
  }
}

function sortVendors(vendors: Vendor[], sort: SortOption): Vendor[] {
  const sorted = [...vendors];
  switch (sort) {
    case 'default':
      // Featured → Premium → Free, then by rating, review count, name
      return sorted.sort((a, b) => {
        const tierDiff = getTierPriority(a.tier) - getTierPriority(b.tier);
        if (tierDiff !== 0) return tierDiff;
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        const reviewDiff = (b.review_count || 0) - (a.review_count || 0);
        if (reviewDiff !== 0) return reviewDiff;
        return a.name.localeCompare(b.name);
      });
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

export default function SortableVendorGrid({ vendors, defaultSort = 'default', showCount = true }: SortableVendorGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);
  const [serviceArea, setServiceArea] = useState<ServiceAreaFilter>('all');

  // Only show the service area filter if vendors have mixed coverage types
  const hasLocalVendors    = useMemo(() => vendors.some(v => v.service_area === 'local'),    [vendors]);
  const hasNationalVendors = useMemo(() => vendors.some(v => v.service_area === 'national'), [vendors]);
  const showServiceFilter  = hasLocalVendors && hasNationalVendors;

  const filteredVendors = useMemo(() => {
    if (serviceArea === 'all') return vendors;
    return vendors.filter(v => v.service_area === serviceArea);
  }, [vendors, serviceArea]);

  const sortedVendors = useMemo(() => sortVendors(filteredVendors, sortBy), [filteredVendors, sortBy]);

  return (
    <>
      {/* Service area filter — only shown when both local and national vendors exist */}
      {showServiceFilter && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-1">Coverage:</span>
            {SERVICE_AREA_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setServiceArea(opt.value)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  serviceArea === opt.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {opt.icon && <span>{opt.icon}</span>}
                {opt.label}
              </button>
            ))}
            {serviceArea === 'local' && (
              <span className="text-xs text-gray-500 ml-2">
                Tip: call ahead — local suppliers can often fulfill same-day
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        {showCount && (
          <p className="text-gray-600">
            Showing {sortedVendors.length}{sortedVendors.length !== vendors.length ? ` of ${vendors.length}` : ''} vendor{vendors.length !== 1 ? 's' : ''}
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

      {sortedVendors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No vendors match this filter.</p>
          <button
            onClick={() => setServiceArea('all')}
            className="text-blue-600 hover:underline text-sm"
          >
            Show all vendors
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVendors.map((vendor) => (
            <VendorCard key={vendor.slug} vendor={vendor} />
          ))}
        </div>
      )}
    </>
  );
}

export { SORT_OPTIONS, sortVendors };
export type { SortOption };
