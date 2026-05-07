// =============================================================
// SITEMAP GENERATOR (Supabase version)
// Pulls categories, vendors, and SEO landing-page combinations from
// the database. Empty/thin combinations are filtered out so we don't
// submit URLs to Google that the pages themselves mark noindex.
// Threshold (3 vendors) matches the isThin check in each /best/... page.
// =============================================================

import { MetadataRoute } from 'next';
import {
  getCategories,
  getVendors,
  getUniqueStates,
  getCategorySlugs,
  getBlogPostSlugs,
  getUniqueCitiesByState,
  getVendorsByState,
  getVendorsByStateAndCategory,
  type Vendor,
} from '@/lib/supabase';

const BASE_URL = 'https://www.storageowneradvisor.com';
const THIN_THRESHOLD = 3;

function stateToSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, '-');
}

function cityToSlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-');
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

  // Pre-fetch the data needed to decide which SEO landing pages have enough
  // content to be worth indexing. We do this once up front so filtering is
  // local — same threshold (>=3 vendors) the /best/... pages use to decide
  // whether to noindex themselves.
  const [stateVendorEntries, stateCategoryVendorEntries, cityResults] = await Promise.all([
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
    Promise.all(
      states.map(async (state) => ({ state, cities: await getUniqueCitiesByState(state) }))
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

  // City overviews: include only when at least 3 vendors are physically in the city.
  // Mirrors the localCount check in best/storage-vendors/[state]/[city]/page.tsx.
  const cityOverviewPages: MetadataRoute.Sitemap = cityResults.flatMap(({ state, cities }) => {
    const stateVend = stateVendorMap.get(state) ?? [];
    return cities
      .filter((city) => {
        const cityLower = city.toLowerCase();
        const local = stateVend.filter((v) => v.city?.toLowerCase() === cityLower).length;
        return local >= THIN_THRESHOLD;
      })
      .map((city) => ({
        url: `${BASE_URL}/best/storage-vendors/${stateToSlug(state)}/${cityToSlug(city)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
  });

  // City + category combinations: include only when local + national vendors >= 3.
  // Mirrors the isThin check in best/[category]/[state]/[city]/page.tsx so we
  // never submit a URL whose page would mark itself noindex.
  const cityCategoryPages: MetadataRoute.Sitemap = cityResults.flatMap(({ state, cities }) => {
    const stateLower = state.toLowerCase();
    return cities.flatMap((city) => {
      const cityLower = city.toLowerCase();
      return categorySlugs
        .filter((cat) => {
          const all = stateCatVendorMap.get(`${state}|${cat}`) ?? [];
          const local = all.filter(
            (v) => v.city?.toLowerCase() === cityLower && v.state?.toLowerCase() === stateLower
          ).length;
          const national = all.filter(
            (v) =>
              v.service_area?.toLowerCase() === 'national' && v.city?.toLowerCase() !== cityLower
          ).length;
          return local + national >= THIN_THRESHOLD;
        })
        .map((cat) => ({
          url: `${BASE_URL}/best/${cat}/${stateToSlug(state)}/${cityToSlug(city)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        }));
    });
  });

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
    ...cityOverviewPages,
    ...cityCategoryPages,
    ...blogUrls,
  ];
}
