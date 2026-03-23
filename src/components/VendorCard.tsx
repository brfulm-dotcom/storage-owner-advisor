import Link from 'next/link';
import { Vendor, getCategoryBySlug } from '@/lib/supabase';
import StarRating from '@/components/StarRating';

interface VendorCardProps {
  vendor: Vendor;
  categoryName?: string;
}

export default function VendorCard({ vendor, categoryName }: VendorCardProps) {
  const isFeatured = vendor.tier === 'featured' || vendor.tier === 'premium';

  return (
    <div
      className={`h-full p-6 bg-white rounded-lg border transition-all duration-300 ${
        isFeatured
          ? 'border-orange-400 shadow-md hover:shadow-lg'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      {/* Tier Badge */}
      {isFeatured && (
        <div className="mb-3 inline-block">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
            {vendor.tier === 'premium' ? '⭐ Premium' : '✨ Featured'}
          </span>
        </div>
      )}

      {/* Vendor Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
        {vendor.name}
      </h3>

      {/* Category Badge */}
      {categoryName && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            {categoryName}
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
        {vendor.short_description}
      </p>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={vendor.rating} reviewCount={vendor.review_count} />
      </div>

      {/* Pricing */}
      {vendor.pricing && (
        <p className="text-sm font-medium text-gray-700 mb-4">
          💰 {vendor.pricing}
        </p>
      )}

      {/* Links */}
      <div className="space-y-2">
        <Link
          href={`/vendor/${vendor.slug}`}
          className="block text-center py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          View Details →
        </Link>
        <a
          href={vendor.affiliate_url || vendor.website}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Visit Website
        </a>
      </div>
    </div>
  );
}
