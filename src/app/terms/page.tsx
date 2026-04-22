import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Terms of Service - StorageOwnerAdvisor',
  description:
    'Read the terms and conditions for using the StorageOwnerAdvisor vendor directory.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Terms of Service"
        subtitle="Please review the terms and conditions that govern your use of StorageOwnerAdvisor."
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 sm:p-12">
          <p className="text-sm text-gray-500 mb-8">
            Last updated: March 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-10">
            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using the StorageOwnerAdvisor website
                (storageowneradvisor.com), you agree to be bound by these Terms
                of Service. If you do not agree to these terms, please do not
                use our website. We reserve the right to modify these terms at
                any time, and your continued use of the site following any
                changes constitutes acceptance of those changes.
              </p>
            </section>

            {/* Use of the Directory */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Use of the Directory
              </h2>
              <p className="text-gray-600 mb-4">
                StorageOwnerAdvisor is a free online directory that connects
                self-storage facility owners and operators with vendors and
                service providers in the storage industry. Please note:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  The directory is provided for informational purposes only. We
                  do not guarantee the accuracy, completeness, or reliability of
                  any vendor information listed on our site.
                </li>
                <li>
                  We do not endorse, recommend, or guarantee any vendor, product,
                  or service listed in our directory.
                </li>
                <li>
                  You are solely responsible for evaluating and vetting any
                  vendor before entering into a business relationship with them.
                </li>
                <li>
                  We are not a party to any transaction or agreement between you
                  and any vendor listed on our site.
                </li>
              </ul>
            </section>

            {/* Vendor Listings */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vendor Listings
              </h2>
              <p className="text-gray-600 mb-4">
                Vendors may submit their business information for inclusion in
                our directory. By submitting a listing, vendors agree to the
                following:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  All information provided must be accurate, current, and
                  complete. You are responsible for keeping your listing
                  information up to date.
                </li>
                <li>
                  StorageOwnerAdvisor reserves the right to approve, reject,
                  edit, or remove any listing at our sole discretion, for any
                  reason, without prior notice.
                </li>
                <li>
                  Vendors may claim existing listings by verifying their
                  identity and association with the business. Claims are subject
                  to our review and approval process.
                </li>
                <li>
                  Listings must not contain misleading, false, or deceptive
                  information. We reserve the right to remove listings that
                  violate this requirement.
                </li>
              </ul>
            </section>

            {/* Premium Listings */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Premium Listings
              </h2>
              <p className="text-gray-600 mb-4">
                We offer premium and featured listing options for vendors who
                wish to enhance their visibility on our platform. Regarding
                premium listings:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  Premium placement is a paid service and does not constitute an
                  endorsement or recommendation by StorageOwnerAdvisor.
                </li>
                <li>
                  Premium listing features, pricing, and availability are
                  subject to change at our discretion.
                </li>
                <li>
                  Payment terms, refund policies, and specific feature details
                  will be communicated directly during the purchase process.
                </li>
                <li>
                  We reserve the right to revoke premium status if a vendor
                  violates these Terms of Service.
                </li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Intellectual Property
              </h2>
              <p className="text-gray-600">
                All content on StorageOwnerAdvisor, including but not limited to
                text, graphics, logos, design elements, and software, is the
                property of StorageOwnerAdvisor or its content suppliers and is
                protected by applicable intellectual property laws. You may not
                reproduce, distribute, modify, or create derivative works from
                any content on this site without our prior written permission.
                Vendor-submitted content remains the property of the respective
                vendors, and vendors grant us a non-exclusive license to display
                their submitted information on our platform.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-4">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  StorageOwnerAdvisor is provided on an &quot;as is&quot; and
                  &quot;as available&quot; basis without warranties of any kind,
                  either express or implied.
                </li>
                <li>
                  We shall not be liable for any direct, indirect, incidental,
                  special, consequential, or punitive damages arising from your
                  use of or inability to use our website or directory.
                </li>
                <li>
                  We are not responsible for any loss, damage, or harm resulting
                  from your interactions with vendors listed on our site.
                </li>
                <li>
                  We do not guarantee that our website will be available at all
                  times or free from errors, viruses, or other harmful
                  components.
                </li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Changes to Terms
              </h2>
              <p className="text-gray-600">
                We may update these Terms of Service from time to time. When we
                make changes, we will update the &quot;Last updated&quot; date
                at the top of this page. We encourage you to review these terms
                periodically. Your continued use of StorageOwnerAdvisor after
                any modifications indicates your acceptance of the updated
                terms.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <p className="text-gray-600">
                Email:{' '}
                <a
                  href="mailto:support@storageowneradvisor.com"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  support@storageowneradvisor.com
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
