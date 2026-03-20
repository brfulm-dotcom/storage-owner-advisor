import { getFeaturedVendors } from '@/data/vendors';
import VendorCard from '@/components/VendorCard';

export default function FeaturedVendors() {
  const featuredVendors = getFeaturedVendors();

  if (featuredVendors.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Featured Vendors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by storage operators nationwide
          </p>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVendors.map((vendor) => (
            <VendorCard key={vendor.slug} vendor={vendor} />
          ))}
        </div>
      </div>
    </section>
  );
}
