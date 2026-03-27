import type { Metadata } from 'next';
import Link from 'next/link';
import { getVendorBySlug, getCategoryBySlug, getVendorSlugs } from '@/lib/supabase';
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
  const jsonLd = generateVendorJsonLd(vendor);
  const breadcrumbJsonLd = generateVendorBreadcrumbJsonLd(vendor, category);
  const localBusinessJsonLd = generateLocalBusinessJsonLd(vendor);

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

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {vendor.name}
                    </h1>
                    {category && (
                      <Link
                        href={`/category/${category.slug}`}
                        className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        {category.name}
                      </Link>
                    )}
                  </div>
                  {vendor.tier && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
                      {vendor.tier}
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <StarRating rating={vendor.rating} reviewCount={vendor.review_count} />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Overview
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {vendor.full_description}
                  </p>
                </div>

                {/* Features */}
                {vendor.features && vendor.features.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Key Features
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {vendor.features.map((feature) => (
                        <span
                          key={feature}
                          className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                {vendor.pricing && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Pricing
                    </h2>
                    <p className="text-lg text-gray-700">{vendor.pricing}</p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {vendor.website && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Website
                      </p>
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 break-all"
                      >
                        {vendor.website}
                      </a>
                    </div>
                  )}
                  {vendor.phone && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${vendor.phone}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {vendor.phone}
                      </a>
                    </div>
                  )}
                  {vendor.email && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${vendor.email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {vendor.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* CTA Button */}
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8 sticky top-6">
                <TrackedLink
                  href={vendor.affiliate_url || vendor.website}
                  vendorSlug={vendor.slug}
                  vendorName={vendor.name}
                  clickType={vendor.affiliate_url ? 'affiliate' : 'website'}
                  className="block w-full bg-blue-600 text-white text-center px-6 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors mb-4"
                >
                  Visit Website
                </TrackedLink>
                <p className="text-sm text-gray-600 text-center">
                  Opens in a new window
                </p>
              </div>

              {/* Claim This Listing */}
              <div className="mb-8">
                <ClaimListing vendorSlug={vendor.slug} vendorName={vendor.name} />
              </div>

              {/* Company Info */}
              {(vendor.year_founded || vendor.headquarters) && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Company Info
                  </h3>
                  <div className="space-y-4">
                    {vendor.year_founded && (
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Founded
                        </p>
                        <p className="text-gray-900">{vendor.year_founded}</p>
                      </div>
                    )}
                    {vendor.headquarters && (
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Headquarters
                        </p>
                        <p className="text-gray-900">{vendor.headquarters}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
