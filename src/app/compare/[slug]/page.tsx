import type { Metadata } from 'next';
import Link from 'next/link';
import { getVendorBySlug, getVendorsByCategory, getCategoryBySlug } from '@/lib/supabase';
import { Vendor } from '@/lib/supabase';
import StarRating from '@/components/StarRating';

export const revalidate = 3600;

interface ComparePageProps {
  params: Promise<{ slug: string }>;
}

function parseCompareSlug(slug: string): { slug1: string; slug2: string } | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return null;
  return { slug1: parts[0], slug2: parts[1] };
}

// Generate comparison pages for vendors in the same category
export async function generateStaticParams() {
  // Focus on management software first — highest value comparisons
  const categories = ['management-software'];
  const params: { slug: string }[] = [];

  for (const cat of categories) {
    const vendors = await getVendorsByCategory(cat);
    // Generate pairs for top vendors (limit to avoid too many pages)
    const topVendors = vendors.slice(0, 10);
    for (let i = 0; i < topVendors.length; i++) {
      for (let j = i + 1; j < topVendors.length; j++) {
        params.push({ slug: `${topVendors[i].slug}-vs-${topVendors[j].slug}` });
      }
    }
  }

  return params;
}

export async function generateMetadata(props: ComparePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const parsed = parseCompareSlug(slug);
  if (!parsed) return { title: 'Comparison Not Found' };

  const [vendor1, vendor2] = await Promise.all([
    getVendorBySlug(parsed.slug1),
    getVendorBySlug(parsed.slug2),
  ]);

  if (!vendor1 || !vendor2) return { title: 'Comparison Not Found' };

  const year = new Date().getFullYear();
  // Always canonicalize to alphabetical order to avoid a-vs-b / b-vs-a duplicates
  const canonicalSlug = [parsed.slug1, parsed.slug2].sort().join('-vs-');

  return {
    title: `${vendor1.name} vs ${vendor2.name} (${year}) | StorageOwnerAdvisor`,
    description: `Compare ${vendor1.name} and ${vendor2.name} side by side. See features, pricing, ratings, pros & cons to find the best solution for your storage facility.`,
    alternates: {
      canonical: `https://www.storageowneradvisor.com/compare/${canonicalSlug}`,
    },
    openGraph: {
      title: `${vendor1.name} vs ${vendor2.name} (${year})`,
      description: `Side-by-side comparison of ${vendor1.name} and ${vendor2.name} for self-storage facilities.`,
      type: 'website',
    },
  };
}

