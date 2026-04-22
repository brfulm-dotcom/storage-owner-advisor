import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryBySlug, getVendorsByCategory, getCategorySlugs } from '@/lib/supabase';
import SortableVendorGrid from '@/components/SortableVendorGrid';
import { generateCategoryJsonLd, generateCategoryBreadcrumbJsonLd } from '@/lib/seo';

// Revalidate hourly; admin actions trigger on-demand revalidation for instant updates
export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: CategoryPageProps
): Promise<Metadata> {
  const params = await props.params;
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.name} Vendors - StorageOwnerAdvisor`,
    description: `Find trusted ${category.name} vendors for your storage facility. Compare reviews and features from top-rated providers.`,
    alternates: {
      canonical: `https://www.storageowneradvisor.com/category/${params.slug}`,
    },
    openGraph: {
      title: `${category.name} Vendors - StorageOwnerAdvisor`,
      description: `Find trusted ${category.name} vendors for your storage facility.`,
      type: 'website',
    },
  };
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The category you&apos;re looking for doesn&apos;t exist.
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

  const vendors = await getVendorsByCategory(category.slug);
  const jsonLd = generateCategoryJsonLd(category);
  const breadcrumbJsonLd = generateCategoryBreadcrumbJsonLd(category);

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
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Categories
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      {category.hero_image ? (
        <div className="relative py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 overflow-hidden">
          <Image
            src={`/${category.hero_image}`}
            alt=""
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-gray-900/80" />
          <div className="relative max-w-7xl mx-auto">
            <div className="flex items-start gap-6 mb-2">
              <div className="text-5xl">{category.icon}</div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {category.name}
                </h1>
                <p className="text-lg text-blue-100">{category.description}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-5xl">{category.icon}</div>
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h1>
                <p className="text-xl text-gray-600">{category.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendors Grid */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {vendors.length > 0 && (
            <p className="text-xs text-gray-500 mb-6">
              This page may contain affiliate links. We may earn a commission at no extra cost to you.{' '}
              <Link href="/affiliate-disclosure" className="text-blue-600 underline hover:text-blue-700">
                Learn more
              </Link>
            </p>
          )}
          {vendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-6">
                No vendors found in this category yet.
              </p>
              <Link
                href="/submit"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit a Vendor
              </Link>
            </div>
          ) : (
            <SortableVendorGrid vendors={vendors} />
          )}
        </div>
      </div>
    </div>
  );
}
