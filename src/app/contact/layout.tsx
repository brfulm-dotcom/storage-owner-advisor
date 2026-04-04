import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | StorageOwnerAdvisor',
  description: 'Get in touch with the StorageOwnerAdvisor team. We help connect storage facility owners with trusted vendors and service providers.',
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
