'use client';

import Link from 'next/link';
import { Vendor } from '@/lib/supabase';
import StarRating from '@/components/StarRating';

interface VendorCardProps {
  vendor: Vendor;
  categoryName?: string;
}

function trackClick(vendorSlug: string, vendorName: string, clickType: string) {
  fetch('/api/track-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendor_slug: vendorSlug,
      vendor_name: vendorName,
      click_type: clickType,
    }),
  }).catch(() => {});
}

function ensureUrl(url: string | null | undefined): string {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

const doorStyle: React.CSSProperties = {
  backgroundImage: [
    'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0) 12px)',
    'repeating-linear-gradient(to bottom, #fb923c 0, #fb923c 3px, #ea580c 3px, #ea580c 6px, #c2410c 6px, #c2410c 7px)',
  ].join(', '),
  boxShadow: 'inset 0 -6px 8px rgba(0,0,0,0.25)',
};

const railStyle: React.CSSProperties = {
  background: 'linear-gradient(to right, #44403c, #78716c, #44403c)',
};

export default function VendorCard({ vendor, categoryName }: VendorCardProps) {
  const isFeatured = vendor.tier === 'featured' || vendor.tier === 'premium';

  return (
    <div className="h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      {/* Roll-up storage door */}
      <div
        className="relative h-14 border border-b-[3px] border-orange-900 border-b-orange-950"
        style={doorStyle}
      >
        <div className="absolute top-0 -bottom-px left-0 w-1.5" style={railStyle} aria-hidden="true" />
        <div className="absolute top-0 -bottom-px right-0 w-1.5" style={railStyle} aria-hidden="true" />
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-9 h-2 bg-gray-800 rounded-sm shadow-md"
          aria-hidden="true"
        />
      </div>

      <div className="p-4 border-l-[3px] border-r-[3px] border-b border-stone-500 border-b-gray-200">
        {/* Featured/Premium badge */}
        {isFeatured && (
          <div className="mb-2">
            <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold tracking-wide rounded">
              {vendor.tier === 'premium' ? '⭐ PREMIUM' : '✨ FEATURED'}
            </span>
          </div>
        )}

        {/* Top row: Name + Category */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-gray-900 line-clamp-1">
            {vendor.name}
          </h3>
          {categoryName && (
            <span className="flex-shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              {categoryName}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {vendor.short_description}
        </p>

        {/* Rating + Pricing row */}
        <div className="flex items-center justify-between mb-3">
          <StarRating rating={vendor.rating} reviewCount={vendor.review_count} />
          {vendor.pricing && (
            <span className="text-xs font-medium text-gray-500 flex-shrink-0 ml-2">
              {vendor.pricing}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-2">
          <Link
            href={`/vendor/${vendor.slug}`}
            onClick={() => trackClick(vendor.slug, vendor.name, 'details')}
            className="flex-1 text-center py-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
          >
            Details
          </Link>
          <a
            href={ensureUrl(vendor.affiliate_url || vendor.website)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(vendor.slug, vendor.name, vendor.affiliate_url ? 'affiliate' : 'website')}
            className={`flex-1 text-center py-1.5 text-sm text-white font-medium rounded-md transition-colors ${
              isFeatured
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
}
