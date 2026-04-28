// =============================================================
// SITEMAP GENERATOR (Supabase version)
// Now pulls categories and vendors from the database.
// =============================================================

import { MetadataRoute } from 'next';
import { getCategories, getVendors, getVendorsByCategory, getUniqueStates, getCategorySlugs, getBlogPostSlugs, getUniqueCitiesByState } from '@/lib/supabase';

const BASE_URL = 'https://www.storageowneradvisor.com';

function stateToSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, '-');
}

function cityToSlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch data from Supabase
  const [categories, vendors, states, categorySlugs, blogSlugs] = await Promise.all([
    getCategories(),
    getVendors(),
    getUniqueStates(),
    getCategorySlugs(),
    getBlogPostSlugs(),
  ]);

  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${BASE_URL}/premium`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/affiliate-disclosure`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    // Note: /search and /admin are intentionally excluded (utility/protected pages)
  ];

  // Category pages
  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Vendor pages
  const vendorPages = vendors.map((vendor) => ({
    url: `${BASE_URL}/vendor/${vendor.slug}`,
    lastModified: vendor.updated_at ? new Date(vendor.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // SEO Landing Pages - State overviews
  const stateOverviewPages = states.map((state) => ({
    url: `${BASE_URL}/best/storage-vendors/${stateToSlug(state)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // SEO Landing Pages - State + Category combinations
  const stateCategoryPages = states.flatMap((state) =>
    categorySlugs.map((cat) => ({
      url: `${BASE_URL}/best/${cat}/${stateToSlug(state)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  // SEO Landing Pages - City pages (storage-vendors overview + per category)
  // Pull cities for each state in parallel, then expand into per-category combos.
  const cityResults = await Promise.all(
    states.map(async (state) => ({
      state,
      cities: await getUniqueCitiesByState(state),
    }))
  );

  const cityOverviewPages = cityResults.flatMap(({ state, cities }) =>
    cities.map((city) => ({
      url: `${BASE_URL}/best/storage-vendors/${stateToSlug(state)}/${cityToSlug(city)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  const cityCategoryPages = cityResults.flatMap(({ state, cities }) =>
    cities.flatMap((city) =>
      categorySlugs.map((cat) => ({
        url: `${BASE_URL}/best/${cat}/${stateToSlug(state)}/${cityToSlug(city)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    )
  );

  // Blog post pages
  const blogUrls = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Comparison pages - management software (highest value)
  // IMPORTANT: emit slugs in alphabetical order to match the canonical
  // tag set by compare/[slug]/page.tsx (which sorts alphabetically).
  // Mismatched ordering causes "Alternate page with proper canonical
  // tag" reports in Google Search Console.
  const softwareVendors = await getVendorsByCategory('management-software');
  const topSoftware = softwareVendors.slice(0, 10);
  const comparePages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < topSoftware.length; i++) {
    for (let j = i + 1; j < topSoftware.length; j++) {
      const canonicalSlug = [topSoftware[i].slug, topSoftware[j].slug].sort().join('-vs-');
      comparePages.push({
        url: `${BASE_URL}/compare/${canonicalSlug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...vendorPages,
    ...stateOverviewPages,
    ...stateCategoryPages,
    ...cityOverviewPages,
    ...cityCategoryPages,
    ...blogUrls,
    ...comparePages,
  ];
}