function CompareField({
  label,
  value1,
  value2,
  type = 'text',
}: {
  label: string;
  value1: string | number | null | undefined;
  value2: string | number | null | undefined;
  type?: 'text' | 'rating' | 'badge';
}) {
  const v1 = value1 ?? '—';
  const v2 = value2 ?? '—';

  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 items-center">
      <div className="text-sm font-semibold text-gray-600">{label}</div>
      <div className="text-sm text-gray-900 text-center">
        {type === 'rating' && typeof value1 === 'number' ? (
          <span className="text-yellow-500">{'★'.repeat(Math.round(value1))}{'☆'.repeat(5 - Math.round(value1))}</span>
        ) : type === 'badge' ? (
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${value1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {value1 ? 'Yes' : 'No'}
          </span>
        ) : (
          String(v1)
        )}
      </div>
      <div className="text-sm text-gray-900 text-center">
        {type === 'rating' && typeof value2 === 'number' ? (
          <span className="text-yellow-500">{'★'.repeat(Math.round(value2))}{'☆'.repeat(5 - Math.round(value2))}</span>
        ) : type === 'badge' ? (
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${value2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {value2 ? 'Yes' : 'No'}
          </span>
        ) : (
          String(v2)
        )}
      </div>
    </div>
  );
}

function ProConSection({ vendor, color }: { vendor: Vendor; color: 'blue' | 'teal' }) {
  const bgColor = color === 'blue' ? 'bg-blue-50' : 'bg-teal-50';
  return (
    <div className={`${bgColor} rounded-lg p-4`}>
      <h3 className="font-bold text-gray-900 mb-3">{vendor.name}</h3>
      {vendor.pros && vendor.pros.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-green-700 mb-1">PROS</p>
          <ul className="space-y-1">
            {vendor.pros.map((pro, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
      )}
      {vendor.cons && vendor.cons.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-700 mb-1">CONS</p>
          <ul className="space-y-1">
            {vendor.cons.map((con, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(!vendor.pros || vendor.pros.length === 0) && (!vendor.cons || vendor.cons.length === 0) && (
        <p className="text-sm text-gray-500 italic">Pros and cons coming soon</p>
      )}
    </div>
  );
}

export default async function ComparePage(props: ComparePageProps) {
  const { slug } = await props.params;
  const parsed = parseCompareSlug(slug);

  if (!parsed) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Comparison</h1>
          <p className="text-gray-600 mb-4">The comparison URL format should be /compare/vendor1-vs-vendor2</p>
          <Link href="/" className="text-blue-600 hover:underline">Go home</Link>
        </div>
      </div>
    );
  }

  const [vendor1, vendor2] = await Promise.all([
    getVendorBySlug(parsed.slug1),
    getVendorBySlug(parsed.slug2),
  ]);

  if (!vendor1 || !vendor2) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Not Found</h1>
          <p className="text-gray-600 mb-4">One or both vendors could not be found.</p>
          <Link href="/" className="text-blue-600 hover:underline">Go home</Link>
        </div>
      </div>
    );
  }

  const category = await getCategoryBySlug(vendor1.category_slug);
  const year = new Date().getFullYear();

  // Get other vendors in category for "Compare with others" sidebar
  const categoryVendors = await getVendorsByCategory(vendor1.category_slug);
  const otherVendors = categoryVendors.filter(
    (v) => v.slug !== vendor1.slug && v.slug !== vendor2.slug
  ).slice(0, 6);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${vendor1.name} vs ${vendor2.name}`,
    description: `Side-by-side comparison of ${vendor1.name} and ${vendor2.name}`,
    url: `https://www.storageowneradvisor.com/compare/${slug}`,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-teal-200 mb-3">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            {category && (
              <>
                <Link href={`/category/${category.slug}`} className="hover:text-white">
                  {category.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-white">Compare</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {vendor1.name} vs {vendor2.name} ({year})
          </h1>
          <p className="text-teal-100 max-w-3xl">
            Side-by-side comparison to help you choose the best {category?.name?.toLowerCase() || 'solution'} for your storage facility.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Comparison */}
          <div className="lg:col-span-3">
            {/* Vendor Headers */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="grid grid-cols-3 gap-4">
                <div></div>
                <div className="text-center">
                  <Link href={`/vendor/${vendor1.slug}`} className="hover:text-blue-600">
                    <h2 className="font-bold text-gray-900 text-lg">{vendor1.name}</h2>
                  </Link>
                  <div className="flex justify-center mt-1">
                    <StarRating rating={vendor1.rating} reviewCount={vendor1.review_count} />
                  </div>
                  {vendor1.verified && (
                    <span className="inline-block mt-1 text-xs text-blue-600 font-semibold">✓ Verified</span>
                  )}
                </div>
                <div className="text-center">
                  <Link href={`/vendor/${vendor2.slug}`} className="hover:text-blue-600">
                    <h2 className="font-bold text-gray-900 text-lg">{vendor2.name}</h2>
                  </Link>
                  <div className="flex justify-center mt-1">
                    <StarRating rating={vendor2.rating} reviewCount={vendor2.review_count} />
                  </div>
                  {vendor2.verified && (
                    <span className="inline-block mt-1 text-xs text-blue-600 font-semibold">✓ Verified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Overview Comparison */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h2 className="font-bold text-gray-900 mb-3">Overview</h2>
              <CompareField label="Rating" value1={vendor1.rating} value2={vendor2.rating} type="rating" />
              <CompareField label="Reviews" value1={vendor1.review_count} value2={vendor2.review_count} />
              <CompareField label="Founded" value1={vendor1.year_founded} value2={vendor2.year_founded} />
              <CompareField label="Headquarters" value1={vendor1.headquarters} value2={vendor2.headquarters} />
              <CompareField label="Service Area" value1={vendor1.service_area} value2={vendor2.service_area} />
              <CompareField label="Pricing" value1={vendor1.pricing} value2={vendor2.pricing} />
              <CompareField label="Verified" value1={vendor1.verified ? 1 : 0} value2={vendor2.verified ? 1 : 0} type="badge" />
            </div>

            {/* Features Comparison */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h2 className="font-bold text-gray-900 mb-3">Features</h2>
              {(() => {
                const allFeatures = Array.from(new Set([
                  ...(vendor1.features || []),
                  ...(vendor2.features || []),
                ]));
                if (allFeatures.length === 0) return <p className="text-sm text-gray-500 italic">No feature data available</p>;
                return allFeatures.map((feature) => (
                  <CompareField
                    key={feature}
                    label={feature}
                    value1={(vendor1.features || []).includes(feature) ? 1 : 0}
                    value2={(vendor2.features || []).includes(feature) ? 1 : 0}
                    type="badge"
                  />
                ));
              })()}
            </div>

            {/* Pros & Cons */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h2 className="font-bold text-gray-900 mb-4">Pros & Cons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProConSection vendor={vendor1} color="blue" />
                <ProConSection vendor={vendor2} color="teal" />
              </div>
            </div>

            {/* Descriptions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h2 className="font-bold text-gray-900 mb-4">Detailed Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{vendor1.name}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{vendor1.full_description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{vendor2.name}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{vendor2.full_description}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href={vendor1.affiliate_url || vendor1.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Visit {vendor1.name}
              </a>
              <a
                href={vendor2.affiliate_url || vendor2.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-teal-600 text-white text-center px-6 py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors"
              >
                Visit {vendor2.name}
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Verdict */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-3">Quick Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Higher Rated:</span>
                  <p className="font-semibold text-gray-900">
                    {vendor1.rating > vendor2.rating
                      ? vendor1.name
                      : vendor2.rating > vendor1.rating
                      ? vendor2.name
                      : 'Tied'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">More Reviews:</span>
                  <p className="font-semibold text-gray-900">
                    {vendor1.review_count > vendor2.review_count
                      ? `${vendor1.name} (${vendor1.review_count})`
                      : vendor2.review_count > vendor1.review_count
                      ? `${vendor2.name} (${vendor2.review_count})`
                      : 'Tied'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">More Features:</span>
                  <p className="font-semibold text-gray-900">
                    {(vendor1.features?.length || 0) > (vendor2.features?.length || 0)
                      ? `${vendor1.name} (${vendor1.features?.length || 0})`
                      : (vendor2.features?.length || 0) > (vendor1.features?.length || 0)
                      ? `${vendor2.name} (${vendor2.features?.length || 0})`
                      : 'Tied'}
                  </p>
                </div>
              </div>
            </div>

            {/* Compare with others */}
            {otherVendors.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">Other Comparisons</h3>
                <div className="space-y-2">
                  {otherVendors.map((v) => (
                    <div key={v.slug} className="space-y-1">
                      <Link
                        href={`/compare/${vendor1.slug}-vs-${v.slug}`}
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {vendor1.name} vs {v.name}
                      </Link>
                      <Link
                        href={`/compare/${vendor2.slug}-vs-${v.slug}`}
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {vendor2.name} vs {v.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-bold text-teal-900 mb-2">Need help choosing?</h3>
              <p className="text-sm text-teal-700 mb-3">
                Contact us for a personalized recommendation based on your facility&apos;s needs.
              </p>
              <Link
                href="/contact"
                className="block text-center bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-700"
              >
                Get a Recommendation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
