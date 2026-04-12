import type { Metadata } from 'next';
import Link from 'next/link';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Guides - StorageOwnerAdvisor',
  description:
    'Comprehensive guides for storage facility owners on choosing vendors, comparing solutions, and industry best practices. Coming soon.',
  alternates: {
    canonical: '/guides',
  },
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Guides Coming Soon
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We are building a library of comprehensive guides to help storage
            facility owners make informed decisions about vendors, technology,
            and operations.
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
                Vendor Selection
              </h3>
              <p className="text-gray-600 text-sm">
                Step-by-step guides on how to evaluate and choose the right
                vendors for your storage facility needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comparison Guides
              </h3>
              <p className="text-gray-600 text-sm">
                Side-by-side comparisons of popular solutions for management
                software, security systems, insurance, and more.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Best Practices
              </h3>
              <p className="text-gray-600 text-sm">
                Industry best practices for facility management, customer
                service, revenue optimization, and operational efficiency.
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
