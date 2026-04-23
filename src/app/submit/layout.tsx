import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Your Vendor - StorageOwnerAdvisor',
  description:
    'Submit your company to the StorageOwnerAdvisor directory. Reach thousands of self-storage facility owners searching for vendors and service providers.',
  alternates: {
    canonical: '/submit',
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
