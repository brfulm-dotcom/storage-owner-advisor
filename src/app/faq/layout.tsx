import type { Metadata } from 'next';
import { faqs } from './faq-data';

export const metadata: Metadata = {
  title: 'Self-Storage FAQ: Operations, Vendors & Software | StorageOwnerAdvisor',
  description:
    'Answers to common self-storage questions: occupancy rates, profitability, management software, insurance, pricing, security, and finding vetted vendors for your facility.',
  alternates: {
    canonical: 'https://www.storageowneradvisor.com/faq',
  },
  openGraph: {
    title: 'Self-Storage FAQ | StorageOwnerAdvisor',
    description:
      'Answers to common self-storage questions about operations, software, insurance, pricing, and finding vendors.',
    type: 'website',
    url: 'https://www.storageowneradvisor.com/faq',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answerText,
    },
  })),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.storageowneradvisor.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'FAQ',
      item: 'https://www.storageowneradvisor.com/faq',
    },
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
