import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Premium Listings - StorageOwnerAdvisor',
  description:
    'Boost your visibility in the self-storage industry with a premium vendor listing on StorageOwnerAdvisor.',
};

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get your business listed in the directory at no cost.',
    features: [
      'Basic business listing',
      'Company name and description',
      'Website link',
      'Category placement',
      'Contact information displayed',
    ],
    cta: 'Submit Your Listing',
    ctaLink: '/submit',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: 'Starting at $49',
    period: '/month',
    description:
      'Stand out with enhanced features and greater visibility.',
    features: [
      'Everything in Free',
      'Premium badge on your listing',
      'Enhanced company profile',
      'Priority placement in category pages',
      'Detailed business description',
      'Analytics dashboard (coming soon)',
    ],
    cta: 'Contact for Pricing',
    ctaLink: '/contact',
    highlighted: true,
  },
  {
    name: 'Featured',
    price: 'Contact for Pricing',
    period: '',
    description:
      'Maximum exposure with top placement across the directory.',
    features: [
      'Everything in Premium',
      'Featured badge and highlighting',
      'Top placement on homepage',
      'Priority in search results',
      'Featured in newsletter mentions',
      'Dedicated account support',
    ],
    cta: 'Get in Touch',
    ctaLink: '/contact',
    highlighted: false,
  },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Get More Visibility for Your Business
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium listings put your business in front of storage facility
            owners and operators actively searching for vendors like you.
          </p>
        </div>
      </div>

      {/* Why Premium */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Upgrade to Premium?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Storage facility owners use StorageOwnerAdvisor to find and evaluate
            vendors. A premium listing helps you stand out from the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">1</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Higher Visibility
            </h3>
            <p className="text-gray-600">
              Premium listings appear at the top of category pages and search
              results, so your business gets seen first.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Build Credibility
            </h3>
            <p className="text-gray-600">
              A premium badge signals to potential customers that your business
              is established and invested in the storage industry.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              More Leads
            </h3>
            <p className="text-gray-600">
              Enhanced profiles with detailed descriptions and prominent
              placement drive more qualified inquiries to your business.
            </p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600">
            Select the listing tier that fits your business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg border shadow-sm p-8 flex flex-col ${
                tier.highlighted
                  ? 'bg-white border-blue-600 border-2 relative'
                  : 'bg-white border-gray-200'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {tier.name}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-gray-500 text-sm">{tier.period}</span>
                )}
              </div>
              <p className="text-gray-600 mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.ctaLink}
                className={`block text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                  tier.highlighted
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-white rounded-lg border border-gray-200 shadow-sm p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-gray-600 mb-6">
            Have questions about premium listings or want to discuss a custom
            plan? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Our Team
            </Link>
            <a
              href="mailto:support@storageowneradvisor.com"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
