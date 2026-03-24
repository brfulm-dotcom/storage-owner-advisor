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
      <section className="py-0">
        <HeroSection />
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find vendors across all major storage facility service areas
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Vendors
            </h2>
            <p className="text-xl text-gray-600">
              Highly-rated solutions trusted by storage facility owners
            </p>
          </div>
          <FeaturedVendors />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <CTASection />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
