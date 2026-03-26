import type { Metadata } from 'next';
import Link from 'next/link';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Blog - StorageOwnerAdvisor',
  description:
    'Industry insights, tips for storage facility owners, and vendor reviews coming soon to the StorageOwnerAdvisor blog.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Blog Coming Soon
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We are working on bringing you valuable content to help you run a
            better storage facility. Stay tuned for industry insights, vendor
            reviews, and practical tips from experts in the self-storage space.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Industry Insights
              </h3>
              <p className="text-gray-600 text-sm">
                Trends, market analysis, and news from the self-storage industry
                to keep you informed and ahead of the curve.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tips for Owners
              </h3>
              <p className="text-gray-600 text-sm">
                Practical advice on operations, marketing, technology adoption,
                and growing your storage business.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vendor Reviews
              </h3>
              <p className="text-gray-600 text-sm">
                In-depth looks at tools, software, and services that help
                storage facility owners operate more efficiently.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  );
}
