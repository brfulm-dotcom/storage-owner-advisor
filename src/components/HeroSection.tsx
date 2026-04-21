'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  vendorCount?: number;
  categoryCount?: number;
}

export default function HeroSection({ vendorCount, categoryCount }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularSearches = [
    { label: 'Management Software', slug: 'management-software' },
    { label: 'Security Systems', slug: 'security-systems' },
    { label: 'Moving Supplies', slug: 'moving-supplies' },
    { label: 'Insurance', slug: 'insurance' },
  ];

  return (
    <section className="relative py-6 sm:py-8 md:py-10 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        quality={85}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-gray-900/80" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-center drop-shadow-lg">
          Find Trusted Vendors for Your Storage Facility
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-base text-blue-100 text-center mb-4 max-w-2xl mx-auto">
          The leading directory of vetted service providers, equipment suppliers, and technology partners for self-storage owners and operators.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Search vendors, services, or products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-lg"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap shadow-lg"
          >
            Search
          </button>
        </form>

        {/* Popular Searches */}
        <div className="text-center mb-4">
          <p className="text-xs text-blue-200 mb-2">Popular:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((search) => (
              <Link
                key={search.slug}
                href={`/category/${search.slug}`}
                className="px-4 py-2 bg-white/90 rounded-full text-gray-700 font-medium hover:bg-blue-600 hover:text-white transition-colors border border-white/20 backdrop-blur-sm"
              >
                {search.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Stat Bar - compact inline */}
        {(vendorCount || categoryCount) && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-blue-100 pt-3 border-t border-white/20 max-w-2xl mx-auto">
            {vendorCount ? (
              <span>
                <strong className="text-white">{vendorCount}+</strong> Vetted Vendors
              </span>
            ) : null}
            {categoryCount ? (
              <span>
                <strong className="text-white">{categoryCount}</strong> Categories
              </span>
            ) : null}
            <span>
              <strong className="text-white">100%</strong> Free to Browse
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
