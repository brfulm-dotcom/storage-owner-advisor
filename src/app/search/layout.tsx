import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Vendors - StorageOwnerAdvisor',
  description:
    'Search and filter vetted vendors for your storage facility. Find solutions for security, management software, insurance, and more.',
  alternates: {
    canonical: '/search',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
