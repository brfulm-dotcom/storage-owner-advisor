// =============================================================
// ROBOTS.TXT
// Tells search engines what they can and can't crawl.
// This is a permissive setup — we WANT Google to index everything.
// =============================================================

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.storageowneradvisor.com/sitemap.xml',
  };
}
