import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About StorageOwnerAdvisor',
  description:
    'Learn about our mission to connect storage facility owners with vetted, trusted vendors and service providers.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About StorageOwnerAdvisor
          </h1>
          <p className="text-xl text-gray-600">
            Your trusted directory for finding vetted vendors and service
            providers for storage facilities.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              StorageOwnerAdvisor exists to simplify how storage facility owners
              find and evaluate service providers. Running a storage facility
              requires partnerships with numerous vendors—from property
              management platforms to climate control systems, security
              solutions, and more.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We've built this directory to save you time and effort by
              curating a vetted list of trusted vendors across all major
              service categories. No more endless Googling, cold calling, or
              guessing whether a vendor will deliver on their promises.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Curated Vendor Directory
              </h3>
              <p className="text-gray-700">
                Browse vendors organized by service category. From security
                systems to tenant screening, find solutions tailored to storage
                facility operations.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Detailed Profiles
              </h3>
              <p className="text-gray-700">
                View pricing, features, contact info, and customer reviews for
                each vendor. Make informed decisions based on comprehensive
                information.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Vendor Ratings
              </h3>
              <p className="text-gray-700">
                See ratings and reviews from other storage facility owners. Learn
                from real customer experiences with each vendor.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Easy Search
              </h3>
              <p className="text-gray-700">
                Quickly find vendors by name, category, or service type. Get
                exactly what you're looking for in seconds.
              </p>
            </div>
          </div>
        </section>

        {/* Vetting Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Vetting Process
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Every vendor in our directory is vetted to ensure quality and
              reliability:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Business Verification
                  </h4>
                  <p className="text-gray-700">
                    We verify that companies are legitimate, established
                    businesses in good standing.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Storage Industry Experience
                  </h4>
                  <p className="text-gray-700">
                    We prioritize vendors with proven experience serving storage
                    facilities.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Customer Reviews
                  </h4>
                  <p className="text-gray-700">
                    We collect and display genuine feedback from storage facility
                    owners who have used these services.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Ongoing Monitoring
                  </h4>
                  <p className="text-gray-700">
                    We regularly review and update vendor information to ensure
                    accuracy and quality.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Why Trust Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why Storage Owners Trust StorageOwnerAdvisor
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-4xl font-bold text-blue-600 mb-2">100+</p>
                <p className="text-gray-700">
                  Vetted vendors across major service categories
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-600 mb-2">50K+</p>
                <p className="text-gray-700">
                  Storage facility owners using our directory monthly
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-600 mb-2">4.7★</p>
                <p className="text-gray-700">
                  Average rating from facility owner reviews
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find the Right Vendors?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Browse our directory of trusted service providers for your storage
            facility.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Browse Vendors
          </Link>
        </section>

        {/* Submit Section */}
        <section className="mt-16 bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Are You a Vendor?
          </h2>
          <p className="text-gray-700 mb-6">
            Get listed on StorageOwnerAdvisor and reach thousands of storage
            facility owners looking for your solutions.
          </p>
          <Link
            href="/submit"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Submit Your Vendor Profile
          </Link>
        </section>
      </div>
    </div>
  );
}
