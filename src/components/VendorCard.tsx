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

// Door color variants by tier
type DoorTheme = {
  borderClass: string;
  background: string;
};

const doorThemes: Record<'free' | 'featured' | 'premium', DoorTheme> = {
  // Orange — free
  free: {
    borderClass: 'border-orange-900 border-b-orange-950',
    background: [
      'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0) 12px)',
      'repeating-linear-gradient(to bottom, #fb923c 0, #fb923c 3px, #ea580c 3px, #ea580c 6px, #c2410c 6px, #c2410c 7px)',
    ].join(', '),
  },
  // Forest green — featured
  featured: {
    borderClass: 'border-green-900 border-b-green-950',
    background: [
      'linear-gradient(to bottom, rgba(0,0,0,0.20), rgba(0,0,0,0) 12px)',
      'repeating-linear-gradient(to bottom, #22c55e 0, #22c55e 3px, #15803d 3px, #15803d 6px, #14532d 6px, #14532d 7px)',
    ].join(', '),
  },
  // Gold — premium
  premium: {
    borderClass: 'border-amber-800 border-b-amber-900',
    background: [
      'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0) 12px)',
      'repeating-linear-gradient(to bottom, #fbbf24 0, #fbbf24 3px, #d97706 3px, #d97706 6px, #b45309 6px, #b45309 7px)',
    ].join(', '),
  },
};

const railStyle: React.CSSProperties = {
  background: 'linear-gradient(to right, #44403c, #78716c, #44403c)',
};

const placardStyle: React.CSSProperties = {
  background: 'linear-gradient(to bottom, #f3f4f6, #d1d5db)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 3px rgba(0,0,0,0.4)',
};

const rivetStyle: React.CSSProperties = {
  background: 'radial-gradient(circle at 30% 30%, #9ca3af, #4b5563)',
  boxShadow: '0 1px 1px rgba(0,0,0,0.4)',
};

function Placard({ label }: { label: string }) {
  return (
    <span
      className="relative z-10 inline-block px-3.5 py-1 text-[11px] font-extrabold tracking-widest uppercase text-gray-900 border border-gray-500 rounded-sm"
      style={placardStyle}
    >
      <span
        className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
        style={rivetStyle}
        aria-hidden="true"
      />
      {label}
      <span
        className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
        style={rivetStyle}
        aria-hidden="true"
      />
    </span>
  );
}

export default function VendorCard({ vendor, categoryName }: VendorCardProps) {
  const tier: 'free' | 'featured' | 'premium' =
    vendor.tier === 'premium' ? 'premium' : vendor.tier === 'featured' ? 'featured' : 'free';
  const theme = doorThemes[tier];
  const placardLabel = tier === 'premium' ? 'PREMIUM' : tier === 'featured' ? 'FEATURED' : null;

  return (
    <div className="h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      {/* Roll-up storage door */}
      <div
        className={`relative h-14 border border-b-[3px] flex items-center justify-center ${theme.borderClass}`}
        style={{
          backgroundImage: theme.background,
          boxShadow: 'inset 0 -6px 8px rgba(0,0,0,0.25)',
        }}
      >
        <div className="absolute top-0 -bottom-px left-0 w-1.5 z-10" style={railStyle} aria-hidden="true" />
        <div className="absolute top-0 -bottom-px right-0 w-1.5 z-10" style={railStyle} aria-hidden="true" />
        {placardLabel && <Placard label={placardLabel} />}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-9 h-2 bg-gray-800 rounded-sm shadow-md z-20"
          aria-hidden="true"
        />
      </div>

      <div className="p-4 border-l-[3px] border-r-[3px] border-b border-stone-500 border-b-gray-200">
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
            className="flex-1 text-center py-1.5 text-sm text-white font-medium rounded-md bg-blue-900 hover:bg-blue-800 transition-colors"
          >
            Details
          </Link>
          <a
            href={ensureUrl(vendor.affiliate_url || vendor.website)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(vendor.slug, vendor.name, vendor.affiliate_url ? 'affiliate' : 'website')}
            className="flex-1 text-center py-1.5 text-sm text-white font-medium rounded-md bg-blue-900 hover:bg-blue-800 transition-colors"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
}
