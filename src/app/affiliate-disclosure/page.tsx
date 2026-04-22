import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure - StorageOwnerAdvisor',
  description:
    'Learn how StorageOwnerAdvisor uses affiliate links and how they support our mission to help storage facility owners find trusted vendors.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Affiliate Disclosure"
        subtitle="Transparency is important to us. Here's how affiliate links work on our site."
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 sm:p-12">
          <p className="text-sm text-gray-500 mb-8">
            Last updated: April 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-10">
            {/* Overview */}
            <section>
              <p className="text-gray-600 leading-relaxed">
                StorageOwnerAdvisor (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a B2B directory that helps self-storage facility owners and operators discover trusted vendors and service providers. To support the operation and maintenance of this site, some of the links on StorageOwnerAdvisor are affiliate links.
              </p>
            </section>

            {/* What Are Affiliate Links */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What Are Affiliate Links?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Affiliate links are special tracking links that allow us to earn a small commission when you click through and make a purchase or sign up for a service. This happens at no additional cost to you — the price you pay remains the same whether you use our link or go directly to the vendor&apos;s website.
              </p>
            </section>

            {/* How We Use Affiliate Links */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How We Use Affiliate Links
              </h2>
              <p className="text-gray-600 mb-4">
                Affiliate links may appear in the following places on our site:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>Vendor listing pages and directory entries</li>
                <li>Category pages featuring vendor recommendations</li>
                <li>Blog posts and guides that reference specific products or services</li>
                <li>Comparison pages</li>
              </ul>
            </section>

            {/* Our Commitment to Honest Recommendations */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Commitment to Honest Recommendations
              </h2>
              <p className="text-gray-600 mb-4">
                We want to be clear: affiliate relationships do not influence our recommendations, rankings, or reviews. Our editorial process is guided by the following principles:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  <strong className="text-gray-900">Independence:</strong> We evaluate vendors based on their merits, including features, pricing, customer reviews, and relevance to the self-storage industry.
                </li>
                <li>
                  <strong className="text-gray-900">Transparency:</strong> We disclose affiliate relationships so you can make informed decisions.
                </li>
                <li>
                  <strong className="text-gray-900">User-first approach:</strong> Our primary goal is to help storage facility owners find the best solutions for their business, not to maximize affiliate revenue.
                </li>
                <li>
                  <strong className="text-gray-900">Equal coverage:</strong> We include vendors in our directory regardless of whether they offer an affiliate program.
                </li>
              </ul>
            </section>

            {/* How Commissions Support Our Work */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How Commissions Support Our Work
              </h2>
              <p className="text-gray-600 leading-relaxed">
                The commissions we earn through affiliate links help us cover the costs of running StorageOwnerAdvisor, including website hosting, content creation, research, and ongoing maintenance of our vendor directory. This allows us to continue providing free, high-quality resources to self-storage facility owners and operators.
              </p>
            </section>

            {/* FTC Compliance */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                FTC Compliance
              </h2>
              <p className="text-gray-600 leading-relaxed">
                In accordance with the Federal Trade Commission (FTC) guidelines, we disclose that StorageOwnerAdvisor may receive compensation for links to third-party products and services. We are committed to providing honest opinions and recommendations, and our affiliate relationships do not affect our editorial integrity.
              </p>
            </section>

            {/* Questions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions?
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about our affiliate relationships or this disclosure, please don&apos;t hesitate to reach out:
              </p>
              <p className="text-gray-600">
                Email:{' '}
                <a
                  href="mailto:info@storageowneradvisor.com"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  info@storageowneradvisor.com
                </a>
              </p>
              <p className="text-gray-600 mt-4">
                You can also reach us through our{' '}
                <Link
                  href="/contact"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
