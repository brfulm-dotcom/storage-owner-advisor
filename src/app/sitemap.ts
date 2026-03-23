// =============================================================
// SITEMAP GENERATOR (Supabase version)
// Now pulls categories and vendors from the database.
// =============================================================

import { MetadataRoute } from 'next';
import { getCategories, getVendors } from '@/lib/supabase';

const BASE_URL = 'https://www.storageowneradvisor.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch data from Supabase
  const [categories, vendors] = await Promise.all([
    getCategories(),
    getVendors(),
  ]);

  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
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

  return [...staticPages, ...categoryPages, ...vendorPages];
}
