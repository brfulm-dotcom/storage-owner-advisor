import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedVendors from '@/components/FeaturedVendors';
import CTASection from '@/components/CTASection';
import NewsletterSignup from '@/components/NewsletterSignup';

// Revalidate every 60 seconds so new data shows up without redeploying
export const revalidate = 60;

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturedVendors />
      <CategoryGrid />
      <CTASection />
      <NewsletterSignup />
    </div>
  );
}
