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

export default function VendorCard({ vendor, categoryName }: VendorCardProps) {
  const isFeatured = vendor.tier === 'featured' || vendor.tier === 'premium';

  return (
    <div
      className={`h-full bg-white rounded-lg border transition-all duration-300 overflow-hidden ${
        isFeatured
          ? 'border-orange-400 shadow-md hover:shadow-lg'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      {/* Premium/Featured top accent bar */}
      {isFeatured && (
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-1.5 flex items-center justify-between">
          <span className="text-white text-xs font-bold tracking-wide">
            {vendor.tier === 'premium' ? '⭐ PREMIUM' : '✨ FEATURED'}
          </span>
          {categoryName && (
            <span className="text-orange-100 text-xs font-medium">
              {categoryName}
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Top row: Name + Category (for free tier) */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-gray-900 line-clamp-1">
            {vendor.name}
          </h3>
          {!isFeatured && categoryName && (
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
            href={vendor.affiliate_url || vendor.website}
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
