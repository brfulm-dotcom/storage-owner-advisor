import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getCategories,
  getCategoryBySlug,
  getVendorsByStateAndCategory,
  getUniqueStates,
  getCategorySlugs,
  getUniqueCitiesByState,
} from '@/lib/supabase';
import VendorCard from '@/components/VendorCard';

export const revalidate = 3600; // Revalidate every hour

interface SEOPageProps {
  params: Promise<{
    category: string;
    state: string;
  }>;
}

function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function stateToSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, '-');
}

function categoryToReadable(slug: string): string {
  const map: Record<string, string> = {
    'management-software': 'Self-Storage Management Software',
    'security-systems': 'Storage Security Systems',
    'climate-control-hvac': 'Climate Control & HVAC',
    'construction-building': 'Storage Construction & Building',
    'doors-hardware': 'Storage Doors, Locks & Hardware',
    'insurance': 'Storage Insurance & Risk Management',
    'consulting-brokerage': 'Storage Consulting & Brokerage',
    'marketing-web': 'Storage Marketing & Web Services',
    'moving-supplies': 'Moving & Packing Supplies',
    'payment-processing': 'Storage Payment Processing',
  };
  return map[slug] || slugToName(slug);
}

export async function generateStaticParams() {
  const [states, categorySlugs] = await Promise.all([
    getUniqueStates(),
    getCategorySlugs(),
  ]);

  const params: { category: string; state: string }[] = [];
  for (const category of categorySlugs) {
    for (const state of states) {
      params.push({ category, state: stateToSlug(state) });
    }
  }
  return params;
}

export async function generateMetadata(props: SEOPageProps): Promise<Metadata> {
  const { category, state } = await props.params;
  const stateName = slugToName(state);
  const categoryName = categoryToReadable(category);
  const year = new Date().getFullYear();

  return {
    title: `Best ${categoryName} in ${stateName} (${year}) | StorageOwnerAdvisor`,
    description: `Compare the top ${categoryName.toLowerCase()} providers in ${stateName}. Read reviews, compare features, and find the best solution for your storage facility.`,
    openGraph: {
      title: `Best ${categoryName} in ${stateName} (${year})`,
      description: `Find and compare the best ${categoryName.toLowerCase()} providers serving ${stateName} storage facilities.`,
      type: 'website',
    },
  };
}

export default async function SEOLandingPage(props: SEOPageProps) {
  const { category, state } = await props.params;
  const stateName = slugToName(state);
  const categoryName = categoryToReadable(category);
  const year = new Date().getFullYear();

  const [vendors, categoryData, categories, cities] = await Promise.all([
    getVendorsByStateAndCategory(stateName, category),
    getCategoryBySlug(category),
    getCategories(),
    getUniqueCitiesByState(stateName),
  ]);

  const localVendors = vendors.filter(
    (v) => v.state?.toLowerCase() === stateName.toLowerCase()
  );
  const nationalVendors = vendors.filter(
    (v) => v.service_area?.toLowerCase() === 'national' && v.state?.toLowerCase() !== stateName.toLowerCase()
  );

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${categoryName} in ${stateName}`,
    description: `Top-rated ${categoryName.toLowerCase()} providers serving ${stateName}`,
    numberOfItems: vendors.length,
    itemListElement: vendors.slice(0, 10).map((vendor, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: vendor.name,
        description: vendor.short_description,
        url: `https://www.storageowneradvisor.com/vendor/${vendor.slug}`,
        aggregateRating: vendor.review_count > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: vendor.rating,
          reviewCount: vendor.review_count,
        } : undefined,
      },
    })),
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-teal-200 mb-3">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${category}`} className="hover:text-white">
              {categoryData?.name || slugToName(category)}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{stateName}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Best {categoryName} in {stateName} ({year})
          </h1>
          <p className="text-lg text-teal-100 max-w-3xl">
            Compare {vendors.length} top-rated {categoryName.toLowerCase()} providers
            serving storage facilities in {stateName}. Read reviews, compare features,
            and find the right solution for your business.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Local Vendors */}
            {localVendors.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {categoryData?.name || slugToName(category)} Providers in {stateName}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({localVendors.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.slug}
                      vendor={vendor}
                      categoryName={categoryData?.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* National Vendors */}
            {nationalVendors.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  National Providers Serving {stateName}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({nationalVendors.length})
                  </span>
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  These companies serve storage facilities nationwide, including {stateName}.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nationalVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.slug}
                      vendor={vendor}
                      categoryName={categoryData?.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No vendors */}
            {vendors.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  No vendors found
                </h2>
                <p className="text-gray-600 mb-4">
                  We don&apos;t have any {categoryName.toLowerCase()} vendors in {stateName} yet.
                </p>
                <Link
                  href="/submit"
                  className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700"
                >
                  Submit a Vendor
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Cities in this state */}
            {cities.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">
                  Cities in {stateName}
                </h3>
                <div className="space-y-1">
                  {cities.map((city) => (
                    <Link
                      key={city}
                      href={`/best/${category}/${city.toLowerCase().replace(/\s+/g, '-')}-${stateToSlug(stateName)}`}
                      className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {categoryData?.name || slugToName(category)} in {city}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-3">
                Other Categories in {stateName}
              </h3>
              <div className="space-y-1">
                {categories
                  .filter((c) => c.slug !== category && c.visible)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      href={`/best/${c.slug}/${stateToSlug(stateName)}`}
                      className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {c.name} in {stateName}
                    </Link>
                  ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-bold text-teal-900 mb-2">
                Are you a vendor?
              </h3>
              <p className="text-sm text-teal-700 mb-3">
                Get listed on StorageOwnerAdvisor and reach storage facility owners in {stateName}.
              </p>
              <Link
                href="/submit"
                className="block text-center bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-700"
              >
                Submit Your Business
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
