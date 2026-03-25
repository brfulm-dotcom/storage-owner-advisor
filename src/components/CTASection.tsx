import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 sm:py-14 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Are You a Vendor?
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Get your products and services in front of thousands of storage facility owners. List your company in our directory.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Submit Free Listing
          </Link>
          <Link
            href="/premium"
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Learn About Premium Listings
          </Link>
        </div>
      </div>
    </section>
  );
}
