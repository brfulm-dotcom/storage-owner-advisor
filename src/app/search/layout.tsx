import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Vendors - StorageOwnerAdvisor',
  description:
    'Search vetted vendors for self-storage facilities. Filter by category to find security systems, management software, insurance, construction, and more.',
  alternates: {
    canonical: '/search',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
