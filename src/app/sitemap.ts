// =============================================================
// SITEMAP GENERATOR
// This automatically creates a sitemap.xml for Google.
// Google uses this to discover and index all your pages.
// Every time you add a vendor or category, it's included.
// =============================================================

import { MetadataRoute } from 'next';
import { categories } from '@/data/categories';
import { vendors } from '@/data/vendors';

const BASE_URL = 'https://www.storageowneradvisor.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
  ];

  // Category pages (high priority — these are your money pages for SEO)
  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Vendor pages
  const vendorPages = vendors.map((vendor) => ({
    url: `${BASE_URL}/vendor/${vendor.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...vendorPages];
}
