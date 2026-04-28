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

export const revalidate = 3600;

interface CityCategoryPageProps {
  params: Promise<{
    category: string;
    state: string;
    city: string;
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

function cityToSlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-');
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

  // Pre-generate top 5 cities per state per category to keep build time reasonable.
  // ISR + dynamicParams (default) generates the rest on demand.
  const params: { category: string; state: string; city: string }[] = [];
  for (const state of states) {
    const cities = await getUniqueCitiesByState(state);
    const topCities = cities.slice(0, 5);
    for (const category of categorySlugs) {
      for (const city of topCities) {
        params.push({
          category,
          state: stateToSlug(state),
          city: cityToSlug(city),
        });
      }
    }
  }
  return params;
}

export async function generateMetadata(props: CityCategoryPageProps): Promise<Metadata> {
  const { category, state, city } = await props.params;
  const stateName = slugToName(state);
  const cityName = slugToName(city);
  const categoryName = categoryToReadable(category);
  const year = new Date().getFullYear();

  return {
    title: `Best ${categoryName} in ${cityName}, ${stateName} (${year}) | StorageOwnerAdvisor`,
    description: `Compare top ${categoryName.toLowerCase()} providers serving storage facilities in ${cityName}, ${stateName}. Read reviews, compare features, and find the best local solution.`,
    alternates: {
      canonical: `https://www.storageowneradvisor.com/best/${category}/${state}/${city}`,
    },
    openGraph: {
      title: `Best ${categoryName} in ${cityName}, ${stateName} (${year})`,
      description: `Find and compare ${categoryName.toLowerCase()} providers in ${cityName}, ${stateName}.`,
      type: 'website',
    },
  };
}

export default async function CityCategoryPage(props: CityCategoryPageProps) {
  const { category, state, city } = await props.params;
  const stateName = slugToName(state);
  const cityName = slugToName(city);
  const categoryName = categoryToReadable(category);
  const year = new Date().getFullYear();

  const [allVendors, categoryData, categories, citiesInState] = await Promise.all([
    getVendorsByStateAndCategory(stateName, category),
    getCategoryBySlug(category),
    getCategories(),
    getUniqueCitiesByState(stateName),
  ]);

  // Local vendors specifically in this city
  const cityVendors = allVendors.filter(
    (v) =>
      v.city?.toLowerCase() === cityName.toLowerCase() &&
      v.state?.toLowerCase() === stateName.toLowerCase()
  );

  // National vendors that also serve this area
  const nationalVendors = allVendors.filter(
    (v) =>
      v.service_area?.toLowerCase() === 'national' &&
      v.city?.toLowerCase() !== cityName.toLowerCase()
  );

  const totalVendors = cityVendors.length + nationalVendors.length;

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${categoryName} in ${cityName}, ${stateName}`,
    description: `Top-rated ${categoryName.toLowerCase()} providers in ${cityName}, ${stateName}`,
    numberOfItems: totalVendors,
    itemListElement: [...cityVendors, ...nationalVendors].slice(0, 10).map((vendor, index) => ({
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.storageowneradvisor.com' },
      { '@type': 'ListItem', position: 2, name: categoryData?.name || categoryName, item: `https://www.storageowneradvisor.com/category/${category}` },
      { '@type': 'ListItem', position: 3, name: stateName, item: `https://www.storageowneradvisor.com/best/${category}/${state}` },
      { '@type': 'ListItem', position: 4, name: cityName, item: `https://www.storageowneradvisor.com/best/${category}/${state}/${city}` },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
            <Link href={`/best/${category}/${state}`} className="hover:text-white">
              {stateName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{cityName}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Best {categoryName} in {cityName}, {stateName} ({year})
          </h1>
          <p className="text-lg text-teal-100 max-w-3xl">
            {totalVendors > 0
              ? `Compare ${totalVendors} top-rated ${categoryName.toLowerCase()} providers serving storage facilities in ${cityName} and the surrounding ${stateName} area.`
              : `We're building our directory of ${categoryName.toLowerCase()} providers in ${cityName}, ${stateName}.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Local vendors in this city */}
            {cityVendors.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {categoryData?.name || slugToName(category)} Providers in {cityName}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({cityVendors.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cityVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.slug}
                      vendor={vendor}
                      categoryName={categoryData?.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* National vendors serving the area */}
            {nationalVendors.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  National Providers Serving {cityName}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({nationalVendors.length})
                  </span>
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  These companies serve storage facilities nationwide, including {cityName}, {stateName}.
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

            {/* Empty state */}
            {totalVendors === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  No vendors found in {cityName} yet
                </h2>
                <p className="text-gray-600 mb-4">
                  We don&apos;t have any {categoryName.toLowerCase()} vendors specifically in {cityName}, {stateName} yet.
                  See our full {stateName} listings or submit a vendor below.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link
                    href={`/best/${category}/${state}`}
                    className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700"
                  >
                    See all {stateName} providers
                  </Link>
                  <Link
                    href="/submit"
                    className="inline-block bg-white text-teal-700 border border-teal-300 px-6 py-3 rounded-lg font-bold hover:bg-teal-50"
                  >
                    Submit a Vendor
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Other cities in this state */}
            {citiesInState.length > 1 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">
                  Other Cities in {stateName}
                </h3>
                <div className="space-y-1">
                  {citiesInState
                    .filter((c) => c.toLowerCase() !== cityName.toLowerCase())
                    .slice(0, 10)
                    .map((c) => (
                      <Link
                        key={c}
                        href={`/best/${category}/${state}/${cityToSlug(c)}`}
                        className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {categoryData?.name || slugToName(category)} in {c}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Other categories in this city */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-3">
                Other Categories in {cityName}
              </h3>
              <div className="space-y-1">
                {categories
                  .filter((c) => c.slug !== category && c.visible)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      href={`/best/${c.slug}/${state}/${city}`}
                      className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {c.name} in {cityName}
                    </Link>
                  ))}
              </div>
            </div>

            {/* Up to state */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-3">
                Statewide Listings
              </h3>
              <Link
                href={`/best/${category}/${state}`}
                className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                All {categoryData?.name || slugToName(category)} in {stateName}
              </Link>
              <Link
                href={`/best/storage-vendors/${state}`}
                className="block text-sm text-blue-600 hover:text-blue-700 hover:underline mt-1"
              >
                All Storage Vendors in {stateName}
              </Link>
            </div>

            {/* CTA */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-bold text-teal-900 mb-2">
                Are you a vendor in {cityName}?
              </h3>
              <p className="text-sm text-teal-700 mb-3">
                Get listed and reach storage facility owners in {cityName}, {stateName}.
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
