import { getFeaturedVendors, getCategories } from '@/lib/supabase';
import VendorCard from '@/components/VendorCard';

export default async function FeaturedVendors() {
  const [featuredVendors, categories] = await Promise.all([
    getFeaturedVendors(),
    getCategories(),
  ]);

  if (featuredVendors.length === 0) {
    return null;
  }

  // Build a lookup map for category names
  const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));

  return (
    <section className="py-12 sm:py-14 md:py-16 bg-white">
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
            <VendorCard
              key={vendor.slug}
              vendor={vendor}
              categoryName={categoryMap.get(vendor.category_slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
