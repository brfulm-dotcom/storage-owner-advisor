import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getCategories,
  getVendorsByState,
  getUniqueStates,
  getUniqueCitiesByState,
} from '@/lib/supabase';

export const revalidate = 3600;

interface StateOverviewProps {
  params: Promise<{ state: string }>;
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

export async function generateStaticParams() {
  const states = await getUniqueStates();
  return states.map((state) => ({ state: stateToSlug(state) }));
}

export async function generateMetadata(props: StateOverviewProps): Promise<Metadata> {
  const { state } = await props.params;
  const stateName = slugToName(state);
  const year = new Date().getFullYear();

  return {
    title: `Best Storage Facility Vendors in ${stateName} (${year}) | StorageOwnerAdvisor`,
    description: `Find the best self-storage vendors in ${stateName}. Compare software, security, construction, insurance, and more for your storage facility.`,
    alternates: {
      canonical: `https://www.storageowneradvisor.com/best/storage-vendors/${state}`,
    },
    openGraph: {
      title: `Best Storage Facility Vendors in ${stateName} (${year})`,
      description: `Compare top storage facility vendors across all categories in ${stateName}.`,
      type: 'website',
    },
  };
}

export default async function StateOverviewPage(props: StateOverviewProps) {
  const { state } = await props.params;
  const stateName = slugToName(state);
  const year = new Date().getFullYear();

  const [vendors, categories, cities, allStates] = await Promise.all([
    getVendorsByState(stateName),
    getCategories(),
    getUniqueCitiesByState(stateName),
    getUniqueStates(),
  ]);

  // Group vendors by category
  const vendorsByCategory: Record<string, typeof vendors> = {};
  for (const vendor of vendors) {
    if (!vendorsByCategory[vendor.category_slug]) {
      vendorsByCategory[vendor.category_slug] = [];
    }
    vendorsByCategory[vendor.category_slug].push(vendor);
  }

  const localCount = vendors.filter(
    (v) => v.state?.toLowerCase() === stateName.toLowerCase()
  ).length;
  const nationalCount = vendors.filter(
    (v) => v.service_area?.toLowerCase() === 'national'
  ).length;

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Best Storage Facility Vendors in ${stateName}`,
    description: `Compare top storage vendors in ${stateName} across ${Object.keys(vendorsByCategory).length} categories.`,
    url: `https://www.storageowneradvisor.com/best/storage-vendors/${stateToSlug(stateName)}`,
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
            <span className="text-white">Storage Vendors in {stateName}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Best Storage Facility Vendors in {stateName} ({year})
          </h1>
          <p className="text-lg text-teal-100 max-w-3xl">
            {vendors.length} vendors across {Object.keys(vendorsByCategory).length} categories
            serving storage facilities in {stateName}.
            {localCount > 0 && ` ${localCount} local providers`}
            {nationalCount > 0 && ` and ${nationalCount} national companies`}.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories
                .filter((c) => c.visible && vendorsByCategory[c.slug]?.length > 0)
                .map((cat) => {
                  const catVendors = vendorsByCategory[cat.slug] || [];
                  const topVendors = catVendors.slice(0, 3);

                  return (
                    <Link
                      key={cat.slug}
                      href={`/best/${cat.slug}/${stateToSlug(stateName)}`}
                      className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-teal-300 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <h2 className="font-bold text-gray-900">{cat.name}</h2>
                          <p className="text-sm text-teal-600">
                            {catVendors.length} vendor{catVendors.length !== 1 ? 's' : ''} in {stateName}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {topVendors.map((v) => (
                          <div key={v.slug} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 truncate">{v.name}</span>
                            <span className="text-yellow-500 ml-2">
                              {'★'.repeat(Math.round(v.rating))}
                            </span>
                          </div>
                        ))}
                        {catVendors.length > 3 && (
                          <p className="text-xs text-gray-500 mt-1">
                            + {catVendors.length - 3} more →
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
            </div>

            {/* No vendors */}
            {vendors.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  No vendors found in {stateName}
                </h2>
                <p className="text-gray-600 mb-4">
                  We&apos;re still building our vendor directory for {stateName}.
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
            {/* Cities — link into the first visible category for this state */}
            {cities.length > 0 && categories.filter((c) => c.visible)[0] && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">
                  Cities in {stateName}
                </h3>
                <div className="space-y-1">
                  {cities.slice(0, 10).map((city) => (
                    <Link
                      key={city}
                      href={`/best/${categories.filter((c) => c.visible)[0].slug}/${city.toLowerCase().replace(/\s+/g, '-')}-${stateToSlug(stateName)}`}
                      className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other states — dynamically generated */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-3">
                Other States
              </h3>
              <div className="space-y-1">
                {allStates
                  .filter((s) => s.toLowerCase() !== stateName.toLowerCase())
                  .slice(0, 10)
                  .map((s) => (
                    <Link
                      key={s}
                      href={`/best/storage-vendors/${stateToSlug(s)}`}
                      className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {s}
                    </Link>
                  ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-bold text-teal-900 mb-2">
                Are you a vendor in {stateName}?
              </h3>
              <p className="text-sm text-teal-700 mb-3">
                Get listed and reach storage facility owners across {stateName}.
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
