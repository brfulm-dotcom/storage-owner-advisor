import { getCategories } from '@/lib/supabase';
import CategoryCard from '@/components/CategoryCard';

export default async function CategoryGrid() {
  const allCategories = await getCategories();
  // Only show categories marked visible with at least 1 vendor
  const categories = allCategories.filter((c) => c.visible && c.vendor_count > 0);

  return (
    <section className="py-12 sm:py-14 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive directory of service categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
