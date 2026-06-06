// =============================================================
// SITEMAP GENERATOR (Supabase version)
// Pulls categories, vendors, and SEO landing-page combinations from
// the database. City-level /best/... pages are intentionally excluded:
// they are noindex (near-duplicate, very numerous) so they don't belong
// in the sitemap. Only state-level landing pages are submitted, and only
// when they clear the thin threshold (3 vendors).
// =============================================================

import { MetadataRoute } from 'next';
import {
  getCategories,
  getVendors,
  getUniqueStates,
  getCategorySlugs,
  getBlogPostSlugs,
  getVendorsByState,
  getVendorsByStateAndCategory,
  type Vendor,
} from '@/lib/supabase';

const BASE_URL = 'https://www.storageowneradvisor.com';
const THIN_THRESHOLD = 3;

function stateToSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, '-');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, vendors, states, categorySlugs, blogSlugs] = await Promise.all([
    getCategories(),
    getVendors(),
    getUniqueStates(),
    getCategorySlugs(),
    getBlogPostSlugs(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/premium`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/affiliate-disclosure`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    // /search and /admin intentionally excluded (utility/protected pages).
    // /compare/* intentionally excluded (pages are noindex).
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Vendor pages
  const vendorPages: MetadataRoute.Sitemap = vendors.map((vendor) => ({
    url: `${BASE_URL}/vendor/${vendor.slug}`,
    lastModified: vendor.updated_at ? new Date(vendor.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Pre-fetch the data needed to decide which state-level landing pages have
  // enough content to be worth indexing. Same threshold (>=3 vendors) the
  // /best/... pages use. City-level pages are noindex and excluded entirely.
  const [stateVendorEntries, stateCategoryVendorEntries] = await Promise.all([
    Promise.all(
      states.map(async (state) => ({ state, vendors: await getVendorsByState(state) }))
    ),
    Promise.all(
      states.flatMap((state) =>
        categorySlugs.map(async (cat) => ({
          state,
          cat,
          vendors: await getVendorsByStateAndCategory(state, cat),
        }))
      )
    ),
  ]);

  const stateVendorMap = new Map<string, Vendor[]>(
    stateVendorEntries.map(({ state, vendors }) => [state, vendors])
  );
  const stateCatVendorMap = new Map<string, Vendor[]>(
    stateCategoryVendorEntries.map(({ state, cat, vendors }) => [`${state}|${cat}`, vendors])
  );

  // State overviews: include only when the page would be indexable.
  const stateOverviewPages: MetadataRoute.Sitemap = states
    .filter((state) => (stateVendorMap.get(state)?.length ?? 0) >= THIN_THRESHOLD)
    .map((state) => ({
      url: `${BASE_URL}/best/storage-vendors/${stateToSlug(state)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  // State + category combinations.
  const stateCategoryPages: MetadataRoute.Sitemap = states.flatMap((state) =>
    categorySlugs
      .filter((cat) => (stateCatVendorMap.get(`${state}|${cat}`)?.length ?? 0) >= THIN_THRESHOLD)
      .map((cat) => ({
        url: `${BASE_URL}/best/${cat}/${stateToSlug(state)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }))
  );

  // Blog post pages
  const blogUrls: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...vendorPages,
    ...stateOverviewPages,
    ...stateCategoryPages,
    ...blogUrls,
  ];
}
