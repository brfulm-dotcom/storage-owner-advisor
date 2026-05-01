import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'About StorageOwnerAdvisor',
  description:
    "Independent research and reviews of vendors serving the self-storage industry. Learn about our editorial team, methodology, and how we keep reviews independent.",
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="About StorageOwnerAdvisor"
        subtitle="Independent research and reviews of vendors serving self-storage facility owners."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why We Exist</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Self-storage facility owners depend on dozens of outside vendors to keep
              their facilities running &mdash; management software, security systems,
              insurance, climate control, doors, payment processing, marketing, and
              more. Researching each one is time-consuming, and most operators end up
              choosing vendors based on word-of-mouth or whoever calls first.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              StorageOwnerAdvisor is an independent research site that profiles and
              compares those vendors. We do the legwork so storage owners can make
              faster, better-informed decisions about who they hire.
            </p>
          </div>
        </section>

        {/* Editorial Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Editorial Team
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              StorageOwnerAdvisor is run by a small editorial team focused full-time
              on the self-storage vendor landscape. We are not a self-storage
              operator, and we don&apos;t pretend to be. We are independent researchers
              who track this industry the way an analyst would: by reading trade
              publications, talking to vendors, monitoring operator forums, and
              testing products where we can.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our blog posts and vendor reviews are published under the
              StorageOwnerAdvisor Editorial Team byline. When subject-matter experts
              contribute (operators, attorneys, consultants), we credit them by
              name on the article.
            </p>
          </div>
        </section>

        {/* Scope */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What We Cover
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We currently track <strong>just under 1,000 vendors</strong> across these 12 categories
              serving the self-storage industry:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                ['Management Software', 'management-software'],
                ['Insurance', 'insurance'],
                ['Security Systems', 'security-systems'],
                ['Climate Control & HVAC', 'climate-control-hvac'],
                ['Doors & Hardware', 'doors-hardware'],
                ['Payment Processing', 'payment-processing'],
                ['Marketing & Web', 'marketing-web'],
                ['Cleaning & Maintenance', 'cleaning-maintenance'],
                ['Moving Supplies', 'moving-supplies'],
                ['Construction & Building', 'construction-building'],
                ['Signage & Lighting', 'signage-lighting'],
                ['Consulting & Brokerage', 'consulting-brokerage'],
              ].map(([name, slug]) => (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-gray-800 hover:text-blue-700 font-medium transition-colors text-sm"
                >
                  {name}
                </Link>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed mt-6 text-sm">
              We add new vendors and categories on an ongoing basis as the
              industry evolves.
            </p>
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            How We Evaluate Vendors
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Every vendor profile on StorageOwnerAdvisor is built using the same
              process:
            </p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Verification
                  </h4>
                  <p className="text-gray-700">
                    We confirm the company is an active business with a working
                    website, contact information, and an established footprint
                    serving self-storage operators.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Profile research
                  </h4>
                  <p className="text-gray-700">
                    We compile pricing, features, integrations, service area,
                    headquarters, year founded, and other facts from the
                    vendor&apos;s own materials and public sources.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Editorial rating
                  </h4>
                  <p className="text-gray-700">
                    Our editors assign an internal rating based on transparency,
                    feature depth, customer support reputation, and fit for the
                    self-storage use case.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Operator feedback
                  </h4>
                  <p className="text-gray-700">
                    Storage facility owners can leave reviews and ratings, which
                    we display alongside the editorial assessment. We moderate
                    submissions to remove spam but do not edit substance.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  5
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Ongoing updates
                  </h4>
                  <p className="text-gray-700">
                    Vendor information drifts. We re-check listings on a rolling
                    schedule and accept corrections from vendors and operators.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Editorial Independence */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Editorial Independence &amp; How We Make Money
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe operators deserve to know exactly how a review site is
              funded. Here&apos;s ours:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Affiliate links.</strong> Some outbound vendor links earn
                StorageOwnerAdvisor a commission if you sign up. This never
                affects our editorial rating, and we list vendors that don&apos;t
                pay us alongside vendors that do.
              </li>
              <li>
                <strong>Premium placement.</strong> Vendors can pay for a
                &ldquo;Featured&rdquo; or &ldquo;Premium&rdquo; placement on
                category pages. Paid placements are visually distinguished by
                tier badges and do not change a vendor&apos;s editorial rating
                or what we say about them.
              </li>
              <li>
                <strong>Display advertising.</strong> We may serve display ads
                on blog and informational pages. Vendor profile and comparison
                pages remain ad-free.
              </li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              We do not let vendors review or approve their own listings before
              publication, and no vendor pays to be removed from the directory.
              For full details, see our{' '}
              <Link href="/affiliate-disclosure" className="text-blue-600 hover:text-blue-700 font-medium underline">
                affiliate disclosure
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Sources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Sources
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              When we research vendors and write blog posts, we draw on:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2 text-gray-700">
              <li>Trade publications including <em>Inside Self-Storage</em> and the <em>Self-Storage Association</em></li>
              <li>Vendor websites, datasheets, pricing pages, and SEC filings (where applicable)</li>
              <li>Public storage operator forums, review platforms, and BBB records</li>
              <li>Direct conversations with vendors and self-storage operators</li>
              <li>State statutes and government databases for legal and compliance topics</li>
            </ul>
          </div>
        </section>

        {/* Corrections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Corrections &amp; Contact
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We try hard to get things right, but mistakes happen. If you spot
              an error in a vendor profile or blog post, please email{' '}
              <a href="mailto:support@storageowneradvisor.com" className="text-blue-600 hover:text-blue-700 font-medium">
                support@storageowneradvisor.com
              </a>{' '}
              and we&apos;ll review and correct it promptly.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Vendors who want to update their listing can reach us at the same
              address or use our{' '}
              <Link href="/submit" className="text-blue-600 hover:text-blue-700 font-medium underline">
                vendor submission form
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Browse Our Vendor Directory
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Independent research on management software, insurance, security,
            and the other vendors that keep self-storage facilities running.
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
            Submit your company for review and inclusion in our directory.
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
