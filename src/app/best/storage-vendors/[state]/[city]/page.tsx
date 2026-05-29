import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getCategories,
  getVendorsByState,
  getUniqueStates,
  getUniqueCitiesByState,
} from '@/lib/supabase';
import { brandedTitle, clampDescription, clampTitle } from '@/lib/seo';

export const revalidate = 3600;

interface CityOverviewProps {
  params: Promise<{ state: string; city: string }>;
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

export async function generateStaticParams() {
  const states = await getUniqueStates();
  const params: { state: string; city: string }[] = [];

  // Pre-generate top 5 cities per state. ISR fills in the rest on demand.
  for (const state of states) {
    const cities = await getUniqueCitiesByState(state);
    for (const city of cities.slice(0, 5)) {
      params.push({ state: stateToSlug(state), city: cityToSlug(city) });
    }
  }
  return params;
}

export async function generateMetadata(props: CityOverviewProps): Promise<Metadata> {
  const { state, city } = await props.params;
  const stateName = slugToName(state);
  const cityName = slugToName(city);
  const year = new Date().getFullYear();

  // Noindex thin pages (fewer than 3 local vendors) so Google doesn't flag
  // them as low-value content. Links are still followed.
  const allVendors = await getVendorsByState(stateName);
  const localCount = allVendors.filter(
    (v) => v.city?.toLowerCase() === cityName.toLowerCase()
  ).length;
  const isThin = localCount < 3;

  return {
    title: brandedTitle(`Storage Vendors in ${cityName}, ${stateName}`),
    description: clampDescription(`Find storage facility vendors serving ${cityName}, ${stateName} (${year}). Compare software, security, construction, insurance, and more across all categories.`),
    alternates: {
      canonical: `https://www.storageowneradvisor.com/best/storage-vendors/${state}/${city}`,
    },
    robots: isThin ? { index: false, follow: true } : undefined,
    openGraph: {
      title: clampTitle(`Best Storage Facility Vendors in ${cityName}, ${stateName} (${year})`),
      description: clampDescription(`Compare storage facility vendors across all categories serving ${cityName}, ${stateName}.`),
      type: 'website',
    },
  };
}

export default async function CityOverviewPage(props: CityOverviewProps) {
  const { state, city } = await props.params;
  const stateName = slugToName(state);
  const cityName = slugToName(city);
  const year = new Date().getFullYear();

  const [allVendors, categories, citiesInState] = await Promise.all([
    getVendorsByState(stateName),
    getCategories(),
    getUniqueCitiesByState(stateName),
  ]);

  // Filter to vendors in this specific city + national
  const cityVendors = allVendors.filter(
    (v) => v.city?.toLowerCase() === cityName.toLowerCase()
  );
  const nationalVendors = allVendors.filter(
    (v) =>
      v.service_area?.toLowerCase() === 'national' &&
      v.city?.toLowerCase() !== cityName.toLowerCase()
  );

  // Group local city vendors by category
  const cityVendorsByCategory: Record<string, typeof cityVendors> = {};
  for (const vendor of cityVendors) {
    if (!cityVendorsByCategory[vendor.category_slug]) {
      cityVendorsByCategory[vendor.category_slug] = [];
    }
    cityVendorsByCategory[vendor.category_slug].push(vendor);
  }

  // Categories that actually have vendors in this city
  const categoriesWithCityVendors = categories.filter(
    (c) => c.visible && cityVendorsByCategory[c.slug]?.length > 0
  );

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Best Storage Facility Vendors in ${cityName}, ${stateName}`,
    description: `Storage vendors in ${cityName}, ${stateName} across ${categoriesWithCityVendors.length} categories.`,
    url: `https://www.storageowneradvisor.com/best/storage-vendors/${state}/${city}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.storageowneradvisor.com' },
      { '@type': 'ListItem', position: 2, name: stateName, item: `https://www.storageowneradvisor.com/best/storage-vendors/${state}` },
      { '@type': 'ListItem', position: 3, name: cityName, item: `https://www.storageowneradvisor.com/best/storage-vendors/${state}/${city}` },
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
            <Link href={`/best/storage-vendors/${state}`} className="hover:text-white">
              {stateName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{cityName}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Best Storage Facility Vendors in {cityName}, {stateName} ({year})
          </h1>
          <p className="text-lg text-teal-100 max-w-3xl">
            {cityVendors.length > 0
              ? `Compare ${cityVendors.length} local vendors and ${nationalVendors.length} national providers serving storage facilities in ${cityName}.`
              : `Browse national storage vendors serving ${cityName}, ${stateName}.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {categoriesWithCityVendors.length > 0 ? (
              categoriesWithCityVendors.map((cat) => (
                <div key={cat.slug} className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-900">
                      {cat.name} in {cityName}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        ({cityVendorsByCategory[cat.slug].length})
                      </span>
                    </h2>
                    <Link
                      href={`/best/${cat.slug}/${state}/${city}`}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      View all →
                    </Link>
                  </div>
                  <ul className="space-y-2">
                    {cityVendorsByCategory[cat.slug].slice(0, 5).map((v) => (
                      <li key={v.slug}>
                        <Link
                          href={`/vendor/${v.slug}`}
                          className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                        >
                          {v.name}
                        </Link>
                        {v.short_description && (
                          <span className="text-gray-600 text-sm"> — {v.short_description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  No local vendors found in {cityName} yet
                </h2>
                <p className="text-gray-600 mb-4">
                  We don&apos;t have any vendors specifically headquartered in {cityName}, {stateName} yet.
                  Browse national providers serving the area, or see all vendors in {stateName}.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link
                    href={`/best/storage-vendors/${state}`}
                    className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700"
                  >
                    See all {stateName} vendors
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
            {/* Other cities in state */}
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
                        href={`/best/storage-vendors/${state}/${cityToSlug(c)}`}
                        className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {c}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Up to state */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-3">
                Statewide Listings
              </h3>
              <Link
                href={`/best/storage-vendors/${state}`}
                className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                All Vendors in {stateName}
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
