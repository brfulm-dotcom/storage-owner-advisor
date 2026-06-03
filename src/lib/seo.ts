// =============================================================
// SEO UTILITIES (Supabase version)
// Uses the new database types instead of flat file types.
// =============================================================

import { Vendor, Category } from '@/lib/supabase';

const BASE_URL = 'https://www.storageowneradvisor.com';

/**
 * Truncate a meta title at a word boundary so it fits Google's SERP display.
 * Google shows about 580 pixels of title; 60 characters is a safe cap.
 * If the input is already short enough, returns it unchanged.
 * Otherwise trims to the last space before the limit and appends an ellipsis.
 */
export function clampTitle(text: string, max = 60): string {
  if (!text) return text;
  if (text.length <= max) return text;
  const sliced = text.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const base = lastSpace > max * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return base.replace(/[,;:\s]+$/, '') + '…';
}

/**
 * Build a meta title that always preserves the brand suffix, clamping only
 * the variable prefix when needed. Default brand: " | StorageOwnerAdvisor".
 */
export function brandedTitle(
  prefix: string,
  max = 60,
  brand = ' | StorageOwnerAdvisor'
): string {
  return clampTitle(prefix, max - brand.length) + brand;
}

/**
 * Same as clampTitle but for meta descriptions. Google's SERP description
 * caps around 155 characters before truncation.
 */
export function clampDescription(text: string, max = 155): string {
  if (!text) return text;
  if (text.length <= max) return text;
  const sliced = text.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const base = lastSpace > max * 0.7 ? sliced.slice(0, lastSpace) : sliced;
  return base.replace(/[,;:\s]+$/, '') + '…';
}

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
    ...(vendor.rating > 0 && vendor.review_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: vendor.rating,
        reviewCount: vendor.review_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
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

// Generates JSON-LD breadcrumbs for vendor pages
export function generateVendorBreadcrumbJsonLd(vendor: Vendor, category: Category | null) {
  const items = [
    { name: 'Home', url: BASE_URL },
  ];
  if (category) {
    items.push({ name: category.name, url: `${BASE_URL}/category/${category.slug}` });
  }
  items.push({ name: vendor.name, url: `${BASE_URL}/vendor/${vendor.slug}` });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generates JSON-LD breadcrumbs for category pages
export function generateCategoryBreadcrumbJsonLd(category: Category) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.name,
        item: `${BASE_URL}/category/${category.slug}`,
      },
    ],
  };
}

// Generates JSON-LD LocalBusiness for local vendors
export function generateLocalBusinessJsonLd(vendor: Vendor) {
  if (vendor.service_area !== 'local') return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: vendor.name,
    description: vendor.short_description,
    url: vendor.website,
    telephone: vendor.phone || undefined,
    email: vendor.email || undefined,
    ...(vendor.city && vendor.state && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: vendor.city,
        addressRegion: vendor.state,
      },
    }),
    ...(vendor.rating > 0 && vendor.review_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: vendor.rating,
        reviewCount: vendor.review_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

/**
 * Strip HTML tags and collapse whitespace. Used to clean text extracted from
 * stored blog content before putting it into structured data.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export interface FaqPair {
  question: string;
  answer: string;
}

/**
 * Find H2 or H3 headings ending with "?" in HTML content and pair each with
 * the prose that follows it (until the next heading). Used to auto-generate
 * FAQ schema for posts that already have Q-shaped sections.
 */
export function extractFaqFromContent(html: string, max = 10): FaqPair[] {
  if (!html) return [];
  const pairs: FaqPair[] = [];
  // Split on opening H2/H3 tags so each chunk starts with one heading. This
  // prevents the next regex from matching across multiple headings when an
  // earlier H2 has no "?" and the engine extends into the next section.
  const chunks = html.split(/(?=<h[23][^>]*>)/i);
  const sectionRe = /^<h([23])[^>]*>([\s\S]*?\?)\s*<\/h\1>([\s\S]*)$/i;
  for (const chunk of chunks) {
    const m = chunk.match(sectionRe);
    if (!m) continue;
    const question = stripHtml(m[2]);
    const answer = stripHtml(m[3]);
    if (question && answer && answer.length > 20) {
      pairs.push({ question, answer });
      if (pairs.length >= max) break;
    }
  }
  return pairs;
}

/**
 * Build FAQPage JSON-LD from an array of Q/A pairs. Returns null if fewer
 * than 2 pairs (Google won't show rich results for a single Q).
 */
export function generateFaqJsonLd(pairs: FaqPair[]) {
  if (!pairs || pairs.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: p.answer,
      },
    })),
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
