import type { Metadata } from 'next';
import Link from 'next/link';
import { getVendorBySlug, getCategoryBySlug, getVendorSlugs, getRelatedVendors } from '@/lib/supabase';
import StarRating from '@/components/StarRating';
import ClaimListing from '@/components/ClaimListing';
import { generateVendorJsonLd, generateVendorBreadcrumbJsonLd, generateLocalBusinessJsonLd } from '@/lib/seo';
import TrackedLink from '@/components/TrackedLink';

// Revalidate every 60 seconds
export const revalidate = 60;

interface VendorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getVendorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: VendorPageProps
): Promise<Metadata> {
  const params = await props.params;
  const vendor = await getVendorBySlug(params.slug);

  if (!vendor) {
    return {
      title: 'Vendor Not Found',
      description: 'The requested vendor could not be found.',
    };
  }

  return {
    title: `${vendor.name} - StorageOwnerAdvisor`,
    description: vendor.short_description,
    openGraph: {
      title: `${vendor.name} - StorageOwnerAdvisor`,
      description: vendor.short_description,
      type: 'website',
    },
  };
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (parsed.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return url;
  } catch {
    return null;
  }
}

export default async function VendorPage(props: VendorPageProps) {
  const params = await props.params;
  const vendor = await getVendorBySlug(params.slug);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Vendor Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The vendor you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const category = await getCategoryBySlug(vendor.category_slug);
  const relatedVendors = await getRelatedVendors(vendor.category_slug, vendor.slug);
  const jsonLd = generateVendorJsonLd(vendor);
  const breadcrumbJsonLd = generateVendorBreadcrumbJsonLd(vendor, category);
  const localBusinessJsonLd = generateLocalBusinessJsonLd(vendor);
  const embedUrl = vendor.video_url ? getYouTubeEmbedUrl(vendor.video_url) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {localBusinessJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            {category && (
              <>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {category.name}
                </Link>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900 font-semibold">{vendor.name}</span>
          </nav>
        </div>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Logo */}
                    {vendor.logo && (
                      <img
                        src={vendor.logo}
                        alt={`${vendor.name} logo`}
                        className="w-16 h-16 rounded-lg object-contain border border-gray-200 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {vendor.name}
                        </h1>
                        {/* Verified Badge */}
                        {vendor.verified && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      {category && (
                        <Link
                          href={`/category/${category.slug}`}
                          className="inline-block text-blue-600 hover:text-blue-700 font-semibold text-sm mt-1"
                        >
                          {category.name}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Tier Badge */}
                    {vendor.tier && vendor.tier !== 'free' && (
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg font-semibold text-sm">
                        {vendor.tier}
                      </div>
                    )}
                  </div>
                </div>

                {/* Badges */}
                {vendor.badges && vendor.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vendor.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-200"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                  <StarRating rating={vendor.rating} reviewCount={vendor.review_count} />
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Overview</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {vendor.full_description}
                  </p>
                </div>
              </div>

              {/* Features */}
              {vendor.features && vendor.features.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {vendor.features.map((feature) => (
                      <span
                        key={feature}
                        className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              {vendor.pricing && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Pricing</h2>
                  <p className="text-gray-700">{vendor.pricing}</p>
                </div>
              )}

              {/* Pros & Cons */}
              {((vendor.pros && vendor.pros.length > 0) || (vendor.cons && vendor.cons.length > 0)) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Pros & Cons</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {vendor.pros && vendor.pros.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3">Pros</h3>
                        <ul className="space-y-2">
                          {vendor.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {vendor.cons && vendor.cons.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-3">Cons</h3>
                        <ul className="space-y-2">
                          {vendor.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Screenshots */}
              {vendor.screenshots && vendor.screenshots.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Screenshots</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vendor.screenshots.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={url}
                          alt={`${vendor.name} screenshot ${i + 1}`}
                          className="w-full rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {embedUrl && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Video</h2>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={embedUrl}
                      title={`${vendor.name} video`}
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* FAQ */}
              {vendor.faq && vendor.faq.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {vendor.faq.map((item, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.question}</h3>
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Vendors */}
              {relatedVendors.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Similar Vendors in {category?.name || 'this category'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedVendors.map((rv) => (
                      <Link
                        key={rv.slug}
                        href={`/vendor/${rv.slug}`}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        {rv.logo && (
                          <img
                            src={rv.logo}
                            alt={`${rv.name} logo`}
                            className="w-10 h-10 rounded object-contain border border-gray-100 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">{rv.name}</h3>
                            {rv.verified && (
                              <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{rv.short_description}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500 text-xs">★</span>
                            <span className="text-xs text-gray-600">{rv.rating?.toFixed(1)}</span>
                            <span className="text-xs text-gray-400">({rv.review_count})</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">
                {/* Company Info & Contact */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Company Info</h3>
                  <div className="space-y-3 text-sm">
                    {vendor.year_founded && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Founded</span>
                        <span className="text-gray-900 font-medium">{vendor.year_founded}</span>
                      </div>
                    )}
                    {vendor.headquarters && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">HQ</span>
                        <span className="text-gray-900 font-medium">{vendor.headquarters}</span>
                      </div>
                    )}
                    {(vendor.city || vendor.state) && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location</span>
                        <span className="text-gray-900 font-medium">
                          {[vendor.city, vendor.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone</span>
                        <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                          {vendor.phone}
                        </a>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email</span>
                        <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:text-blue-700 font-medium truncate ml-2">
                          {vendor.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <TrackedLink
                    href={vendor.affiliate_url || vendor.website}
                    vendorSlug={vendor.slug}
                    vendorName={vendor.name}
                    clickType={vendor.affiliate_url ? 'affiliate' : 'website'}
                    className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors mb-2"
                  >
                    Visit Website
                  </TrackedLink>
                  <p className="text-sm text-gray-600 text-center">
                    Opens in a new window
                  </p>
                </div>

                {/* Claim This Listing - only show if not verified/claimed */}
                {!vendor.verified && (
                  <ClaimListing vendorSlug={vendor.slug} vendorName={vendor.name} />
                )}

                {/* Premium CTA for free vendors */}
                {vendor.tier === 'free' && !vendor.verified && (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Are you {vendor.name}?</h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Upgrade to Premium to stand out with enhanced features, priority placement, and verified status.
                    </p>
                    <Link
                      href="/premium"
                      className="block w-full text-center bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors"
                    >
                      Learn About Premium
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
