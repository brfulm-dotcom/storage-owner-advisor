import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | StorageOwnerAdvisor',
  description: 'Find answers to common questions about StorageOwnerAdvisor — how to find vendors, submit a listing, leave reviews, and more.',
  alternates: {
    canonical: 'https://www.storageowneradvisor.com/faq',
  },
  openGraph: {
    title: 'FAQ | StorageOwnerAdvisor',
    description: 'Answers to common questions about finding storage facility vendors on StorageOwnerAdvisor.',
    type: 'website',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
