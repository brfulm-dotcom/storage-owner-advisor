// =============================================================
// SEO UTILITIES (Supabase version)
// Uses the new database types instead of flat file types.
// =============================================================

import { Vendor, Category } from '@/lib/supabase';

const BASE_URL = 'https://www.storageowneradvisor.com';

// Generates JSON-LD for a vendor
export function generateVendorJsonLd(vendor: Vendor) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vendor.name,
    description: vendor.short_description,
    url: `${BASE_URL}/vendor/${vendor.slug}`,
    brand: {
      '@type': 'Organization',
      name: vendor.name,
      url: vendor.website,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: vendor.rating,
      reviewCount: vendor.review_count,
      bestRating: 5,
      worstRating: 1,
    },
    ...(vendor.pricing && {
      offers: {
        '@type': 'Offer',
        description: vendor.pricing,
      },
    }),
  };
}

// Generates JSON-LD for a category page
export function generateCategoryJsonLd(category: Category) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} - Self Storage Vendors`,
    description: category.description,
    url: `${BASE_URL}/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      name: category.name,
      numberOfItems: category.vendor_count,
    },
  };
}

// Generates JSON-LD for the homepage
export function generateHomeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'StorageOwnerAdvisor',
    description: 'The #1 directory of vetted service providers, equipment suppliers, and technology partners for self-storage owners and operators.',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
