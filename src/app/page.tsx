import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedVendors from '@/components/FeaturedVendors';
import LatestBlogPosts from '@/components/LatestBlogPosts';
import CTASection from '@/components/CTASection';
import NewsletterSignup from '@/components/NewsletterSignup';
import AdSlot from '@/components/AdSlot';
import { getCategories, getVendors } from '@/lib/supabase';
import { generateHomeJsonLd } from '@/lib/seo';

// Revalidate hourly; admin actions trigger on-demand revalidation for instant updates
export const revalidate = 3600;

export default async function Home() {
  const [categories, vendors] = await Promise.all([
    getCategories(),
    getVendors(),
  ]);
  const visibleCategoryCount = categories.filter(
    (c) => c.visible && c.vendor_count > 0
  ).length;
  const vendorCount = vendors.length;
  const homeJsonLd = generateHomeJsonLd();

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HeroSection vendorCount={vendorCount} categoryCount={visibleCategoryCount} />
      <AdSlot slot="home-top" format="auto" />
      <FeaturedVendors />
      <AdSlot slot="home-mid" format="auto" layout="in-article" />
      <CategoryGrid />
      <LatestBlogPosts />
      <CTASection />
      <NewsletterSignup />
    </div>
  );
}
