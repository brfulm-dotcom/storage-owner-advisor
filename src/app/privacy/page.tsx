import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Privacy Policy - StorageOwnerAdvisor',
  description:
    'Read the StorageOwnerAdvisor privacy policy. Learn how we collect, use, and protect your personal information when browsing our vendor directory.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Privacy Policy"
        subtitle="Your privacy matters to us. This policy explains how we handle your information."
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 sm:p-12">
          <p className="text-sm text-gray-500 mb-8">
            Last updated: April 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-10">
            {/* Introduction */}
            <section>
              <p className="text-gray-600 leading-relaxed">
                StorageOwnerAdvisor (&quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;) operates the website storageowneradvisor.com.
                This Privacy Policy describes how we collect, use, and share
                information when you visit or interact with our site.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-600 mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  <strong className="text-gray-900">Contact form submissions:</strong>{' '}
                  When you use our contact form, we collect your name, email
                  address, subject, and message content.
                </li>
                <li>
                  <strong className="text-gray-900">Vendor submission data:</strong>{' '}
                  If you submit a vendor listing, we collect business name,
                  description, contact information, website URL, and category
                  details.
                </li>
                <li>
                  <strong className="text-gray-900">Newsletter subscriptions:</strong>{' '}
                  When you subscribe to our newsletter, we collect your email
                  address.
                </li>
                <li>
                  <strong className="text-gray-900">Listing claim requests:</strong>{' '}
                  When you claim a business listing, we collect your name, email,
                  phone number, and role at the company.
                </li>
                <li>
                  <strong className="text-gray-900">Cookies and analytics data:</strong>{' '}
                  We use Google Analytics 4 (GA4) to collect anonymized usage
                  data including pages visited, time on site, referring URLs, and
                  general device and browser information.
                </li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>Respond to your inquiries and contact form submissions</li>
                <li>Process and manage vendor listings and claim requests</li>
                <li>Send newsletter emails to subscribers who have opted in</li>
                <li>
                  Improve our website, content, and user experience through
                  analytics
                </li>
                <li>
                  Maintain the accuracy and quality of our vendor directory
                </li>
                <li>
                  Communicate with vendors about their listings and account
                  status
                </li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Third-Party Services
              </h2>
              <p className="text-gray-600 mb-4">
                We use the following third-party services to operate our website:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  <strong className="text-gray-900">Supabase:</strong> Used for
                  secure data storage of form submissions, vendor listings, and
                  newsletter subscriptions.
                </li>
                <li>
                  <strong className="text-gray-900">Google Analytics 4 (GA4):</strong>{' '}
                  Used for website traffic analysis and understanding how
                  visitors use our site. Data collected is anonymized.
                </li>
                <li>
                  <strong className="text-gray-900">Resend:</strong> Used for
                  sending transactional emails and newsletter communications.
                </li>
                <li>
                  <strong className="text-gray-900">Vercel:</strong> Used for
                  website hosting and deployment.
                </li>
                <li>
                  <strong className="text-gray-900">Google AdSense:</strong>{' '}
                  Used to display advertisements on our site. Google and its
                  partners use cookies to serve ads based on your prior visits
                  to our website and other websites on the internet. See the
                  &quot;Advertising&quot; section below for details and opt-out
                  options.
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                Each of these services has its own privacy policy governing how
                they handle data. We encourage you to review their respective
                policies.
              </p>
            </section>

            {/* Advertising */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Advertising
              </h2>
              <p className="text-gray-600 mb-4">
                We use Google AdSense, a third-party advertising service
                provided by Google, to display ads on our site. Google AdSense
                and its partners (including third-party vendors) may use
                cookies, web beacons, and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  Serve ads to you based on your prior visits to our website
                  and other websites on the internet.
                </li>
                <li>
                  Measure ad performance and provide reports to advertisers.
                </li>
                <li>
                  Help prevent fraud and abuse on advertising platforms.
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                Google&apos;s use of advertising cookies enables it and its
                partners to serve ads to you based on your visit to this site
                and/or other sites on the internet. You can learn more about
                how Google uses information from sites or apps that use its
                services by visiting{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  policies.google.com/technologies/partner-sites
                </a>
                .
              </p>
              <p className="text-gray-600 mt-4">
                <strong className="text-gray-900">How to opt out:</strong> You
                can opt out of personalized advertising by:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  Visiting Google Ads Settings at{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    google.com/settings/ads
                  </a>{' '}
                  to manage your Google ad preferences.
                </li>
                <li>
                  Visiting{' '}
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    aboutads.info
                  </a>{' '}
                  to opt out of third-party vendor cookies for personalized
                  advertising.
                </li>
                <li>
                  Visiting{' '}
                  <a
                    href="https://www.youronlinechoices.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    youronlinechoices.eu
                  </a>{' '}
                  if you are located in the European Union.
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                Opting out of personalized advertising does not stop ads from
                being shown — you may still see non-personalized ads.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cookies
              </h2>
              <p className="text-gray-600 mb-4">
                Our website uses cookies and similar tracking technologies to
                enhance your experience and collect analytics data. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  <strong className="text-gray-900">Analytics cookies:</strong>{' '}
                  Google Analytics uses cookies to track page views, session
                  duration, and user interactions. These cookies help us
                  understand how visitors use our site.
                </li>
                <li>
                  <strong className="text-gray-900">Advertising cookies:</strong>{' '}
                  Google AdSense and its third-party partners use cookies to
                  serve and measure advertisements. See the
                  &quot;Advertising&quot; section below for opt-out options.
                </li>
                <li>
                  <strong className="text-gray-900">Essential cookies:</strong>{' '}
                  Some cookies are necessary for the proper functioning of our
                  website and cannot be disabled.
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                You can control cookie preferences through your browser
                settings. Disabling certain cookies may affect site
                functionality.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Data Retention
              </h2>
              <p className="text-gray-600">
                We retain your personal information for as long as necessary to
                fulfill the purposes described in this policy, unless a longer
                retention period is required or permitted by law. Contact form
                submissions are retained for up to 24 months. Newsletter
                subscriber data is retained until you unsubscribe. Vendor
                listing data is retained for as long as the listing is active on
                our platform.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Rights
              </h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  <strong className="text-gray-900">Access:</strong> You may
                  request a copy of the personal information we hold about you.
                </li>
                <li>
                  <strong className="text-gray-900">Correction:</strong> You may
                  request that we correct inaccurate or incomplete information.
                </li>
                <li>
                  <strong className="text-gray-900">Deletion:</strong> You may
                  request that we delete your personal information, subject to
                  certain legal exceptions.
                </li>
                <li>
                  <strong className="text-gray-900">Opt-out:</strong> You may
                  unsubscribe from our newsletter at any time by clicking the
                  unsubscribe link in any email we send.
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                To exercise any of these rights, please contact us using the
                information below.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or wish to
                exercise your data rights, please contact us at:
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
