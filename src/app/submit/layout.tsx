import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Your Vendor - StorageOwnerAdvisor',
  description:
    'Submit your company to be listed on the StorageOwnerAdvisor vendor directory. Reach thousands of storage facility owners.',
  alternates: {
    canonical: '/submit',
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
