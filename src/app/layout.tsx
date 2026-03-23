import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StorageOwnerAdvisor - Find Trusted Vendors for Your Storage Facility',
  description:
    'Discover vetted, reliable vendors for storage facilities. Find solutions for security, climate control, property management, and more. Compare top-rated service providers.',
  keywords: [
    'storage facility vendors',
    'storage owners',
    'facility management',
    'storage solutions',
  ],
  openGraph: {
    title: 'StorageOwnerAdvisor - Find Trusted Vendors',
    description: 'Discover vetted vendors trusted by storage facility owners.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XMKTCY24QK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XMKTCY24QK');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
