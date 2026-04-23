import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | StorageOwnerAdvisor',
  description: 'Contact the StorageOwnerAdvisor team with questions about vendors, listings, or partnerships. We help self-storage owners find trusted service providers.',
  alternates: {
    canonical: 'https://www.storageowneradvisor.com/contact',
  },
  openGraph: {
    title: 'Contact Us | StorageOwnerAdvisor',
    description: 'Reach out to the StorageOwnerAdvisor team with questions, feedback, or vendor inquiries.',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
