import type { Metadata } from 'next';
import { faqs } from './faq-data';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | StorageOwnerAdvisor',
  description: 'Answers to common questions about StorageOwnerAdvisor — how to find self-storage vendors, submit a listing, claim your business, and get help.',
  alternates: {
    canonical: 'https://www.storageowneradvisor.com/faq',
  },
  openGraph: {
    title: 'FAQ | StorageOwnerAdvisor',
    description: 'Answers to common questions about finding storage facility vendors on StorageOwnerAdvisor.',
    type: 'website',
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
      text: faq.answer,
    },
  })),
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
