import Link from 'next/link';

export default function HomeIntro() {
  return (
    <section className="bg-white py-12 sm:py-16 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Independent Research for Self-Storage Owners
        </h2>

        <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
          <p>
            Self-storage facility owners depend on dozens of outside vendors
            to run their businesses every day. Management software, security
            systems, insurance, climate control, doors and locks, payment
            processing, signage, marketing, and a dozen other categories each
            need a trusted provider. Researching them one at a time is
            time-consuming, and most operators end up choosing vendors based
            on word-of-mouth or whoever calls first.
          </p>
          <p>
            StorageOwnerAdvisor is an independent directory built to fix that
            problem. Our editorial team profiles and compares nearly 1,000
            vendors serving the U.S. self-storage industry across 12 service
            categories, and we publish in-depth guides on the operating
            decisions that drive occupancy, revenue, and net operating income
            at the facility level.
          </p>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">
          What you will find here
        </h3>

        <ul className="space-y-4 text-base text-gray-700 leading-relaxed">
          <li>
            <strong className="text-gray-900">
              Vendor profiles and comparisons.
            </strong>{' '}
            Pricing, features, integrations, service area, and ratings for
            software, security, insurance, HVAC, doors, payments, marketing,
            signage, and more.
          </li>
          <li>
            <strong className="text-gray-900">Editorial buyer guides.</strong>{' '}
            Practical category overviews from our editorial team that help
            you evaluate options before you talk to a salesperson.
          </li>
          <li>
            <strong className="text-gray-900">
              Operations playbooks on the{' '}
              <Link
                href="/blog"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                blog
              </Link>
              .
            </strong>{' '}
            In-depth articles on revenue management, tenant insurance, lien
            sales, occupancy, and the day-to-day decisions that move facility
            NOI.
          </li>
          <li>
            <strong className="text-gray-900">
              Honest editorial independence.
            </strong>{' '}
            We disclose how the site makes money on our{' '}
            <Link
              href="/about"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              About page
            </Link>{' '}
            and{' '}
            <Link
              href="/affiliate-disclosure"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Affiliate Disclosure
            </Link>
            . No vendor pays to be removed from the directory.
          </li>
        </ul>

        <p className="mt-8 text-base sm:text-lg text-gray-700 leading-relaxed">
          Storage operators who want to spend less time chasing vendors and
          more time running their facilities are why we built this site.
        </p>
      </div>
    </section>
  );
}
